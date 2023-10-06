import { sql } from "@databases/postgres/sql";
import { Static, Type } from "@sinclair/typebox";
import { InternalServerError } from "elysia";
import { superAdminSchema, superAdminTableName } from "../super-admin.model";

const superAdmin = Type.Pick(superAdminSchema, [
	"username",
	"email",
	"password",
	"name",
]);

type SuperAdminParams = Static<typeof superAdmin>;

export const createSuperAdmin = async (params: SuperAdminParams) => {
	const result = await sql`
    INSERT INTO ${sql(superAdminTableName)} ${sql({
		...params,
		password: params.password,
		email: params.email ?? null,
	})}
    RETURNING id
  `;
	if (result.length === 0) {
		throw new InternalServerError("Failed to create super admin");
	}
	return result[0].id;
};
