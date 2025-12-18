import { writeFromTemplate } from './fs'
import { toPascalCase, toCamelCase, toKebabCase } from './naming'

export async function generateUseCase({
  moduleName,
  useCaseName,
  entityName
}: {
  moduleName: string
  useCaseName: string
  entityName?: string
}) {
  const basePath = `src/modules/${moduleName}`
  const UseCaseName = toPascalCase(useCaseName) + 'UseCase'
  const useCaseNameKebab = toKebabCase(useCaseName)
  const Entity = entityName ? toPascalCase(entityName) : toPascalCase(moduleName)

  const useCasePath = `${basePath}/application/${useCaseNameKebab}.usecase.ts`

  const variables = {
    UseCaseName,
    useCaseName: useCaseNameCamel,
    Entity,
    entity: toCamelCase(Entity),
    ModuleName: toPascalCase(moduleName),
    moduleName: toCamelCase(moduleName)
  }

  await writeFromTemplate('usecase/custom.usecase.ts.tpl', useCasePath, variables)
}

