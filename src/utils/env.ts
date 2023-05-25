import { config } from 'dotenv'

import { mode } from '../config/command.config'

(() => {
  let envFile: string

  switch (mode) {
    case 'PRODUCTION':
      envFile = '.env.production.local'
      break
    case 'TESTING':
      envFile = '.env.test.local'
      break
    case 'DEVELOPMENT':
      envFile = '.env.development.local'
      break
    default:
      throw new Error('Parámetro de modo inválido. Los valores válidos son: PRODUCTION, TESTING, DEVELOPMENT.')
  }

  config({ path: envFile })
})()
