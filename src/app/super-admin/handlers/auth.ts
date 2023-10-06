import { generateUID } from "@common/uid/uid";
import { bearerPlugin } from "@core/bearer/bearer";
import { UserRole } from "@core/enums/user-roles";
import * as jwt from "@core/jwt/jwt";
import * as createSession from "@core/session/crud/create-session";
import * as deleteSession from "@core/session/crud/delete-session";
import Elysia from "elysia";
import { httpErrorDecorator } from "elysia-http-error";
import { getSuperAdminPassword } from "../db/read/get-password";
import { superAdminProfilePlugin } from "../plugins/super-admin-profile";
import { SignDTO } from "./schemas";

const loginDeps = new Elysia({
	name: "login-deps",
})
	.decorate("getPassword", getSuperAdminPassword)
	.decorate("signSync", jwt.signSync)
	.decorate("createSession", createSession.createSession);

export type LoginDeps = typeof loginDeps;

export const loginPlugin = (deps: LoginDeps = loginDeps) =>
	new Elysia({
		name: "super-admin-auth-login-plugin",
	})
		.use(httpErrorDecorator)
		.use(deps)
		.post(
			"/login",
			async ({ body, HttpError, getPassword, signSync, createSession }) => {
				const user = await getPassword(body.username);

				if (!user) {
					throw HttpError.Unauthorized("Invalid username or password");
				}

				const isPasswordValid = await Bun.password.verify(
					body.password,
					user.password,
				);

				if (!isPasswordValid) {
					throw HttpError.Unauthorized("Invalid username or password");
				}

				const payload = {
					id: generateUID(),
					userID: user.id,
					role: UserRole.SUPERADMIN,
				};

				const jwt = signSync(payload);
				const session = await createSession(payload);
				if (!session) {
					throw HttpError.Internal("Unable to complete the request");
				}
				return {
					token: jwt,
				};
			},
			{
				body: SignDTO,
			},
		);

const logoutDeps = new Elysia({
	name: "logout-deps",
})
	.use(superAdminProfilePlugin())
	.decorate("deleteSession", deleteSession.deleteSession);

export type LogoutDeps = typeof logoutDeps;

export const logoutPlugin = (deps: LogoutDeps = logoutDeps) =>
	new Elysia({
		name: "super-admin-auth-logout-plugin",
	})
		.use(httpErrorDecorator)
		.use(deps)
		.post("/logout", async ({ session, HttpError, deleteSession }) => {
			const sessionId = await deleteSession(session);
			if (!sessionId) {
				throw HttpError.Unauthorized();
			}
			return {
				message: "Logged out successfully",
			};
		});

export const superAdminAuth = new Elysia().group("/auth", (app) =>
	app.use(loginPlugin()).use(logoutPlugin()),
);
