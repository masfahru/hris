import { t } from "elysia";

export const SignDTO = t.Object({
	username: t.String(),
	password: t.String(),
});
