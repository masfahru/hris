import { getTableName } from './helper'

const tableName = getTableName('login_infos')
const sessionTableName = getTableName('sessions')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  const exists = await knex.schema.hasTable(tableName)
  if (exists) { return null }
  return knex.schema.createTable(tableName, (table) => {
    table.string('sessionId').primary()
    table.foreign('sessionId').references('id').inTable(sessionTableName).onDelete('CASCADE').onUpdate('CASCADE')
    table.string('ip').index()
    table.string('ua')
  })
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists(tableName)
}

