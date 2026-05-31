import crypto from "node:crypto";

type BuildAuthorizationUrlParams = {
  state: string;
  code_challenge: string;
};

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  id_token: string;

  expires_in: number;
  refresh_expires_in: number;

  token_type: string;
  scope: string;
};

export const authService = {
  generatePkce() {
    const code_verifier = crypto.randomBytes(32).toString("base64url");

    const code_challenge = crypto
      .createHash("sha256")
      .update(code_verifier)
      .digest("base64url");

    return {
      code_verifier,
      code_challenge,
    };
  },

  generateState() {
    return crypto.randomBytes(32).toString("base64url");
  },

  buildAuthorizationUrl({
    state,
    code_challenge,
  }: BuildAuthorizationUrlParams) {
    const authorizationUrl = new URL(
      `${process.env.KEYCLOAK_ISSUER}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/auth`,
    );

    authorizationUrl.searchParams.set(
      "client_id",
      process.env.KEYCLOAK_CLIENT_ID!,
    );

    authorizationUrl.searchParams.set(
      "redirect_uri",
      process.env.KEYCLOAK_REDIRECT_URI!,
    );

    authorizationUrl.searchParams.set("response_type", "code");

    authorizationUrl.searchParams.set("scope", "openid profile email");

    authorizationUrl.searchParams.set("state", state);

    authorizationUrl.searchParams.set("code_challenge", code_challenge);

    authorizationUrl.searchParams.set("code_challenge_method", "S256");

    return authorizationUrl.toString();
  },

  validateState(received: string, stored: string | undefined) {
    if (!stored || received !== stored) {
      return false;
    }
    return true;
  },

  async exchangeCodeForTokens(code: string, code_verifier: string) {
    const tokenEndpoint = `${process.env.KEYCLOAK_ISSUER}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`;

    const response = await fetch(tokenEndpoint, {
      method: "POST",

      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },

      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.KEYCLOAK_CLIENT_ID!,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
        code,
        redirect_uri: process.env.KEYCLOAK_REDIRECT_URI!,
        code_verifier,
      }),
    });

    if (!response.ok) {
      return null;
    }

    return response.json() as Promise<TokenResponse>;
  },

  async getUserInfo(access_token: string) {
    const userInfoEndpoint =
      `${process.env.KEYCLOAK_ISSUER}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`;

    const response = await fetch(userInfoEndpoint, {
      method: "GET",

      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  }
};
