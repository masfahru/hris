import { paginationSchema } from "@common/typebox/schemas/pagination";
import { t } from "elysia";

export const signDto = t.Object({
  username: t.String(),
  password: t.String(),
});

export const superAdminQueryDto = t.Composite([
  t.Object({
    username: t.Optional(
      t.String({
        pattern: "^[a-zA-Z0-9]*$",
      }),
    ),
  }),
  paginationSchema,
]);
