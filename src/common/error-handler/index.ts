import Elysia from "elysia";
import { httpError } from "elysia-http-error";

export const errorHandlerPlugin = new Elysia({
  name: "error-handler-plugin",
}).use(
  httpError({
    returnStringOnly: true,
  }),
);
