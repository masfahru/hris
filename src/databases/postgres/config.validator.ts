import { Static, Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

const postgresDatabaseConfig = Type.Object({
	host: Type.String({
		minLength: 1,
	}),
	port: Type.Number({
		minimum: 1,
	}),
	user: Type.String({
		minLength: 1,
	}),
	password: Type.String({
		minLength: 1,
	}),
	database: Type.String({
		minLength: 1,
	}),
	ssl: Type.Boolean(),
	prefix: Type.Optional(Type.String()),
});

export type PostgresDatabaseConfig = Static<typeof postgresDatabaseConfig>;

const compiledSchema = TypeCompiler.Compile(postgresDatabaseConfig);

const validatePostgresConfig = (database: PostgresDatabaseConfig): boolean => {
	return compiledSchema.Check(database);
};

export default validatePostgresConfig;
