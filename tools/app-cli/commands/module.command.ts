import { Command } from 'commander'
import { createModule } from '../utils/fs'

export function createModuleCommand() {
  const cmd = new Command('module')

  cmd
    .argument('<name>', 'module name')
    .option('--crud', 'generate CRUD module')
    .option('--entity <name>', 'entity name')
    .action(async (name, options) => {
      try {
        await createModule({
          moduleName: name,
          isCrud: options.crud,
          entityName: options.entity
        })
        console.log(`✓ Module "${name}" created successfully`)
      } catch (error) {
        console.error('Error creating module:', error)
        process.exit(1)
      }
    })

  return cmd
}
