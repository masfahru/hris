import { errorHandlerPlugin } from "@common/error-handler";
import Elysia from "elysia";
import { SuperAdminProfile, getSuperAdmin } from "../db";
import {
	SuperAdminProfileDeps,
	superAdminProfilePlugin,
} from "./super-admin-profile";
import { describe, expect, it, mock } from "bun:test";

describe("superAdminProfilePlugin", () => {
	it("should not throw error when session.userId is valid", async () => {
		const superAdminProfile: SuperAdminProfile = {
			id: 1,
			name: "John Doe",
			email: "john@doe.com",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			lastLoginAt: new Date().toISOString(),
			username: "john",
		};

		const mockGetSuperAdmin =
			mock(getSuperAdmin).mockResolvedValue(superAdminProfile);

		const deps: SuperAdminProfileDeps = new Elysia({
			name: "super-admin-profile-deps",
		})
			.decorate("session", {
				id: 1,
				userId: "validUserId",
				role: "ADMIN",
			})
			.decorate(
				"getSuperAdmin",
				mockGetSuperAdmin,
			) as unknown as SuperAdminProfileDeps;

		const plugin = superAdminProfilePlugin(deps);

		const server = new Elysia()
			.use(errorHandlerPlugin)
			.use(plugin)
			.get("/", () => "OK");

		const result = await server.handle(new Request("http://localhost/"));
		const resultBody = await result.text();

		expect(result.status).toBe(200);
		expect(resultBody).toBe("OK");
		expect(mockGetSuperAdmin).toHaveBeenCalledTimes(1);
	});

	it("should throw HttpError when session.userId is invalid", async () => {
		const mockGetSuperAdmin = mock(getSuperAdmin).mockResolvedValue(null);

		const deps: SuperAdminProfileDeps = new Elysia({
			name: "super-admin-profile-deps",
		})
			.decorate("session", {
				id: 1,
				userId: "validUserId",
				role: "ADMIN",
			})
			.decorate(
				"getSuperAdmin",
				mockGetSuperAdmin,
			) as unknown as SuperAdminProfileDeps;

		const plugin = superAdminProfilePlugin(deps);

		const server = new Elysia()
			.use(errorHandlerPlugin)
			.use(plugin)
			.get("/", () => "OK");

		const result = await server.handle(new Request("http://localhost/"));

		expect(result.status).toBe(401);
		expect(mockGetSuperAdmin).toHaveBeenCalledTimes(1);
	});
});
