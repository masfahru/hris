import { getTableName } from "@databases/postgres/sql";
import { Static } from "@sinclair/typebox";
import { t } from "elysia";

export const sessionSchema = t.Object({
  id: t.String({
    minLength: 1,
  }),
  userId: t.Number({
    minimum: 1,
  }),
  role: t.String({
    minLength: 1,
  }),
  lastUsed: t.String({
    minLength: 1,
    format: "date-time",
  }),
  createdAt: t.String({
    format: "date-time",
  }),
});

export type SessionModel = Static<typeof sessionSchema>;

export const sessionTableName = getTableName("sessions");
