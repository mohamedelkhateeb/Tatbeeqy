import { MainCategory } from '@/category/entities/main-category.entity'
import { DataSource } from 'typeorm'

export const mainCategorySeeder = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(MainCategory)

  const data = [
    {
      id: 1,
      name: 'Electronics',
      image: 'electronics.png',
      description: 'All electronic devices',
    },
    {
      id: 2,
      name: 'Fashion',
      image: 'fashion.png',
      description: 'Clothing and accessories',
    },
  ]

  await repo.save(data)
  console.log('🌱 Main categories seeded')
}
