import { FastifyPluginAsync } from "fastify";
import { authService } from "./auth.service.js";

export const authController: FastifyPluginAsync = async (fastify) => {
  fastify.get("/login", async (req, reply) => {
    const { code_verifier, code_challenge } = authService.generatePkce();
    const state = authService.generateState();

    const cookieOptions = {
      httpOnly: true,
      secure: false, // só em dev
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 10,
    };

    reply.setCookie("pkce_code_verifier", code_verifier, cookieOptions);

    reply.setCookie("oauth_state", state, cookieOptions);

    const authorizationUrl = authService.buildAuthorizationUrl({
      state,
      code_challenge,
    });

    return reply.redirect(authorizationUrl);
  });

  fastify.get("/callback", async (req, reply) => {
    const { code, state } = req.query as {
      code?: string;
      state?: string;
    };

    if (!code) {
      return reply.status(400).send({
        error: "Missing authorization code",
      });
    }

    const code_verifier = req.cookies.pkce_code_verifier;

    if (!code_verifier) {
      return reply.status(401).send({
        error: "Missing code verifier",
      });
    }

    if (!state) {
      return reply.status(400).send({
        error: "Missing state",
      });
    }

    const storedState = req.cookies.oauth_state;

    const validState = authService.validateState(state, storedState);

    if (!validState) {
      return reply.status(401).send({
        error: "Invalid state",
      });
    }

    const tokens = await authService.exchangeCodeForTokens(code, code_verifier);

    if (!tokens) {
      return reply.status(401).send({
        error: "Token exchange failed",
      });
    }

    reply.clearCookie("oauth_state");

    reply.clearCookie("pkce_code_verifier");

    const cookieOptions = {
      httpOnly: true,
      secure: false, // só em dev
      sameSite: "lax" as const,
      path: "/",
    };

    reply.setCookie("access_token", tokens.access_token, cookieOptions);
    reply.setCookie("refresh_token", tokens.refresh_token, cookieOptions);

    return reply.redirect(process.env.FRONTEND_URL!);
  });

  fastify.get("/me", async (req, reply) => {
    const access_token = req.cookies.access_token;


    if (!access_token){
      return reply.status(401).send({
        error: "Missing access token",
      });
    }
    const user = await authService.getUserInfo(access_token);

    if (!user) {
      return reply.status(401).send({
        error: "Invalid access token",
      });
    }

    return reply.status(200).send(user);
  })
};
