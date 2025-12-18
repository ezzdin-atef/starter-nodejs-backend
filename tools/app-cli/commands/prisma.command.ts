import { Command } from 'commander'
import { generatePrismaModel, parseFields } from '../utils/prisma-generator'

export function createPrismaCommand() {
  const cmd = new Command('prisma')
    .description('Prisma-related generators')

  const modelCmd = new Command('model')
    .description('Add a new Prisma model to schema.prisma')
    .argument('<name>', 'model name (e.g., Product)')
    .requiredOption('--fields <fields>', 'comma-separated fields: name:type:optional,unique,default=value')
    .action(async (name, options) => {
      try {
        const fields = parseFields(options.fields)
        await generatePrismaModel({ modelName: name, fields })
      } catch (error) {
        console.error('Error creating Prisma model:', error)
        process.exit(1)
      }
    })

  cmd.addCommand(modelCmd)
  return cmd
}
