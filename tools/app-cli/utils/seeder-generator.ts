import { writeFromTemplate } from './fs'
import { toPascalCase, toCamelCase, toKebabCase } from './naming'
import fs from 'fs/promises'
import path from 'path'

export async function generateSeeder({
  moduleName,
  seederName,
  useRepository,
  modelName
}: {
  moduleName: string
  seederName: string
  useRepository: boolean
  modelName?: string
}) {
  const basePath = `src/modules/${moduleName}`
  const seederFileName = toKebabCase(seederName)
  const SeederName = toPascalCase(seederName) + 'Seeder'
  const ModelName = modelName ? toPascalCase(modelName) : toPascalCase(moduleName)
  const modelNameCamel = toCamelCase(ModelName)
  const moduleNameCamel = toCamelCase(moduleName)

  // Create seeders directory if it doesn't exist
  const seedersDir = path.join(process.cwd(), basePath, 'seeders')
  await fs.mkdir(seedersDir, { recursive: true })

  const seederPath = `${basePath}/seeders/${seederFileName}.seeder.ts`
  const templatePath = useRepository 
    ? 'seeder/repository.seeder.ts.tpl'
    : 'seeder/prisma.seeder.ts.tpl'

  const variables = {
    SeederName,
    seederName: seederFileName,
    ModelName,
    modelName: modelNameCamel,
    ModuleName: toPascalCase(moduleName),
    moduleName: moduleNameCamel
  }

  await writeFromTemplate(templatePath, seederPath, variables)
}

