import fs from 'fs/promises'
import path from 'path'
import { toPascalCase, toCamelCase, toSnakeCase } from './naming'

interface Field {
  name: string
  type: string
  optional: boolean
  unique?: boolean
  default?: string
}

export async function generatePrismaModel({
  modelName,
  fields
}: {
  modelName: string
  fields: Field[]
}) {
  const schemaPath = path.join(process.cwd(), 'src/prisma/schema.prisma')
  const schemaContent = await fs.readFile(schemaPath, 'utf-8')

  // Check if model already exists
  const modelPascal = toPascalCase(modelName)
  if (schemaContent.includes(`model ${modelPascal}`)) {
    throw new Error(`Model "${modelPascal}" already exists in schema.prisma`)
  }

  // Generate model fields
  const modelFields = fields.map(field => {
    const fieldName = toCamelCase(field.name)
    const fieldType = mapToPrismaType(field.type)
    const optional = field.optional ? '?' : ''
    const unique = field.unique ? ' @unique' : ''
    const defaultValue = field.default ? ` @default(${field.default})` : ''
    
    return `  ${fieldName}${optional}  ${fieldType}${unique}${defaultValue}`
  })

  // Add standard fields
  const standardFields = [
    '  id        String   @id @default(uuid())',
    '  createdAt DateTime  @default(now())',
    '  updatedAt DateTime  @updatedAt'
  ]

  const allFields = [...standardFields, ...modelFields]

  // Generate model
  const modelDefinition = `\nmodel ${modelPascal} {\n${allFields.join('\n')}\n}\n`

  // Find insertion point (before the last closing brace or at the end)
  const lastBraceIndex = schemaContent.lastIndexOf('}')
  if (lastBraceIndex === -1) {
    throw new Error('Could not find insertion point in schema.prisma')
  }

  const newContent = 
    schemaContent.slice(0, lastBraceIndex) + 
    modelDefinition + 
    schemaContent.slice(lastBraceIndex)

  await fs.writeFile(schemaPath, newContent, 'utf-8')
  console.log(`✓ Prisma model "${modelPascal}" added to schema.prisma`)
  console.log(`  Run "npm run prisma:generate" to generate the Prisma client`)
}

function mapToPrismaType(type: string): string {
  const typeMap: Record<string, string> = {
    'String': 'String',
    'Int': 'Int',
    'Float': 'Float',
    'Decimal': 'Decimal',
    'Boolean': 'Boolean',
    'DateTime': 'DateTime',
    'Json': 'Json',
    'Bytes': 'Bytes'
  }

  return typeMap[type] || 'String'
}

export function parseFields(fieldsString: string): Field[] {
  return fieldsString.split(',').map(fieldStr => {
    const parts = fieldStr.trim().split(':')
    const name = parts[0]
    const type = parts[1] || 'String'
    const optional = parts[2] === 'optional' || parts[2] === '?'
    const unique = parts.includes('unique')
    const defaultIndex = parts.findIndex(p => p.startsWith('default='))
    const defaultValue = defaultIndex > -1 ? parts[defaultIndex].split('=')[1] : undefined

    return {
      name,
      type,
      optional,
      unique,
      default: defaultValue
    }
  })
}

