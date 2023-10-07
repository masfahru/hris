import { sql } from "@databases/postgres/sql";
import { Static } from "@sinclair/typebox";
import Bun from "bun";
import { NotFoundError, t } from "elysia";
import { superAdminSchema, superAdminTableName } from "../super-admin.model";

const superAdminPasswordSchema = t.Pick(superAdminSchema, ["id", "password"]);

type IdPasswordSchema = Static<typeof superAdminPasswordSchema>;

export const setPassword = async (
	params: IdPasswordSchema,
): Promise<number> => {
	const password = await Bun.password.hash(params.password);
	const rows = await sql`
    UPDATE ${sql(superAdminTableName)}
    SET password = ${password}
    WHERE id = ${params.id}
    RETURNING id
  `;
	if (rows.length === 0) {
		throw new NotFoundError("Super Admin Not Found");
	}
	return rows[0].id;
};
