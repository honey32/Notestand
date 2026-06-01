/**
 * GIS 移行後に gapi.client で使う API（init / getToken / setToken）。
 * @types/gapi.client は古く、これらは gapi.auth 側にしか定義されていない。
 * @see https://developers.google.com/identity/oauth2/web/guides/migration-to-gis
 */
/// <reference types="gapi.client" />

declare namespace gapi.client {
  interface ClientInitOptions {
    apiKey?: string;
    discoveryDocs?: string[];
    /** auth2 用（GIS では未使用） */
    clientId?: string;
    scope?: string;
  }

  interface ClientAccessToken {
    access_token: string;
  }

  function init(options: ClientInitOptions): Promise<void>;

  function getToken(): ClientAccessToken | null;

  function setToken(token: ClientAccessToken | null): void;
}
