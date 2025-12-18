#!/usr/bin/env node
import { Command } from 'commander'
import { createModuleCommand } from './commands/module.command'
import { createTestCommand } from './commands/test.command'
import { createUseCaseCommand } from './commands/usecase.command'
import { createErrorCommand } from './commands/error.command'
import { createRegisterCommand } from './commands/register.command'
import { createPrismaCommand } from './commands/prisma.command'
import { createSeederCommand } from './commands/seeder.command'

const program = new Command()

program
  .name('app-cli')
  .description('Project scaffolding tool')

program.addCommand(createModuleCommand())
program.addCommand(createTestCommand())
program.addCommand(createUseCaseCommand())
program.addCommand(createErrorCommand())
program.addCommand(createRegisterCommand())
program.addCommand(createPrismaCommand())
program.addCommand(createSeederCommand())

program.parse()
