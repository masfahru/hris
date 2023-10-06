import { Nullable } from "@common/typebox/helper";
import { getTableName } from "@databases/postgres/sql";
import { Static } from "@sinclair/typebox";
import { t } from "elysia";

export const superAdminSchema = t.Object({
	id: t.Number({
		minimum: 1,
	}),
	username: t.String({
		minLength: 1,
	}),
	email: Nullable(
		t.String({
			format: "email",
		}),
	),
	password: t.String({
		minLength: 1,
	}),
	name: t.String({
		minLength: 1,
	}),
	lastLoginAt: Nullable(
		t.String({
			format: "date-time",
		}),
	),
	createdAt: t.String({
		format: "date-time",
	}),
	updatedAt: t.String({
		format: "date-time",
	}),
});

export type SuperAdminModel = Static<typeof superAdminSchema>;

export const superAdminTableName = getTableName("super_admins");
