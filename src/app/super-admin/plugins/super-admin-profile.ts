import getOrCreatePlugin from "@common/get-or-create-plugin";
import { sessionPlugin } from "@core/session/plugins/session";
import Elysia from "elysia";
import { httpErrorDecorator } from "elysia-http-error";
import * as getSuperAdmin from "../db/read/get-superadmin";

const superAdminProfileDeps = new Elysia({
	name: "super-admin-profile-deps",
})
	.use(sessionPlugin)
	.decorate("getSuperAdmin", getSuperAdmin.getSuperAdmin);

const generatePlugin = (deps: SuperAdminProfileDeps) =>
	new Elysia({
		name: "super-admin-profile-plugin",
	})
		.use(httpErrorDecorator)
		.use(deps)
		.derive(async ({ session, HttpError, getSuperAdmin }) => {
			const superAdminProfile = await getSuperAdmin(session.userID);
			if (!superAdminProfile) {
				throw HttpError.Unauthorized();
			}
			return {
				superAdminProfile,
			};
		});

export type SuperAdminProfileDeps = typeof superAdminProfileDeps;

type SuperAdminProfilePlugin = ReturnType<typeof generatePlugin>;

const pluginMap = new Map<SuperAdminProfileDeps, SuperAdminProfilePlugin>();

export const superAdminProfilePlugin = (
	deps: SuperAdminProfileDeps = superAdminProfileDeps,
): SuperAdminProfilePlugin =>
	getOrCreatePlugin(deps, generatePlugin, pluginMap);
