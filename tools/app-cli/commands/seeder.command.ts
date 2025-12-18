import { Command } from 'commander'
import { generateSeeder } from '../utils/seeder-generator'

export function createSeederCommand() {
  const cmd = new Command('seeder')

  cmd
    .description('Generate a database seeder file')
    .argument('<module>', 'module name')
    .argument('<name>', 'seeder name (e.g., users, products)')
    .option('--use-repository', 'Use repository pattern instead of Prisma direct')
    .option('--model <model>', 'Prisma model name (defaults to module name)')
    .action(async (module, name, options) => {
      try {
        await generateSeeder({
          moduleName: module,
          seederName: name,
          useRepository: options.useRepository || false,
          modelName: options.model
        })
        console.log(`✓ Seeder "${name}" created successfully in module "${module}"`)
        console.log(`  Run with: npm run seed${options.useRepository ? ' (using repository pattern)' : ' (using Prisma direct)'}`)
      } catch (error) {
        console.error('Error creating seeder:', error)
        process.exit(1)
      }
    })

  return cmd
}

