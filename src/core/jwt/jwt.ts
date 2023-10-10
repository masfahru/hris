import { VerifierAsync, createSigner, createVerifier } from "fast-jwt";
import { jwtConfig } from "./config";

export const signSync = createSigner({
  key: jwtConfig.secret,
  noTimestamp: true,
  expiresIn: "10y",
});

export const verifyAsync: typeof VerifierAsync = createVerifier({
  key: async () => jwtConfig.secret,
  ignoreExpiration: true,
});
