import { getTableName } from './helper'

const tableName = getTableName('sessions')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  const exists = await knex.schema.hasTable(tableName)
  if (exists) return null
  return knex.schema.createTable(tableName, (table) => {
    table.string('id').primary()
    table.integer('userID').notNullable().index()
    table.string('role', 15).notNullable().index()
    table.dateTime('lastUsed').notNullable().defaultTo(knex.fn.now())
    table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now())
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists(tableName)
}
