import { writeFromTemplate } from './fs'
import { toPascalCase, toCamelCase, toKebabCase } from './naming'

export async function generateTestFile({
  type,
  moduleName,
  fileName
}: {
  type: string
  moduleName: string
  fileName: string
}) {
  const basePath = `src/modules/${moduleName}`
  const FileName = toPascalCase(fileName)
  const fileNameKebab = toKebabCase(fileName)
  const moduleNameCamel = toCamelCase(moduleName)

  let testPath: string
  let templatePath: string
  let className: string
  let importPath: string

  if (type === 'usecase') {
    testPath = `${basePath}/application/${fileNameKebab}.usecase.test.ts`
    templatePath = 'test/usecase.test.ts.tpl'
    className = `${FileName}UseCase`
    importPath = `./${fileNameKebab}.usecase`
  } else if (type === 'repository') {
    testPath = `${basePath}/persistence/${fileNameKebab}.repository.test.ts`
    templatePath = 'test/repository.test.ts.tpl'
    className = `${FileName}Repository`
    importPath = `./${fileNameKebab}.repository`
  } else {
    throw new Error(`Unsupported test type: ${type}. Supported types: usecase, repository`)
  }

  const variables = {
    ClassName: className,
    className: toCamelCase(className),
    fileName: fileNameKebab,
    importPath,
    ModuleName: toPascalCase(moduleName),
    moduleName: moduleNameCamel,
    useCaseName: toCamelCase(fileName)
  }

  await writeFromTemplate(templatePath, testPath, variables)
}

