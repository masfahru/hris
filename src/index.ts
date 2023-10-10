import { errorHandlerPlugin } from "@common/error-handler";
import { Elysia, InternalServerError } from "elysia";
import { router } from "./app";

const app = new Elysia({
  serve: {
    // @ts-ignore
    reusePort: true,
  },
})
  .use(errorHandlerPlugin)
  .get("/", () => {
    throw new InternalServerError("Failed to create super admin");
  })
  .use(router)
  .listen(8080);

console.info(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
