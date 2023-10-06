import { errorHandlerPlugin } from "@common/error-handler";
import { initFormatRegistry } from "@common/typebox/format-registry";
import { Elysia, InternalServerError } from "elysia";
import { routers } from "./app/router";

initFormatRegistry();

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
	.use(routers)
	.listen(8080);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
