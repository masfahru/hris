import Elysia from "elysia";
import { superAdminRoutes } from "./super-admin";

export const router = new Elysia().use(superAdminRoutes);
