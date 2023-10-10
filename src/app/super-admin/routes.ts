import Elysia from "elysia";
import { superAdminAuth, superAdminPlugin } from "./handlers";

export const superAdminRoutes = new Elysia().group("/super-admin", (app) =>
  app.use(superAdminAuth).use(superAdminPlugin()),
);
