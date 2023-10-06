import { getTableName } from '../migrations/helper'

const tableName = getTableName('super_admins')

const seed = async (knex) => {
  // Deletes ALL existing entries
  await knex(tableName).del()
  // reset auto increment
  await knex.raw(`ALTER SEQUENCE ${tableName}_id_seq RESTART WITH 1`)

  // Inserts seed entries
  /**
   * table.increments('id').primary();
      table.string('username').notNullable().index();
      table.string('email').nullable().index();
      table.string('password').notNullable();
      table.string('name').notNullable();
      table.dateTime('last_login').nullable();
      table.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
      table.dateTime('updated_at').notNullable().defaultTo(knex.fn.now());
   */
  await knex(tableName).insert([
    {
      username: 'superadmon',
      password: await Bun.password.hash('superadmin'),
      name: 'Super Admin',
      email: 'admin@fatih.biz.id',
    },
  ])
}

export { seed }

