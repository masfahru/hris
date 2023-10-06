import { getTableName } from './helper'

const tableName = getTableName('super_admins')

export async function up(knex) {
  const exists = await knex.schema.hasTable(tableName)
  if (exists) return null
  return knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary()
    table.string('username').notNullable().index()
    table.string('email').nullable().index()
    table.string('password').notNullable()
    table.string('name').notNullable()
    table.dateTime('lastLoginAt').nullable()
    table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now())
    table.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex) {
  return knex.schema.dropTableIfExists(tableName)
}
