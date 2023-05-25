import '../utils/env'
import { port } from './command.config'

export default {
  serverPort: port ?? process.env.SERVER_PORT ?? 80
}
