import { DataSource } from 'typeorm'

import { mainCategorySeeder } from './main-category.seeder'
import { categorySeeder } from './category.seeder'
import { subCategorySeeder } from './sub-category.seeder'
import { dataSourceOptions } from '@/typeorm.config'

const seed = async () => {
  const dataSource = new DataSource(dataSourceOptions)
  await dataSource.initialize()

  console.log('🚀 Running Seeder...')

  await mainCategorySeeder(dataSource)
  await categorySeeder(dataSource)
  await subCategorySeeder(dataSource)

  console.log('✅ Seeding Completed')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seeding Failed:', err)
  process.exit(1)
})
