import validateJwtConfig, { JwtConfig } from "./config.validator";

const jwtConfig: JwtConfig = {
	secret: process.env.JWT_SECRET ?? "",
};

if (!validateJwtConfig(jwtConfig)) {
	throw new Error("Invalid JWT configuration");
}

Object.freeze(jwtConfig);

export { jwtConfig };
