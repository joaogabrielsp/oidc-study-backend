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
  if (!payload.sub) {
    return false;
  }

  if (payload.azp !== clientId) {
  return false;
}

  return true;
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: `${issuer}/realms/${realm}`,
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
