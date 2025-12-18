import { Command } from 'commander'
import { registerModule } from '../utils/module-register'

export function createRegisterCommand() {
  const cmd = new Command('register')

  cmd
    .description('Register a module in app.ts')
    .argument('<module>', 'module name')
    .action(async (module) => {
      try {
        await registerModule(module)
      } catch (error) {
        console.error('Error registering module:', error)
        process.exit(1)
      }
    })

  return cmd
}

