import { Prisma<%= ModelName %>Repository } from '../persistence/prisma-<%= modelName %>.repository'
// TODO: Import other required repositories if needed

/**
 * Seed <%= ModelName %> data using repository pattern
 * 
 * Usage: This seeder will be executed by the main seeder runner
 * Run with: npm run seed
 */
export default async function seed<%= SeederName %>() {
  try {
    console.log('Seeding <%= ModelName %> (using repository pattern)...')

    // Initialize repository
    const repository = new Prisma<%= ModelName %>Repository()

    // TODO: Add your seed data here
    const seedData = [
      // Example:
      // {
      //   // Add seed data fields matching your entity structure
      // }
    ]

    // TODO: Check if data already exists to avoid duplicates
    // const existing = await repository.findAll()
    // if (existing.data.length > 0) {
    //   console.log('  <%= ModelName %> data already exists, skipping...')
    //   return
    // }

    // Create seed data using repository
    for (const data of seedData) {
      // TODO: Use appropriate repository method
      // Example: await repository.save(new <%= ModelName %>(...))
      // Or use a create use case if available
    }

    if (seedData.length > 0) {
      console.log(`  ✓ Created ${seedData.length} <%= ModelName %> records`)
    } else {
      console.log('  ⚠ No seed data defined')
    }

    console.log('  ✓ <%= ModelName %> seeding completed')
  } catch (error) {
    console.error(`  ✗ Error seeding <%= ModelName %>:`, error)
    throw error
  }
}

