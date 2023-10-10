import { sql } from "@databases/postgres/sql";
import { Static } from "@sinclair/typebox";
import { NotFoundError, t } from "elysia";
import { superAdminSchema, superAdminTableName } from "../super-admin.model";

const updateSuperAdminSchema = t.Pick(superAdminSchema, [
  "id",
  "username",
  "email",
  "name",
]);

type UpdateSuperAdmin = Static<typeof updateSuperAdminSchema>;

export const updateSuperAdmin = async (params: UpdateSuperAdmin) => {
  const { id, ...rest } = params;

  const result = await sql`
    UPDATE ${sql(superAdminTableName)} SET ${sql(rest)}
    WHERE id = ${id}
    RETURNING id
  `;
  if (result.length === 0) {
    throw new NotFoundError("Super Admin Not Found");
  }
  return result[0].id;
};
