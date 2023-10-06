import validatePostgresConfig, {
	PostgresDatabaseConfig,
} from "./config.validator";

const databaseConfig: PostgresDatabaseConfig = {
	host: process.env.PGHOST ?? "",
	port: Number(process.env.PORT) || 5432,
	user: process.env.PGUSER ?? "",
	password: process.env.PGPASSWORD ?? "",
	database: process.env.PGDATABASE ?? "",
	ssl: true,
	prefix: process.env.DB_PREFIX || "",
};

if (!validatePostgresConfig(databaseConfig)) {
	throw new Error("Invalid database configuration");
}

Object.freeze(databaseConfig);

export { databaseConfig };
