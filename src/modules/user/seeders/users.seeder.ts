import { prisma } from '@/config/database'
import { User } from '../domain/entities/User'

/**
 * Seed User data
 * 
 * Usage: This seeder will be executed by the main seeder runner
 * Run with: npm run seed
 */
export default async function seedUsersSeeder() {
  try {
    console.log('Seeding User...')

    // TODO: Add your seed data here
    const seedData: User[] = [
      // Example:
      // {
      //   // Add seed data fields
      // }
    ]

    // Use transaction for atomicity
    await prisma.$transaction(async (tx) => {
      // TODO: Check if data already exists to avoid duplicates
      // const existing = await tx.user.findFirst()
      // if (existing) {
      //   console.log('  User data already exists, skipping...')
      //   return
      // }

      // Create seed data
      if (seedData.length > 0) {
        await tx.user.createMany({
          data: seedData,
          skipDuplicates: true
        })
        console.log(`  ✓ Created ${seedData.length} User records`)
      } else {
        console.log('  ⚠ No seed data defined')
      }
    })

    console.log('  ✓ User seeding completed')
  } catch (error) {
    console.error(`  ✗ Error seeding User:`, error)
    throw error
  }
}

