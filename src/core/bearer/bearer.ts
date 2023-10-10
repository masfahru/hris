import bearer from "@elysiajs/bearer";
import Elysia from "elysia";

export const bearerPlugin = new Elysia({
  name: "bearer-plugin",
})
  .use(bearer())
  .onBeforeHandle(({ bearer, set }) => {
    if (!bearer) {
      set.status = 400;
      set.headers[
        "WWW-Authenticate"
      ] = `Bearer realm='sign', error="invalid_request"`;

      return "Unauthorized";
    }
  });
