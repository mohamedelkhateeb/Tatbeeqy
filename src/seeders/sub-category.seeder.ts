import { SubCategory } from '@/category/entities/sub-category.entity'
import { DataSource } from 'typeorm'

export const subCategorySeeder = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(SubCategory)

  const data = [
    {
      id: 1,
      name: 'Android Phones',
      category: { id: 1 },
      image: 'android.png',
    },
    {
      id: 2,
      name: 'iPhones',
      category: { id: 1 },
      image: 'iphone.png',
    },
    {
      id: 3,
      name: 'Gaming Laptops',
      category: { id: 2 },
      image: 'gaming-laptop.png',
    },
  ]

  await repo.save(data)
  console.log('🌱 Sub categories seeded')
}
