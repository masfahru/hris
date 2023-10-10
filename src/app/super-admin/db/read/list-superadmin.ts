import {
  countOffset,
  paginationSchema,
} from "@common/typebox/schemas/pagination";
import { sql } from "@databases/postgres/sql";
import { Static } from "@sinclair/typebox";
import { t } from "elysia";
import { superAdminSchema, superAdminTableName } from "../super-admin.model";

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

const superAdminItemSchema = t.Omit(superAdminSchema, ["password"]);

export type SuperAdminItem = Static<typeof superAdminItemSchema>;

const superAdminColumns = [
  "id",
  "username",
  "email",
  "name",
  "lastLoginAt",
  "createdAt",
  "updatedAt",
];

export const listSuperAdmin = async (
  params: SuperAdminQuerySchema,
  columns: string[] = superAdminColumns,
) => {
  const offset = countOffset(params.page, params.limit);
  const whereQuery = params.name
    ? sql`WHERE ${sql("name")} ILIKE ${`%${params.name}%`}`
    : sql``;
  const results = await sql<SuperAdminItem[]>`
    SELECT
      ${sql(columns)}
    FROM
      ${sql(superAdminTableName)}
    ${whereQuery}
    LIMIT ${params.limit}
    OFFSET ${offset}
    ORDER BY ${sql(params.orderBy)} ${params.order}
  `;
  return results;
};

type TotalSuperAdmin = {
  total: number;
};

export const totalSuperAdmin = async (params: SuperAdminQuerySchema) => {
  const whereQuery = params.name
    ? sql`WHERE name ILIKE ${`%${params.name}%`}`
    : sql``;
  const results = await sql<TotalSuperAdmin[]>`
    SELECT
      count(id) as total
    FROM
      ${sql(superAdminTableName)}
    ${whereQuery}
  `;
  return results[0].total;
};
