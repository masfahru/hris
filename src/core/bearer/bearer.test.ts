import Elysia from "elysia";
import { bearerPlugin } from "./bearer";
import { describe, expect, it } from "bun:test";

describe("bearerPlugin", () => {
  const server = new Elysia().use(bearerPlugin).get("/", () => "OK");

  it('should return "Unauthorized" if no bearer token is provided', async () => {
    const result = await server.handle(new Request("http://localhost/"));
    const resultBody = await result.text();

    expect(result.status).toBe(400);
    expect(result.headers.get("www-authenticate")).toBe(
      `Bearer realm='sign', error="invalid_request"`,
    );
    expect(resultBody).toBe("Unauthorized");
  });

  it("should continue handling the request if a valid bearer token is provided", async () => {
    const result = await server.handle(
      new Request("http://localhost/", {
        headers: {
          authorization: "Bearer valid_token",
        },
      }),
    );
    const resultBody = await result.text();

    expect(result.status).toBe(200);
    expect(resultBody).toBe("OK");
  });
});
