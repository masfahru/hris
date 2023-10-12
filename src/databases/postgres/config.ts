import validatePostgresConfig, {
  PostgresDatabaseConfig,
} from "./config.validator";

const databaseConfig: PostgresDatabaseConfig = {
  host: process.env.PGHOST ?? "",
  port: Number(process.env.PORT) || 5432,
  user: process.env.PGUSER ?? "",
  password: process.env.PGPASSWORD ?? "",
  database: process.env.PGDATABASE ?? "",
  ssl: process.env.DB_SSL
    ? Boolean(process.env.DB_SSL)
    : process.env.NODE_ENV !== "test",
  prefix: process.env.DB_PREFIX || "",
};

if (!validatePostgresConfig(databaseConfig)) {
  throw new Error("Invalid database configuration");
}

Object.freeze(databaseConfig);

export { databaseConfig };
