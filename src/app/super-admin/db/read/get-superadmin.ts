import { sql } from "@databases/postgres/sql";
import { Static } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { t } from "elysia";
import { superAdminSchema, superAdminTableName } from "../super-admin.model";

const superAdminProfileSchema = t.Omit(superAdminSchema, ["password"]);

export type SuperAdminProfile = Static<typeof superAdminProfileSchema>;

const compiledValidator = TypeCompiler.Compile(superAdminProfileSchema);

const superAdminColumns = [
  "id",
  "username",
  "email",
  "name",
  "lastLoginAt",
  "createdAt",
  "updatedAt",
];

export const getSuperAdmin = async (
  id: number,
  columns: string[] = superAdminColumns,
) => {
  const result = await sql`
    SELECT
      ${sql(columns)}
    FROM
      ${sql(superAdminTableName)}
    WHERE
      id = ${id}
    LIMIT 1
  `;
  if (result.length === 0) {
    return null;
  }
  const isValid = compiledValidator.Check(result[0]);
  if (!isValid) {
    throw new Error("Failed to validate super admin profile");
  }
  return result[0] as SuperAdminProfile;
};
