import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { getEntityName, toCamelCase, toKebabCase, toPascalCase, toPlural } from './naming'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Simple template engine that replaces <%= variable %> placeholders
 */
function renderTemplate(template: string, variables: Record<string, string>): string {
  let result = template
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`<%= ${key} %>`, 'g')
    result = result.replace(regex, value)
  }
  return result
}

/**
 * Read a template file and render it with variables
 */
async function readTemplate(templatePath: string, variables: Record<string, string>): Promise<string> {
  const fullPath = path.join(__dirname, '..', 'templates', templatePath)
  const template = await fs.readFile(fullPath, 'utf-8')
  return renderTemplate(template, variables)
}

/**
 * Write content to a file, creating directories if needed
 */
export async function writeFromTemplate(
  templatePath: string,
  outputPath: string,
  variables: Record<string, string>
): Promise<void> {
  const content = await readTemplate(templatePath, variables)
  const fullOutputPath = path.join(process.cwd(), outputPath)
  const dir = path.dirname(fullOutputPath)
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(fullOutputPath, content, 'utf-8')
}

/**
 * Read a template file and render it with variables (exported for reuse)
 */
export async function readAndRenderTemplate(
  templatePath: string,
  variables: Record<string, string>
): Promise<string> {
  return readTemplate(templatePath, variables)
}

/**
 * Create a complete module structure
 */
export async function createModule({
  moduleName,
  isCrud,
  entityName
}: {
  moduleName: string
  isCrud: boolean
  entityName?: string
}) {
  const basePath = `src/modules/${moduleName}`
  const Entity = getEntityName(moduleName, entityName)
  const entity = toCamelCase(Entity)
  const entities = toPlural(entity)
  const Module = toPascalCase(moduleName)
  const module = toCamelCase(moduleName)
  const routePath = `/api/v1/${toPlural(toKebabCase(moduleName))}`

  const variables = {
    Entity,
    entity,
    entities,
    Module,
    module,
    routePath,
    moduleName: toKebabCase(moduleName)
  }

  if (isCrud) {
    // Create directory structure
    await fs.mkdir(path.join(process.cwd(), basePath, 'domain/entities'), { recursive: true })
    await fs.mkdir(path.join(process.cwd(), basePath, 'domain/repositories'), { recursive: true })
    await fs.mkdir(path.join(process.cwd(), basePath, 'domain/errors'), { recursive: true })
    await fs.mkdir(path.join(process.cwd(), basePath, 'application'), { recursive: true })
    await fs.mkdir(path.join(process.cwd(), basePath, 'http/dto'), { recursive: true })
    await fs.mkdir(path.join(process.cwd(), basePath, 'http/docs'), { recursive: true })
    await fs.mkdir(path.join(process.cwd(), basePath, 'http/middleware'), { recursive: true })
    await fs.mkdir(path.join(process.cwd(), basePath, 'persistence'), { recursive: true })

    // Domain layer
    await writeFromTemplate(
      'crud/domain/entity.ts.tpl',
      `${basePath}/domain/entities/${Entity}.ts`,
      variables
    )
    await writeFromTemplate(
      'crud/domain/repository.ts.tpl',
      `${basePath}/domain/repositories/${Entity}Repository.ts`,
      variables
    )

    // Application layer - Use cases
    await writeFromTemplate(
      'crud/create.usecase.ts.tpl',
      `${basePath}/application/create-${entity}.usecase.ts`,
      variables
    )
    await writeFromTemplate(
      'crud/get-by-id.usecase.ts.tpl',
      `${basePath}/application/get-${entity}-by-id.usecase.ts`,
      variables
    )
    await writeFromTemplate(
      'crud/list.usecase.ts.tpl',
      `${basePath}/application/list-${entities}.usecase.ts`,
      variables
    )
    await writeFromTemplate(
      'crud/update.usecase.ts.tpl',
      `${basePath}/application/update-${entity}.usecase.ts`,
      variables
    )
    await writeFromTemplate(
      'crud/delete.usecase.ts.tpl',
      `${basePath}/application/delete-${entity}.usecase.ts`,
      variables
    )

    // HTTP layer - DTOs
    await writeFromTemplate(
      'crud/http/dto/create.dto.ts.tpl',
      `${basePath}/http/dto/create-${entity}.dto.ts`,
      variables
    )
    await writeFromTemplate(
      'crud/http/dto/update.dto.ts.tpl',
      `${basePath}/http/dto/update-${entity}.dto.ts`,
      variables
    )
    await writeFromTemplate(
      'crud/http/dto/response.dto.ts.tpl',
      `${basePath}/http/dto/${entity}-response.dto.ts`,
      variables
    )

    // HTTP layer - Controller
    await writeFromTemplate(
      'crud/http/controller.ts.tpl',
      `${basePath}/http/${module}.controller.ts`,
      variables
    )

    // HTTP layer - Routes
    await writeFromTemplate(
      'crud/http/routes.ts.tpl',
      `${basePath}/http/${module}.routes.ts`,
      variables
    )

    // HTTP layer - Docs
    await writeFromTemplate(
      'crud/http/docs/create.doc.ts.tpl',
      `${basePath}/http/docs/create-${entity}.doc.ts`,
      variables
    )
    await writeFromTemplate(
      'crud/http/docs/get.doc.ts.tpl',
      `${basePath}/http/docs/get-${entity}.doc.ts`,
      variables
    )
    await writeFromTemplate(
      'crud/http/docs/list.doc.ts.tpl',
      `${basePath}/http/docs/list-${entities}.doc.ts`,
      variables
    )
    await writeFromTemplate(
      'crud/http/docs/update.doc.ts.tpl',
      `${basePath}/http/docs/update-${entity}.doc.ts`,
      variables
    )
    await writeFromTemplate(
      'crud/http/docs/delete.doc.ts.tpl',
      `${basePath}/http/docs/delete-${entity}.doc.ts`,
      variables
    )
    await writeFromTemplate(
      'crud/http/docs/index.ts.tpl',
      `${basePath}/http/docs/index.ts`,
      variables
    )

    // Persistence layer
    await writeFromTemplate(
      'crud/persistence/prisma-repository.ts.tpl',
      `${basePath}/persistence/prisma-${entity}.repository.ts`,
      variables
    )

    // Module index
    await writeFromTemplate(
      'crud/index.ts.tpl',
      `${basePath}/index.ts`,
      variables
    )
  } else {
    // Base module structure (simpler)
    await fs.mkdir(path.join(process.cwd(), basePath, 'http'), { recursive: true })
    
    await writeFromTemplate(
      'base/controller.ts.tpl',
      `${basePath}/http/${module}.controller.ts`,
      variables
    )
    await writeFromTemplate(
      'base/routes.ts.tpl',
      `${basePath}/http/${module}.routes.ts`,
      variables
    )
    await writeFromTemplate(
      'base/index.ts.tpl',
      `${basePath}/index.ts`,
      variables
    )
  }
}
