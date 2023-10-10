import {
  countOffset,
  paginationSchema,
} from "@common/typebox/schemas/pagination";
import { sql } from "@databases/postgres/sql";
import { Static } from "@sinclair/typebox";
import { t } from "elysia";
import { superAdminTableName } from "../super-admin.model";

const superAdminQuerySchema = t.Composite([
  t.Object({
    name: t.Optional(
      t.String({
        minLength: 1,
      }),
    ),
  }),
  paginationSchema,
]);

export type SuperAdminQuerySchema = Static<typeof superAdminQuerySchema>;

export const listSuperAdmin = async (params: SuperAdminQuerySchema) => {
  const offset = countOffset(params.page, params.limit);
  const whereQuery = params.name
    ? sql`WHERE name ILIKE ${`%${params.name}%`}`
    : sql``;
  const results = await sql`
    SELECT
      id,
      username,
      email,
      name,
      lastLoginAt,
      createdAt,
      updatedAt
    FROM
      ${sql(superAdminTableName)}
    ${whereQuery}
    LIMIT ${params.limit}
    OFFSET ${offset}
    ORDER BY ${sql(params.orderBy)} ${params.order}
  `;
  return results;
};
