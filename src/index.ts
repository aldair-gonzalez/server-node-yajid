import app from './app'
import config from './config/config'
import { logger } from './utils/logger'

const PORT: number = config.serverPort

const server = app.listen(PORT, () => logger.info(`Server started on port ${PORT}`))
server.on('error', (err) => logger.error(err))
