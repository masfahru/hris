import { getTableName } from "@databases/postgres/sql";
import { Static } from "@sinclair/typebox";
import { t } from "elysia";

export const superAdminSchema = t.Object({
  id: t.Number({
    minimum: 1,
  }),
  username: t.String({
    minLength: 1,
    pattern: "^[a-zA-Z0-9]*$",
  }),
  email: t.Nullable(
    t.String({
      minLength: 5,
      pattern: "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$",
    }),
  ),
  password: t.String({
    minLength: 1,
  }),
  name: t.String({
    minLength: 1,
  }),
  lastLoginAt: t.Nullable(t.Date()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export type SuperAdminModel = Static<typeof superAdminSchema>;

export const superAdminTableName = getTableName("super_admins");
