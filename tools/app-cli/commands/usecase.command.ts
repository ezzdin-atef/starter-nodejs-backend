import { Command } from 'commander'
import { generateUseCase } from '../utils/usecase-generator'

export function createUseCaseCommand() {
  const cmd = new Command('usecase')

  cmd
    .description('Generate a custom use case')
    .argument('<module>', 'module name')
    .argument('<name>', 'use case name (e.g., approve-product)')
    .option('--entity <name>', 'entity name (if different from module name)')
    .action(async (module, name, options) => {
      try {
        await generateUseCase({
          moduleName: module,
          useCaseName: name,
          entityName: options.entity
        })
        console.log(`✓ Use case "${name}" created successfully in module "${module}"`)
      } catch (error) {
        console.error('Error creating use case:', error)
        process.exit(1)
      }
    })

  return cmd
}

