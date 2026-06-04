import { createRemoteJWKSet, jwtVerify } from "jose";
import type { JWTPayload } from "jose";

export type KeycloakPayload = JWTPayload & {
  email?: string;
  preferred_username?: string;
  name?: string;
};

const issuer = process.env.KEYCLOAK_ISSUER!;
const realm = process.env.KEYCLOAK_REALM!;
const clientId = process.env.KEYCLOAK_CLIENT_ID!;

const jwks = createRemoteJWKSet(
  new URL(`${issuer}/realms/${realm}/protocol/openid-connect/certs`),
);

export function validateClaims(payload: JWTPayload) {
  const expectedIssuer = `${issuer}/realms/${realm}`;

  // issuer
  if (payload.iss !== expectedIssuer) {
    return false;
  }

  // exp
  if (!payload.exp || payload.exp * 1000 < Date.now()) {
    return false;
  }

  // sub
  if (!payload.sub) {
    return false;
  }

  // aud
  const aud = payload.aud;

  const validAud =
    typeof aud === "string"
      ? aud === clientId
      : Array.isArray(aud)
        ? aud.includes(clientId!)
        : false;

  if (!validAud) {
    return false;
  }

  return true;
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: `${issuer}/realms/${realm}`,
      audience: clientId,
    });

    const isValid = validateClaims(payload);

    if (!isValid) {
      return null;
    }

    return payload as KeycloakPayload;
  } catch (err) {
    return null;
  }
}
