import { sql } from "@databases/postgres/sql";
import { Static } from "@sinclair/typebox";
import { t } from "elysia";
import { sessionSchema, sessionTableName } from "./session.model";

const updateLastUsedSessionParams = t.Pick(sessionSchema, ["id"]);

export type UpdateLastUsedSessionParams = Static<
	typeof updateLastUsedSessionParams
>;

export const updateLastUsedSession = async (
	params: UpdateLastUsedSessionParams,
): Promise<string | null> => {
	const rows = await sql`
    UPDATE ${sql(sessionTableName)} SET ${sql("lastUsed")} = NOW() WHERE ${sql(
		"id",
	)} = ${params.id}
    RETURNING id
  `;
	if (rows.length === 0) {
		return null;
	}
	return rows[0].id;
};
