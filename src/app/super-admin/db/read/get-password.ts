import { or, sql, toSql } from "@databases/postgres/sql";
import { Static } from "@sinclair/typebox";
import { t } from "elysia";
import { superAdminSchema, superAdminTableName } from "../super-admin.model";

const idPasswordSchema = t.Pick(superAdminSchema, ["id", "password"]);

export type IdPasswordSchema = Static<typeof idPasswordSchema>;

export const getSuperAdminPassword = async (
  username: string,
): Promise<IdPasswordSchema | null> => {
  const usernameOrEmail = {
    username,
    email: username,
  };
  const rows = await sql`
    SELECT id, password FROM ${sql(superAdminTableName)}
    WHERE ${or(toSql(usernameOrEmail))}
  `;
  if (rows.length === 0) {
    return null;
  }
  return rows[0] as IdPasswordSchema;
};
