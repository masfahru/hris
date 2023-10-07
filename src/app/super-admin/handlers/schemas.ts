import { t } from "elysia";

export const SignDto = t.Object({
	username: t.String(),
	password: t.String(),
});
