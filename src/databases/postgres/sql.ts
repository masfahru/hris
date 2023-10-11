import postgres, { ParameterOrFragment } from "postgres";
import { databaseConfig } from "./config";

const dbConfig = {
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.user,
  password: databaseConfig.password,
  database: databaseConfig.database,
  ssl: databaseConfig.ssl,
  max: 1,
  transform: postgres.camel,
};

const sql = postgres(dbConfig);

const and = (arr: postgres.PendingQuery<postgres.Row[]>[]) =>
  arr.reduce((acc, x) => sql`${acc} AND ${x}`);
const or = (arr: postgres.PendingQuery<postgres.Row[]>[]) =>
  arr.reduce((acc, x) => sql`(${acc} OR ${x})`);

interface SqlObject {
  [key: string]: unknown;
}

const toSql = (obj: SqlObject) => {
  // delete undefined values
  for (const key of Object.keys(obj)) {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  }
  return Object.keys(obj).map(
    (x) => sql`${sql(x)} = ${obj[x] as unknown as ParameterOrFragment<never>}`,
  );
};

const getTableName = (name: string) =>
  `${
    process.env.NODE_ENV === "test" ? "test_" : databaseConfig.prefix ?? ""
  }${name}`;

const sqlMap = new Map<typeof dbConfig, ReturnType<typeof postgres>>();

const generateSqlInstance = (config: typeof dbConfig = dbConfig) => {
  if (sqlMap.has(config) && process.env.NODE_ENV !== "test") {
    const sql = sqlMap.get(config);
    if (sql) {
      return sql;
    }
  }
  const sql = postgres(config);
  sqlMap.set(config, sql);
  return sql;
};

export { sql, and, or, toSql, getTableName, generateSqlInstance };
