#!/usr/bin/env node
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { prisma } from '@/config/database'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface SeederModule {
  default: () => Promise<void>
}

/**
 * Find all seeder files in module directories
 */
async function findSeeders(moduleName?: string): Promise<string[]> {
  const modulesPath = path.join(process.cwd(), 'src/modules')
  const seederFiles: string[] = []

  try {
    const modules = await fs.readdir(modulesPath, { withFileTypes: true })

    for (const module of modules) {
      if (!module.isDirectory()) continue

      // If module name specified, only process that module
      if (moduleName && module.name !== moduleName) continue

      const seedersDir = path.join(modulesPath, module.name, 'seeders')
      
      try {
        const files = await fs.readdir(seedersDir)
        const seederFilesInModule = files
          .filter(file => file.endsWith('.seeder.ts'))
          .map(file => path.join(seedersDir, file))
        
        seederFiles.push(...seederFilesInModule)
      } catch (error) {
        // Seeders directory doesn't exist, skip
        continue
      }
    }
  } catch (error) {
    console.error('Error finding seeders:', error)
    throw error
  }

  return seederFiles.sort()
}

/**
 * Import and execute a seeder file
 */
async function executeSeeder(seederPath: string): Promise<void> {
  try {
    // Convert to file:// URL for ES modules
    const fileUrl = `file://${seederPath}`
    const module = await import(fileUrl) as SeederModule
    
    if (typeof module.default === 'function') {
      await module.default()
    } else {
      console.warn(`  ⚠ Seeder ${seederPath} does not export a default function`)
    }
  } catch (error) {
    console.error(`  ✗ Failed to execute seeder ${seederPath}:`, error)
    throw error
  }
}

/**
 * Main seeder runner
 */
async function runSeeders(moduleName?: string) {
  console.log('🌱 Starting database seeding...\n')

  try {
    // Find all seeder files
    const seederFiles = await findSeeders(moduleName)

    if (seederFiles.length === 0) {
      console.log('No seeders found.')
      if (moduleName) {
        console.log(`  Module "${moduleName}" has no seeders.`)
      }
      return
    }

    console.log(`Found ${seederFiles.length} seeder(s):\n`)

    // Execute each seeder
    for (const seederPath of seederFiles) {
      const relativePath = path.relative(process.cwd(), seederPath)
      console.log(`Running: ${relativePath}`)
      await executeSeeder(seederPath)
      console.log('')
    }

    console.log('✓ All seeders completed successfully')
  } catch (error) {
    console.error('\n✗ Seeding failed:', error)
    process.exit(1)
  } finally {
    // Close Prisma connection
    await prisma.$disconnect()
  }
}

// Parse command line arguments
const args = process.argv.slice(2)
const moduleIndex = args.indexOf('--module')
const moduleName = moduleIndex > -1 && args[moduleIndex + 1] 
  ? args[moduleIndex + 1] 
  : undefined

// Run seeders
runSeeders(moduleName).catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

