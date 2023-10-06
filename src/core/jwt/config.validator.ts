import { Static, Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

const jwtConfig = Type.Object({
	secret: Type.String({
		minLength: 1,
	}),
});

export type JWTConfig = Static<typeof jwtConfig>;

const compiledSchema = TypeCompiler.Compile(jwtConfig);

const validateJWTConfig = (config: JWTConfig): boolean => {
	return compiledSchema.Check(config);
};

export default validateJWTConfig;
