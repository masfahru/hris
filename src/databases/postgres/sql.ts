import postgres, { ParameterOrFragment } from "postgres";
import { databaseConfig } from "./config";

const sql = postgres({
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.user,
  password: databaseConfig.password,
  database: databaseConfig.database,
  ssl: databaseConfig.ssl,
  max: 1,
});

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

const getTableName = (name: string) => `${databaseConfig.prefix ?? ""}${name}`;

export { sql, and, or, toSql, getTableName };
