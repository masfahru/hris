import { and, sql, toSql } from "@databases/postgres/sql";
import { Static } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { t } from "elysia";
import { SessionModel, sessionSchema, sessionTableName } from "./session.model";

const getSessionParams = t.Pick(sessionSchema, ["id", "userID", "role"]);

export type GetSessionParams = Static<typeof getSessionParams>;

export const compiledSessionSchema = TypeCompiler.Compile(sessionSchema);

export const getSession = async (
	params: GetSessionParams,
): Promise<string | null> => {
	const rows = await sql`
    SELECT id FROM ${sql(sessionTableName)}
    WHERE ${and(toSql(params))}
  `;
	if (rows.length === 0) {
		return null;
	}
	return rows[0].id;
};
