import { TSchema } from "@sinclair/typebox";
import { t } from "elysia";

export const Nullable = <T extends TSchema>(schema: T) =>
  t.Union([schema, t.Null()]);
