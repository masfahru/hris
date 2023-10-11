import { databaseConfig } from "@databases/postgres/config";
import Bun from "bun";
import postgres from "postgres";
import { createSuperAdmin } from "../create";
import { superAdminTableName } from "../super-admin.model";
import { afterAll, beforeAll, describe, expect, it } from "bun:test";

describe("Database Test: Create Super Admin", () => {
  const sql = postgres({
    host: databaseConfig.host,
    port: databaseConfig.port,
    username: databaseConfig.user,
    password: databaseConfig.password,
    database: databaseConfig.database,
    ssl: databaseConfig.ssl,
    transform: postgres.camel,
  });

  beforeAll(async () => {
    await sql`
      create table if not exists
      ${sql(superAdminTableName)} (
        "id" serial primary key,
        "username" varchar(255) not null,
        "email" varchar(255) null,
        "password" varchar(255) not null,
        "name" varchar(255) not null,
        "last_login_at" timestamptz null,
        "created_at" timestamptz not null default CURRENT_TIMESTAMP,
        "updated_at" timestamptz not null default CURRENT_TIMESTAMP
      )`;
  });
  afterAll(async () => {
    await sql`drop table ${sql(superAdminTableName)};`;
    await sql.end();
  });
  it("should create a super admin", async () => {
    const superAdmin = {
      username: "superadmon",
      password: await Bun.password.hash("superadmin"),
      name: "Super Admin",
      email: "admin@fatih.biz.id",
    };
    const id = await createSuperAdmin(superAdmin, sql);
    expect(id).toBe(1);
  });
});
