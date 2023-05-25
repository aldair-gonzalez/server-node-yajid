import winston from 'winston'
import moment from 'moment-timezone'
import util from 'util'

import { mode } from '../config/command.config'

const customLevelOptions = {
  levels: {
    debug: 4,
    http: 3,
    info: 2,
    warning: 1,
    error: 0
  },
  colors: {
    debug: 'white',
    http: 'cyan',
    info: 'blue',
    warning: 'yellow',
    error: 'red'
  }
}

const timestamp = moment().tz('America/Mexico_City').format('DD-MM-YYYY HH:mm:ss')
const format = winston.format.combine(
  winston.format.timestamp({ format: 'DD-MM-YYYY  HH:mm:ss' }),
  winston.format.colorize({ colors: customLevelOptions.colors }),
  winston.format.printf((info) => `${timestamp} ${info.level}: ${util.inspect(info.message)}`)

)

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'logs/errors.log',
    level: 'error'
  })
]

export const logger = winston.createLogger({
  level: mode !== 'PRODUCTION' ? 'debug' : 'info',
  levels: customLevelOptions.levels,
  format,
  transports
})
