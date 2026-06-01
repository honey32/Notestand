/// <reference types="gapi.client.drive" />
/// <reference path="./google-identity.d.ts" />
/// <reference path="./gapi-client-gis.d.ts" />

import { wait, run, waitLowPriority } from "../util/lazy";
import { useRecoilState, atom } from "recoil";

export interface GDriveFile {
  name: string;
  id: string;
}
export type Request<T> = gapi.client.Request<T>;
export type Response<T> = gapi.client.Response<T>;

type GDriveException = OfflineException | WrappedException;
export class OfflineException {}
export class WrappedException {
  constructor(public wrapped: any) {}
}

let account: string = "";

const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive";

const account_r = atom<string>({
  key: "google_account_name",
  default: "",
});

export function useAccount() {
  const [name, setName] = useRecoilState(account_r);
  const signIn = async () => {
    const displayName = await GDrive.signIn();
    setName(displayName);
  };
  const signOut = () => {
    GDrive.signOut();
    setName("");
  };
  return { signIn, signOut, name };
}

//#region GDriveHandler
class GDriveHandler {
  #initialized = false;
  #requestHandler = new RequestHandler(() => this.#ensureAccessToken());

  #gapiScriptLoaded = false;
  #gisScriptLoaded = false;
  #initStarted = false;
  #tokenClient: google.accounts.oauth2.TokenClient | null = null;

  constructor() {
    window["checkAuth"] = () => {
      this.#gapiScriptLoaded = true;
      this.#tryInit();
    };
    window["checkGis"] = () => {
      this.#gisScriptLoaded = true;
      this.#tryInit();
    };
  }

  #tryInit() {
    if (!this.#gapiScriptLoaded) return;
    if (!this.#gisScriptLoaded) return;
    if (this.#initStarted) return;

    this.#initStarted = true;
    gapi.load("client", () => {
      void this.#initClients();
    });
  }

  async #initClients() {
    const clientId = process.env.GD_CLIENT_ID;
    if (!clientId) {
      console.error("GD_CLIENT_ID is not set");
      return;
    }
    try {
      await gapi.client.init({
        apiKey: process.env.GD_API_KEY,
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
        ],
      });
      this.#tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: DRIVE_SCOPE,
        callback: () => {},
      });
      await this.#tryRestoreSession();
    } catch (err) {
      console.error("Google API client init failed:", err);
    }
  }

  /** Re-request token when prior consent exists (no full re-login UI when possible). */
  async #tryRestoreSession() {
    try {
      await this.#requestAccessToken({ prompt: "" });
      account = await this.#fetchUserDisplayName();
      this.#initialized = true;
    } catch {
      this.#initialized = false;
    }
  }

  #requestAccessToken(options: { prompt?: string } = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.#tokenClient) {
        reject(new Error("Google Identity Services is not initialized"));
        return;
      }
      this.#tokenClient.callback = (tokenResponse) => {
        if (tokenResponse.error) {
          const { error, error_description } = tokenResponse;
          reject(new Error(`${error}: ${error_description || ""}`));
          return;
        }
        resolve();
      };
      this.#tokenClient.requestAccessToken(options);
    });
  }

  /** Used by API layer when access token expired (GIS does not auto-refresh). */
  async #ensureAccessToken(): Promise<void> {
    const token = gapi.client.getToken();
    if (token?.access_token) return;

    await this.#requestAccessToken({ prompt: "" });
  }

  async #fetchUserDisplayName(): Promise<string> {
    const resp = await gapi.client.drive.about.get({
      fields: "user(displayName)",
    });
    return resp.result.user?.displayName || "";
  }

  async signIn(): Promise<string> {
    await this.#requestAccessToken({ prompt: "select_account" });
    const displayName = await this.#fetchUserDisplayName();
    account = displayName;
    this.#initialized = true;
    return displayName;
  }

  signOut() {
    const token = gapi.client.getToken();
    if (token?.access_token) {
      google.accounts.oauth2.revoke(token.access_token, () => {
        gapi.client.setToken(null);
      });
    } else {
      gapi.client.setToken(null);
    }
    account = "";
    this.#initialized = false;
  }

  async #loadGdrive() {
    let offlineCnt = 0;
    while (!this.#initialized) {
      await wait(1000);
      offlineCnt = navigator.onLine ? 0 : offlineCnt + 1;
      if (offlineCnt > 5) {
        throw new OfflineException();
      }
    }
  }

  async listFiles(q: string, pageSize: number = 120) {
    await this.#loadGdrive();

    let pageToken = "";
    const files: GDriveFile[] = [];

    do {
      const response =
        await this.#requestHandler.addRequest<gapi.client.drive.FileList>(
          gapi.client.drive.files.list({
            pageSize,
            ...(pageToken ? { pageToken } : {}),
            q,
            fields: "nextPageToken, files(id, name)",
          }),
        );
      pageToken = response.result.nextPageToken ?? "";
      files.push(...(response.result.files as GDriveFile[]));
    } while (pageToken);

    return files;
  }

  async findOneFile(q: string) {
    const files = await this.listFiles(q, 1);
    if (files.length) {
      return files[0];
    }
    return null;
  }

  async getFileItself(fileId: string): Promise<GDriveFile> {
    await this.#loadGdrive();
    const resp: Response<Partial<GDriveFile>> =
      await this.#requestHandler.addRequest(
        gapi.client.drive.files.get({ fileId }),
      );
    return resp.result as GDriveFile;
  }

  async getContent(id: string, type?: "string"): Promise<string>;
  async getContent(id: string, type: "typed-array"): Promise<Uint8Array>;
  async getContent(
    id: string,
    type: "string" | "typed-array" = "string",
  ): Promise<string | Uint8Array> {
    await this.#loadGdrive();
    const resp: Response<string> =
      await this.#requestHandler.addRequest<string>(
        gapi.client.drive.files.get({
          alt: "media",
          fileId: id,
        }) as unknown as Request<string>,
      );
    const rawstring = resp.body;
    return type === "string"
      ? rawstring
      : Uint8Array.from(rawstring.split("").map((e) => e.charCodeAt(0)));
  }
}

//#region RequestHandler
class RequestHandler {
  #requests: Array<Request<any> | undefined> = [];
  #refreshToken: () => Promise<void>;

  constructor(refreshToken: () => Promise<void>) {
    this.#refreshToken = refreshToken;
    run(async () => {
      while (true) {
        await waitLowPriority(1000);
        if (this.#requests.length) {
          this.#batch(this.#requests).execute(() => {});
          this.#requests.fill(undefined, 0, this.#requests.length);
          this.#requests.length = 0;
        }
      }
    });
  }

  #batch(requests: Array<Request<any> | undefined>): gapi.client.Batch<any> {
    const b = gapi.client.newBatch();
    for (let i = 0; i < requests.length; i++) {
      const request = requests[i];
      if (!request) continue;
      b.add(request);
    }
    return b;
  }

  async addRequest<A>(
    r: Request<A>,
    retryTime: number = 0,
  ): Promise<Response<A>> {
    if (retryTime > 10) {
      throw "Retry Limit Exceeded";
    }
    this.#requests.push(r);
    const res = await r;

    if (res.status === 401 && retryTime < 3) {
      gapi.client.setToken(null);
      try {
        await this.#refreshToken();
        return this.addRequest(r, retryTime + 1);
      } catch {
        throw "Authorization required";
      }
    }

    if (res.status === 403) {
      console.log(
        `403: User Rate Limit Exceeded. wait ${1000 * 2 ** retryTime}ms`,
      );
      await wait(1000 * 2 ** retryTime);
      return this.addRequest(r, retryTime + 1);
    }

    return res;
  }
}

export const GDrive: GDriveHandler = new GDriveHandler();
