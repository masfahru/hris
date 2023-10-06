import { Static } from "@sinclair/typebox";
import { t } from "elysia";

export const paginationSchema = t.Object({
	page: t.Number({
		minimum: 1,
	}),
	limit: t.Number({
		minimum: 1,
	}),
	order: t.String({
		enum: ["ASC", "DESC", "asc", "desc"],
	}),
	orderBy: t.String({
		minLength: 1,
	}),
});

export type PaginationSchema = Static<typeof paginationSchema>;

export const countOffset = (page: number, limit: number) => {
	return (page - 1) * limit;
};
