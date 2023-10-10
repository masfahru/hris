import { or, sql, toSql } from "@databases/postgres/sql";
import { Static, Type } from "@sinclair/typebox";
import { superAdminSchema, superAdminTableName } from "../super-admin.model";

const checkUsernameEmailSchema = Type.Pick(superAdminSchema, [
  "username",
  "email",
]);

type CheckUsernameEmailSchema = Static<typeof checkUsernameEmailSchema>;

export const isEmailOrUsernameAvailable = async (
  params: CheckUsernameEmailSchema,
) => {
  const filter = toSql(params);
  const result = await sql`
    SELECT
      id
    FROM
      ${sql(superAdminTableName)}
    WHERE
      ${or(filter)}
    LIMIT 1
  `;
  if (result.length === 0) {
    return true;
  }
  return false;
};
