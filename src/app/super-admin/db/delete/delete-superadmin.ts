import { sql } from "@databases/postgres/sql";
import { NotFoundError } from "elysia";
import { superAdminTableName } from "../super-admin.model";

export const deleteSuperAdmin = async (id: number) => {
	const result = await sql`
    DELETE FROM ${sql(superAdminTableName)} WHERE id = ${id} RETURNING id
  `;
	if (result.length === 0) {
		throw new NotFoundError("Super Admin Not Found");
	}
	return result[0].id;
};
