const config = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.PGHOST,
      port: 5432,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      ssl: true,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      extension: 'js'
    }
  },
}

export default config
