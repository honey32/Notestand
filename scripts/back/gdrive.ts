/// <reference types="gapi.client.drive" />
/// <reference types="gapi.auth2" />

import { wait, run, waitLowPriority } from "../util/lazy";
import { useState } from "react";
import { useRecoilState, RecoilState, atom } from "recoil";
// import { account } from "../store";

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
// export function useAccount() {
//   return account;
// }

const account_r = atom<string>({
  key: "google_account_name",
  default: "",
});

export function useAccount() {
  const [name, setName] = useRecoilState(account_r);
  const signIn = async () => {
    const u = await GDrive.signIn();
    setName(u.getBasicProfile().getName());
  };
  const signOut = () => {
    GDrive.signOut();
    setName("");
  };
  return { signIn, signOut, name };
}

class GDriveHandler {
  initialized: boolean = false;
  requestedSignIn: boolean = false;
  requestHandler = new RequestHandler();

  constructor() {
    window["checkAuth"] = () => {
      this.checkAuth();
    };
  }

  private checkAuth() {
    const clientId = process.env.GD_CLIENT_ID;
    gapi.load("client:auth2", () => {
      gapi.client
        .init({
          apiKey: process.env.GD_API_KEY,
          clientId,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
          ],
          scope: "https://www.googleapis.com/auth/drive",
        })
        .then(() => {
          const listener = (isSignedIn: boolean) => {
            account = isSignedIn
              ? gapi.auth2
                  .getAuthInstance()
                  .currentUser.get()
                  .getBasicProfile()
                  .getName()
              : "";

            this.initialized = isSignedIn;
          };
          gapi.auth2.getAuthInstance().isSignedIn.listen(listener);
          listener(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    });
  }

  signIn() {
    return gapi.auth2.getAuthInstance().signIn({ prompt: "select_account" });
  }

  signOut() {
    gapi.auth2.getAuthInstance().signOut();
  }

  private async loadGdrive() {
    let offlineCnt = 0;
    while (!this.initialized) {
      await wait(1000);
      offlineCnt = navigator.onLine ? 0 : offlineCnt + 1;
      if (offlineCnt > 5) {
        throw new OfflineException();
      }
    }
  }

  async listFiles(q: string, pageSize: number = 120) {
    await this.loadGdrive();

    let pageToken = "";
    const files: GDriveFile[] = [];

    do {
      const response = await this.requestHandler.addRequest<
        gapi.client.drive.FileList
      >(
        gapi.client.drive.files.list({
          pageSize,
          ...(pageToken ? { pageToken } : {}),
          q,
          fields: "nextPageToken, files(id, name)",
        })
      );
      pageToken = response.result.nextPageToken;
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
    await this.loadGdrive();
    const resp: Response<Partial<
      GDriveFile
    >> = await this.requestHandler.addRequest(
      gapi.client.drive.files.get({ fileId })
    );
    return resp.result as GDriveFile;
  }

  async getContent(id: string, type?: "string"): Promise<string>;
  async getContent(id: string, type: "typed-array"): Promise<Uint8Array>;
  async getContent(
    id: string,
    type: "string" | "typed-array" = "string"
  ): Promise<string | Uint8Array> {
    await this.loadGdrive();
    const resp: Response<string> = await this.requestHandler.addRequest<string>(
      (gapi.client.drive.files.get({
        alt: "media",
        fileId: id,
      }) as unknown) as Request<string>
    );
    const rawstring = resp.body;
    return type === "string"
      ? rawstring
      : Uint8Array.from(rawstring.split("").map((e) => e.charCodeAt(0)));
  }
}

class RequestHandler {
  requests: Request<any>[] = [];
  constructor() {
    run(async () => {
      while (true) {
        await waitLowPriority(1000);
        if (this.requests.length) {
          this.batch(this.requests).execute(() => {});
          this.requests.fill(undefined, 0, this.requests.length);
          this.requests.length = 0;
        }
      }
    });
  }

  batch(requests: Request<any>[]): gapi.client.Batch<any> {
    const b = gapi.client.newBatch();
    for (let i = 0; i < requests.length; i++) {
      b.add(requests[i]);
    }
    return b;
  }

  async addRequest<A>(
    r: Request<A>,
    retryTime: number = 0
  ): Promise<Response<A>> {
    if (retryTime > 10) {
      throw "Retry Limit Exceeded";
    }
    this.requests.push(r);
    const res = await r;
    if (res.status === 403) {
      console.log(
        `403: User Rate Limit Exceeded. wait ${1000 * 2 ** retryTime}ms`
      );
      await (1000 * 2 ** retryTime);
      return this.addRequest(r, retryTime + 1);
    } else {
      return res;
    }
  }
}

export const GDrive: GDriveHandler = new GDriveHandler();
