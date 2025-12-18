import { prisma } from '@/config/database'

/**
 * Seed <%= ModelName %> data
 * 
 * Usage: This seeder will be executed by the main seeder runner
 * Run with: npm run seed
 */
export default async function seed<%= SeederName %>() {
  try {
    console.log('Seeding <%= ModelName %>...')

    // TODO: Add your seed data here
    const seedData = [
      // Example:
      // {
      //   // Add seed data fields
      // }
    ]

    // Use transaction for atomicity
    await prisma.$transaction(async (tx) => {
      // TODO: Check if data already exists to avoid duplicates
      // const existing = await tx.<%= modelName %>.findFirst()
      // if (existing) {
      //   console.log('  <%= ModelName %> data already exists, skipping...')
      //   return
      // }

      // Create seed data
      if (seedData.length > 0) {
        await tx.<%= modelName %>.createMany({
          data: seedData,
          skipDuplicates: true
        })
        console.log(`  ✓ Created ${seedData.length} <%= ModelName %> records`)
      } else {
        console.log('  ⚠ No seed data defined')
      }
    })

    console.log('  ✓ <%= ModelName %> seeding completed')
  } catch (error) {
    console.error(`  ✗ Error seeding <%= ModelName %>:`, error)
    throw error
  }
}

