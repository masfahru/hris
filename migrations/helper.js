/**
 * @param { string } name
 * @returns { string }
 */
export const getTableName = (name) => `${process.env.DB_PREFIX ?? ''}${name}`
