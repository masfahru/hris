import { sql } from "@databases/postgres/sql";
import { Sql } from "postgres";
import { superAdminTableName } from "../super-admin.model";

export const deleteSuperAdmin = async (id: number, db: Sql = sql) => {
  const result = await db`
    DELETE FROM ${db(superAdminTableName)} WHERE id = ${id} RETURNING id
  `;
  return result.length ? result[0].id : null;
};
