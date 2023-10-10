import getOrCreatePlugin from "@common/get-or-create-plugin";
import { generatePaginationResult } from "@common/pagination";
import Elysia from "elysia";
import * as db from "../db";
import { superAdminProfilePlugin } from "../plugins";
import { superAdminQueryDto } from "./schemas";

const superAdminDeps = new Elysia({
  name: "super-admin-deps",
})
  .use(superAdminProfilePlugin())
  .decorate("db", db)
  .decorate("generateResult", generatePaginationResult);

export type SuperAdminDeps = typeof superAdminDeps;

const generatePlugin = (deps: SuperAdminDeps = superAdminDeps) =>
  new Elysia({
    name: "super-admin-plugin",
  })
    .use(deps)
    .get(
      "/",
      async ({ db, query, generateResult }) => {
        const totalSuperAdmin = await db.totalSuperAdmin(query);
        const superAdmins = await db.listSuperAdmin(query);
        return generateResult(
          query.page,
          query.limit,
          totalSuperAdmin,
          superAdmins,
        );
      },
      {
        query: superAdminQueryDto,
      },
    );

type SuperAdminPlugin = ReturnType<typeof generatePlugin>;

const pluginMap = new Map<SuperAdminDeps, SuperAdminPlugin>();

export const superAdminPlugin = (
  deps: SuperAdminDeps = superAdminDeps,
): SuperAdminPlugin => getOrCreatePlugin(deps, generatePlugin, pluginMap);
