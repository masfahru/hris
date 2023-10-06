import { sql } from "@databases/postgres/sql";
import { Static } from "@sinclair/typebox";
import { t } from "elysia";
import { sessionSchema, sessionTableName } from "./session.model";

const createSessionParams = t.Pick(sessionSchema, ["id", "userID", "role"]);

export type CreateSessionParams = Static<typeof createSessionParams>;

export const createSession = async (
	params: CreateSessionParams,
): Promise<string | null> => {
	const rows = await sql`
    INSERT INTO ${sql(sessionTableName)} ${sql(params)}
    RETURNING id
  `;
	if (rows.length === 0) {
		return null;
	}
	return rows[0].id;
};
