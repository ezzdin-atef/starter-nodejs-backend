import { Command } from 'commander'
import { generateTestFile } from '../utils/test-generator'

export function createTestCommand() {
  const cmd = new Command('test')

  cmd
    .description('Generate test file for a use case or repository')
    .argument('<type>', 'type of file (usecase, repository)')
    .argument('<module>', 'module name')
    .argument('<name>', 'file name (e.g., create-product)')
    .action(async (type, module, name) => {
      try {
        await generateTestFile({ type, moduleName: module, fileName: name })
        console.log(`✓ Test file for ${type} "${name}" in module "${module}" created successfully`)
      } catch (error) {
        console.error('Error creating test file:', error)
        process.exit(1)
      }
    })

  return cmd
}

