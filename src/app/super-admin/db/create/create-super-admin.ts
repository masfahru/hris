import { sql } from "@databases/postgres/sql";
import { Static, Type } from "@sinclair/typebox";
import { Sql } from "postgres";
import { superAdminSchema, superAdminTableName } from "../super-admin.model";

const superAdmin = Type.Pick(superAdminSchema, [
  "username",
  "email",
  "password",
  "name",
]);

type SuperAdminParams = Static<typeof superAdmin>;

export const createSuperAdmin = async (
  params: SuperAdminParams,
  db: Sql = sql,
) => {
  const result = await db`
    INSERT INTO ${db(superAdminTableName)} ${db({
    ...params,
    password: params.password,
    email: params.email ?? null,
  })}
    RETURNING id
  `;
  return result.length ? result[0].id : null;
};
