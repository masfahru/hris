import Elysia from "elysia";
import { superAdminAuth } from "./handlers";

export const superAdminRoutes = new Elysia().group("/super-admin", (app) =>
  app.use(superAdminAuth),
);
