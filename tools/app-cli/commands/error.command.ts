import { Command } from 'commander'
import { generateDomainError } from '../utils/error-generator'

export function createErrorCommand() {
  const cmd = new Command('error')

  cmd
    .description('Generate a domain error class')
    .argument('<module>', 'module name')
    .argument('<name>', 'error name (e.g., ProductNotFoundError)')
    .option('--status <code>', 'HTTP status code', '400')
    .option('--message <message>', 'default error message')
    .action(async (module, name, options) => {
      try {
        await generateDomainError({
          moduleName: module,
          errorName: name,
          statusCode: parseInt(options.status) || 400,
          defaultMessage: options.message
        })
        console.log(`✓ Error class "${name}" created successfully in module "${module}"`)
      } catch (error) {
        console.error('Error creating error class:', error)
        process.exit(1)
      }
    })

  return cmd
}

