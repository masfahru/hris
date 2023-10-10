import { Static } from "@sinclair/typebox";
import { t } from "elysia";

enum Order {
  // biome-ignore lint/style/useNamingConvention: common name
  ASC = "ASC",
  // biome-ignore lint/style/useNamingConvention: common name
  DESC = "DESC",
  // biome-ignore lint/style/useNamingConvention: common name
  asc = "asc",
  // biome-ignore lint/style/useNamingConvention: common name
  desc = "desc",
}

export const paginationSchema = t.Object({
  page: t.Numeric({
    default: 0,
  }),
  limit: t.Numeric(),
  order: t.Enum(Order),
  orderBy: t.String({
    minLength: 1,
  }),
});

export type PaginationSchema = Static<typeof paginationSchema>;

export const countOffset = (page: number, limit: number) => {
  // offset should not return negative number
  if (page < 1 || limit < 1) {
    return 0;
  }
  return (page - 1) * limit;
};
