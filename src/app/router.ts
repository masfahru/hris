import Elysia from "elysia";
import { superAdminRoutes } from "./super-admin/routes";

export const routers = new Elysia().use(superAdminRoutes);
