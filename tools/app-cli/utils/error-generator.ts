import { writeFromTemplate } from './fs'

/**
 * Preserve PascalCase error names (don't convert kebab-case to PascalCase)
 */
function preservePascalCase(name: string): string {
  // If it's already PascalCase (starts with uppercase and has mixed case), return as-is
  if (name.charAt(0) === name.charAt(0).toUpperCase() && /[A-Z]/.test(name.slice(1))) {
    return name
  }
  // Otherwise convert to PascalCase
  return name
    .split(/[\s_-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

export async function generateDomainError({
  moduleName,
  errorName,
  statusCode = 400,
  defaultMessage
}: {
  moduleName: string
  errorName: string
  statusCode?: number
  defaultMessage?: string
}) {
  const basePath = `src/modules/${moduleName}`
  const ErrorName = preservePascalCase(errorName)
  const errorPath = `${basePath}/domain/errors/${ErrorName}.ts`

  const variables = {
    ErrorName,
    statusCode: statusCode.toString(),
    defaultMessage: defaultMessage || ErrorName.replace(/Error$/, '')
  }

  await writeFromTemplate('error/domain-error.ts.tpl', errorPath, variables)
}

