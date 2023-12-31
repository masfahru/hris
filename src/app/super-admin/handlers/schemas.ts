import { paginationSchema } from "@common/typebox/schemas/pagination";
import { t } from "elysia";
import { superAdminSchema } from "../db/super-admin.model";

export const signDto = t.Object({
  username: t.String(),
  password: t.String(),
});

export const superAdminQueryDto = t.Composite([
  t.Object({
    username: t.Optional(t.Pick(superAdminSchema, ["username"])),
  }),
  paginationSchema,
]);
