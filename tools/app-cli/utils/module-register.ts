import fs from 'fs/promises'
import path from 'path'
import { toPascalCase, toCamelCase, toKebabCase, toPlural } from './naming'

export async function registerModule(moduleName: string) {
  const appPath = path.join(process.cwd(), 'src/app.ts')
  const appContent = await fs.readFile(appPath, 'utf-8')

  const modulePascal = toPascalCase(moduleName)
  const moduleCamel = toCamelCase(moduleName)
  const routePath = `/api/v1/${toPlural(toKebabCase(moduleName))}`

  // Check if already registered
  if (appContent.includes(`${moduleCamel}Module`)) {
    console.log(`⚠ Module "${moduleName}" is already registered in app.ts`)
    return
  }

  // Add import
  const importStatement = `import { ${moduleCamel}Module } from './modules/${moduleName}'`
  
  // Find the last module import
  const moduleImports = appContent.match(/import \{ \w+Module \} from '\.\/modules\/\w+'/g)
  if (moduleImports && moduleImports.length > 0) {
    const lastImport = moduleImports[moduleImports.length - 1]
    const lastImportIndex = appContent.lastIndexOf(lastImport)
    const insertIndex = appContent.indexOf('\n', lastImportIndex) + 1
    const newContent = 
      appContent.slice(0, insertIndex) + 
      importStatement + '\n' + 
      appContent.slice(insertIndex)
    
    // Add registration
    const registrationPattern = /(\w+Module\.register\(app\))/g
    const registrations = Array.from(newContent.matchAll(registrationPattern))
    if (registrations.length > 0) {
      const lastRegistration = registrations[registrations.length - 1]
      const regIndex = lastRegistration.index! + lastRegistration[0].length
      const finalContent = 
        newContent.slice(0, regIndex) + 
        `\n${moduleCamel}Module.register(app)` + 
        newContent.slice(regIndex)
      
      await fs.writeFile(appPath, finalContent, 'utf-8')
      console.log(`✓ Module "${moduleName}" registered in app.ts`)
    } else {
      throw new Error('Could not find module registration pattern')
    }
  } else {
    throw new Error('Could not find module imports in app.ts')
  }
}

