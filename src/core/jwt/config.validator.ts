import { Static, Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

const jwtConfig = Type.Object({
  secret: Type.String({
    minLength: 1,
  }),
});

export type JwtConfig = Static<typeof jwtConfig>;

const compiledSchema = TypeCompiler.Compile(jwtConfig);

const validateJwtConfig = (config: JwtConfig): boolean => {
  return compiledSchema.Check(config);
};

export default validateJwtConfig;
