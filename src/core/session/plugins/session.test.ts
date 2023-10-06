import { errorHandlerPlugin } from "@common/error-handler";
import { generateUID } from "@common/uid/uid";
import * as jwt from "@core/jwt/jwt";
import Elysia from "elysia";
import * as getSession from "../crud/get-session";
import { SessionDeps, sessionPlugin } from "./session";
import { describe, expect, it, mock } from "bun:test";

describe("sessionPlugin", () => {
	const sessionId = generateUID();

	const verifiedBearer = {
		id: sessionId,
		userID: 1,
		role: "ADMIN",
	};

	it("should throw an error if no bearer token is provided", async () => {
		const session = sessionPlugin();
		const server = new Elysia()
			.use(errorHandlerPlugin)
			.use(session)
			.get("/", () => "OK");

		const result = await server.handle(new Request("http://localhost/"));
		expect(result.status).toBe(401);
	});

	it("should throw an error if the bearer token is invalid", async () => {
		const mockVerifyAsync = mock(jwt.verifyAsync).mockImplementation(
			async () => {},
		);

		const mockDeps = new Elysia({
			name: "session-deps",
		})
			.decorate("bearer", "bearer")
			.decorate("verifyAsync", mockVerifyAsync)
			.decorate("getSession", getSession.getSession) as unknown as SessionDeps;

		const server = new Elysia()
			.use(errorHandlerPlugin)
			.use(sessionPlugin(mockDeps))
			.get("/", ({ bearer }) => {
				console.log(bearer);
				return "OK";
			});

		const result = await server.handle(new Request("http://localhost/"));
		expect(result.status).toBe(401);
		expect(mockVerifyAsync).toHaveBeenCalledTimes(1);
	});

	it("should throw an error if session is not found", async () => {
		const mockVerifyAsync = mock(jwt.verifyAsync).mockImplementation(
			async () => verifiedBearer,
		);

		const mockGetSession = mock(getSession.getSession).mockImplementation(
			async () => null,
		);

		const mockDeps = new Elysia({
			name: "session-deps",
		})
			.decorate("bearer", "bearer")
			.decorate("verifyAsync", mockVerifyAsync)
			.decorate("getSession", mockGetSession) as unknown as SessionDeps;

		const server = new Elysia()
			.use(errorHandlerPlugin)
			.use(sessionPlugin(mockDeps))
			.get("/", () => "OK");

		const result = await server.handle(new Request("http://localhost/"));
		expect(result.status).toBe(401);
		expect(mockVerifyAsync).toHaveBeenCalledTimes(1);
		expect(mockGetSession).toHaveBeenCalledTimes(1);
	});

	it("should success when session is valid", async () => {
		const mockVerifyAsync = mock(jwt.verifyAsync).mockImplementation(
			async () => {
				return verifiedBearer;
			},
		);

		const mockGetSession = mock(getSession.getSession).mockImplementation(
			async () => sessionId,
		);

		const mockDeps = new Elysia({
			name: "session-deps",
		})
			.decorate("bearer", "bearer")
			.decorate("verifyAsync", mockVerifyAsync)
			.decorate("getSession", mockGetSession) as unknown as SessionDeps;

		const server = new Elysia()
			.use(errorHandlerPlugin)
			.use(sessionPlugin(mockDeps))
			.get("/", () => "OK");

		const result = await server.handle(new Request("http://localhost/"));
		const resultBody = await result.text();

		expect(result.status).toBe(200);
		expect(resultBody).toBe("OK");
		expect(mockVerifyAsync).toHaveBeenCalledTimes(1);
		expect(mockGetSession).toHaveBeenCalledTimes(1);
	});

	it("should return same instance for multiple call", async () => {
		const session1 = sessionPlugin();
		const session2 = sessionPlugin();

		expect(session1).toBe(session2);

		const mockVerifyAsync = mock(jwt.verifyAsync).mockImplementation(
			async () => verifiedBearer,
		);

		const mockGetSession = mock(getSession.getSession).mockImplementation(
			async () => null,
		);

		const mockDeps = new Elysia({
			name: "session-deps",
		})
			.decorate("bearer", "bearer")
			.decorate("verifyAsync", mockVerifyAsync)
			.decorate("getSession", mockGetSession) as unknown as SessionDeps;

		const mockSession1 = sessionPlugin(mockDeps);
		const mockSession2 = sessionPlugin(mockDeps);

		expect(mockSession1).toBe(mockSession2);
		expect(session1).not.toBe(mockSession1);
	});
});
