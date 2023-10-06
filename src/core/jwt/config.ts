import validateJWTConfig, { JWTConfig } from "./config.validator";

const jwtConfig: JWTConfig = {
	secret: process.env.JWT_SECRET ?? "",
};

if (!validateJWTConfig(jwtConfig)) {
	throw new Error("Invalid JWT configuration");
}

Object.freeze(jwtConfig);

export { jwtConfig };
