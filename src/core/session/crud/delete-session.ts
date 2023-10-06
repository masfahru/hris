import { and, sql, toSql } from "@databases/postgres/sql";
import { CreateSessionParams } from "./create-session";
import { sessionTableName } from "./session.model";

export const deleteSession = async (
	session: CreateSessionParams,
): Promise<string | null> => {
	const rows = await sql`
    DELETE FROM ${sql(sessionTableName)}
		WHERE ${and(toSql(session))}
    RETURNING id
  `;
	if (rows.length === 0) {
		return null;
	}
	return rows[0].id;
};
