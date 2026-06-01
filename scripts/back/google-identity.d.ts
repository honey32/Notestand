/** Minimal types for Google Identity Services (OAuth 2.0 token client). */
declare namespace google {
  namespace accounts {
    namespace oauth2 {
      interface TokenResponse {
        access_token: string;
        expires_in: number;
        scope: string;
        token_type: string;
        error?: string;
        error_description?: string;
      }

      interface TokenClient {
        callback: (response: TokenResponse) => void;
        requestAccessToken(overrides?: { prompt?: string; hint?: string }): void;
      }

      interface TokenClientConfig {
        client_id: string;
        scope: string;
        callback: (response: TokenResponse) => void;
        error_callback?: (error: { type: string }) => void;
      }

      function initTokenClient(config: TokenClientConfig): TokenClient;
      function revoke(token: string, done: () => void): void;
    }
  }
}
