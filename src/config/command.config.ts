import { Command } from 'commander'

const program = new Command()

program
  .option('-p, --port <port>', 'Puerto de ejecución')
  .option('-m, --mode <mode>', 'Modo de desarrollo', 'DEVELOPMENT')
  .parse(process.argv)

const options = program.opts()
export const { port, mode } = options
