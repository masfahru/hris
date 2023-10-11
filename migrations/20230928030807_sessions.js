import { getTableName } from './helper'

const tableName = getTableName('sessions')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  const exists = await knex.schema.hasTable(tableName)
  if (exists) { return null }
  return knex.schema.createTable(tableName, (table) => {
    table.string('id').primary()
    table.integer('user_id').notNullable().index()
    table.string('role', 15).notNullable().index()
    table.dateTime('last_used').notNullable().defaultTo(knex.fn.now())
    table.dateTime('created_at').notNullable().defaultTo(knex.fn.now())
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists(tableName)
}
