import getOrCreatePlugin from "@common/get-or-create-plugin";
import { sessionPlugin } from "@core/session/plugins/session";
import Elysia from "elysia";
import { httpErrorDecorator } from "elysia-http-error";
import * as db from "../db";

const superAdminProfileDeps = new Elysia({
  name: "super-admin-profile-deps",
})
  .use(sessionPlugin())
  .decorate("getSuperAdmin", db.getSuperAdmin);

const generatePlugin = (deps: SuperAdminProfileDeps = superAdminProfileDeps) =>
  new Elysia({
    name: "super-admin-profile-plugin",
  })
    .use(httpErrorDecorator)
    .use(deps)
    .derive(async ({ session, HttpError: httpError, getSuperAdmin }) => {
      const superAdminProfile = await getSuperAdmin(session.userId);
      if (!superAdminProfile) {
        throw httpError.Unauthorized();
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
