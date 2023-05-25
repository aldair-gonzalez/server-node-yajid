import '../utils/env'
import { mode } from './command.config'

import defaultConfig from './default.config'
import productionConfig from './production.config'
import developmentConfig from './development.config'
import authConfig from './auth.config'
import mysqlConfig from './mysql.config'

export default {
  ...defaultConfig,
  ...(mode === 'PRODUCTION' ? productionConfig : developmentConfig),
  authConfig,
  mysqlConfig
}
