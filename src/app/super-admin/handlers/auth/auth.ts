import { getSuperAdminPassword } from "@app/super-admin/db";
import { superAdminProfilePlugin } from "@app/super-admin/plugins";
import { generateUid } from "@common/uid/uid";
import { UserRole } from "@core/enums/user-roles";
import * as jwt from "@core/jwt/jwt";
import * as sessionCrud from "@core/session/crud";
import Bun from "bun";
import Elysia from "elysia";
import { httpErrorDecorator } from "elysia-http-error";
import { signDto } from "../schemas";

const loginDeps = new Elysia({
  name: "login-deps",
})
  .decorate("getPassword", getSuperAdminPassword)
  .decorate("signSync", jwt.signSync)
  .decorate("createSession", sessionCrud.createSession);

export type LoginDeps = typeof loginDeps;

export const loginPlugin = (deps: LoginDeps = loginDeps) =>
  new Elysia({
    name: "super-admin-auth-login-plugin",
  })
    .use(httpErrorDecorator)
    .use(deps)
    .post(
      "/login",
      async ({
        body,
        HttpError: httpError,
        getPassword,
        signSync,
        createSession,
      }) => {
        const user = await getPassword(body.username);

        if (!user) {
          throw httpError.Unauthorized("Invalid username or password");
        }

        const isPasswordValid = await Bun.password.verify(
          body.password,
          user.password,
        );

        if (!isPasswordValid) {
          throw httpError.Unauthorized("Invalid username or password");
        }

        const payload = {
          id: generateUid(),
          userId: user.id,
          role: UserRole.SuperAdmin,
        };

        const jwt = signSync(payload);
        const session = await createSession(payload);
        if (!session) {
          throw httpError.Internal("Unable to complete the request");
        }
        return {
          token: jwt,
        };
      },
      {
        body: signDto,
      },
    );

const logoutDeps = new Elysia({
  name: "logout-deps",
})
  .use(superAdminProfilePlugin())
  .decorate("deleteSession", sessionCrud.deleteSession);

export type LogoutDeps = typeof logoutDeps;

export const logoutPlugin = (deps: LogoutDeps = logoutDeps) =>
  new Elysia({
    name: "super-admin-auth-logout-plugin",
  })
    .use(httpErrorDecorator)
    .use(deps)
    .post(
      "/logout",
      async ({ session, HttpError: httpError, deleteSession }) => {
        const sessionId = await deleteSession(session);
        if (!sessionId) {
          throw httpError.Unauthorized();
        }
        return {
          message: "Logged out successfully",
        };
      },
    );

export const superAdminAuth = new Elysia().group("/auth", (app) =>
  app.use(loginPlugin()).use(logoutPlugin()),
);
