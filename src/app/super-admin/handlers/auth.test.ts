import { errorHandlerPlugin } from "@common/error-handler";
import { generateUid } from "@common/uid/uid";
import { signSync } from "@core/jwt/jwt";
import { createSession } from "@core/session/crud/create-session";
import { deleteSession } from "@core/session/crud/delete-session";
import Bun from "bun";
import Elysia from "elysia";
import * as db from "../db";
import { LoginDeps, LogoutDeps, loginPlugin, logoutPlugin } from "./auth";
import { describe, expect, it, mock } from "bun:test";

describe("Super Admin Auth Handlers", () => {
  describe("POST /login", () => {
    it("should return an unauthorized error when username is not found", async () => {
      const username = "superadmin";
      const password = "password";
      const payload = {
        username,
        password,
      };

      const mockGetSuperAdminPassword = mock(
        db.getSuperAdminPassword,
      ).mockResolvedValue(null);

      const mockLoginDeps = new Elysia({
        name: "login-deps",
      })
        .decorate("getPassword", mockGetSuperAdminPassword)
        .decorate("signSync", signSync)
        .decorate("createSession", createSession) as unknown as LoginDeps;

      const server = new Elysia()
        .use(errorHandlerPlugin)
        .use(loginPlugin(mockLoginDeps));

      const response = await server.handle(
        new Request("http://localhost/login", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );

      expect(mockGetSuperAdminPassword).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(401);
    });

    it("should return an unauthorized error when invalid password are provided", async () => {
      const username = "testuser";
      const password = "testpassword";
      const payload = {
        username,
        password,
      };

      const userPassword = {
        id: 1,
        password: await Bun.password.hash("correctpassword"),
      };

      const mockGetSuperAdminPassword = mock(
        db.getSuperAdminPassword,
      ).mockResolvedValue(userPassword);

      const mockLoginDeps = new Elysia({
        name: "login-deps",
      })
        .decorate("getPassword", mockGetSuperAdminPassword)
        .decorate("signSync", signSync)
        .decorate("createSession", createSession) as unknown as LoginDeps;

      const server = new Elysia()
        .use(errorHandlerPlugin)
        .use(loginPlugin(mockLoginDeps));

      const response = await server.handle(
        new Request("http://localhost/login", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );

      expect(mockGetSuperAdminPassword).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(401);
    });

    it("should return an internal server error when server fails to create sessions", async () => {
      const username = "testuser";
      const password = "testpassword";
      const payload = {
        username,
        password,
      };

      const userPassword = {
        id: 1,
        password: await Bun.password.hash("testpassword"),
      };

      const mockGetSuperAdminPassword = mock(
        db.getSuperAdminPassword,
      ).mockResolvedValue(userPassword);

      const mockCreateSession = mock(createSession).mockResolvedValue(null);

      const mockLoginDeps = new Elysia({
        name: "login-deps",
      })
        .decorate("getPassword", mockGetSuperAdminPassword)
        .decorate("signSync", signSync)
        .decorate("createSession", mockCreateSession) as unknown as LoginDeps;

      const server = new Elysia()
        .use(errorHandlerPlugin)
        .use(loginPlugin(mockLoginDeps));

      const response = await server.handle(
        new Request("http://localhost/login", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );

      expect(mockGetSuperAdminPassword).toHaveBeenCalledTimes(1);
      expect(mockCreateSession).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(500);
    });

    it("should return jwt token for successful request", async () => {
      const username = "testuser";
      const password = "testpassword";
      const payload = {
        username,
        password,
      };

      const userPassword = {
        id: 1,
        password: await Bun.password.hash("testpassword"),
      };

      const mockGetSuperAdminPassword = mock(
        db.getSuperAdminPassword,
      ).mockResolvedValue(userPassword);

      const sessionId = generateUid();

      const mockCreateSession =
        mock(createSession).mockResolvedValue(sessionId);

      const mockLoginDeps = new Elysia({
        name: "login-deps",
      })
        .decorate("getPassword", mockGetSuperAdminPassword)
        .decorate("signSync", signSync)
        .decorate("createSession", mockCreateSession) as unknown as LoginDeps;

      const server = new Elysia()
        .use(errorHandlerPlugin)
        .use(loginPlugin(mockLoginDeps));

      const response = await server.handle(
        new Request("http://localhost/login", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );

      expect(mockGetSuperAdminPassword).toHaveBeenCalledTimes(1);
      expect(mockCreateSession).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
    });
  });

  describe("POST /logout", () => {
    it("should return a success message when a valid token is provided", async () => {
      const sessionId = generateUid();

      const mockDeleteSession =
        mock(deleteSession).mockResolvedValue(sessionId);

      const mockLogoutDeps = new Elysia({
        name: "logout-deps",
      })
        .decorate("session", sessionId)
        .decorate("deleteSession", mockDeleteSession) as unknown as LogoutDeps;

      const server = new Elysia()
        .use(errorHandlerPlugin)
        .use(logoutPlugin(mockLogoutDeps));

      const response = await server.handle(
        new Request("http://localhost/logout", {
          method: "POST",
        }),
      );

      expect(response.status).toBe(200);
      expect(mockDeleteSession).toHaveBeenCalledTimes(1);
    });

    it("should return an error when an invalid token is provided", async () => {
      const sessionId = generateUid();

      const mockDeleteSession = mock(deleteSession).mockResolvedValue(null);

      const mockLogoutDeps = new Elysia({
        name: "logout-deps",
      })
        .decorate("session", sessionId)
        .decorate("deleteSession", mockDeleteSession) as unknown as LogoutDeps;

      const server = new Elysia()
        .use(errorHandlerPlugin)
        .use(logoutPlugin(mockLogoutDeps));

      const response = await server.handle(
        new Request("http://localhost/logout", {
          method: "POST",
        }),
      );

      expect(response.status).toEqual(401);
      expect(mockDeleteSession).toHaveBeenCalledTimes(1);
    });
  });
});
