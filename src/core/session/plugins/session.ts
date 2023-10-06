import getOrCreatePlugin from "@common/get-or-create-plugin";
import { bearerPlugin } from "@core/bearer/bearer";
import * as jwt from "@core/jwt/jwt";
import * as getSession from "@core/session/crud/get-session";
import Elysia from "elysia";
import { httpErrorDecorator } from "elysia-http-error";

const sessionDeps = new Elysia({
	name: "session-deps",
})
	.use(bearerPlugin)
	.decorate("verifyAsync", jwt.verifyAsync)
	.decorate("getSession", getSession.getSession);

export type SessionDeps = typeof sessionDeps;

const generatePlugin = (deps: SessionDeps) =>
	new Elysia({
		name: "session-plugin",
	})
		.use(httpErrorDecorator)
		.use(deps)
		.derive(async ({ bearer, HttpError, verifyAsync, getSession }) => {
			if (!bearer) {
				throw HttpError.Unauthorized();
			}
			const verifiedBearer = await verifyAsync(bearer);

			if (!verifiedBearer) {
				throw HttpError.Unauthorized();
			}
			const session = {
				id: verifiedBearer.id,
				userID: verifiedBearer.userId,
				role: verifiedBearer.role,
			};
			const sessionId = await getSession(session);
			if (!sessionId) {
				throw HttpError.Unauthorized();
			}
			Object.freeze(session);
			return {
				session,
			};
		});

type SessionPlugin = ReturnType<typeof generatePlugin>;

const pluginMap = new Map<SessionDeps, SessionPlugin>();

export const sessionPlugin = (deps: SessionDeps = sessionDeps): SessionPlugin =>
	getOrCreatePlugin(deps, generatePlugin, pluginMap);
