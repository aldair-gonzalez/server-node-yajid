import { createPool } from 'mysql2/promise'

import config from '../config/config'

export const pool = createPool({
  host: config.mysqlConfig.host,
  user: config.mysqlConfig.user,
  password: config.mysqlConfig.password,
  database: config.mysqlConfig.database,
  connectionLimit: 10
})
