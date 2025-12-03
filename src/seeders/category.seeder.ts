import { Category } from '@/category/entities/category.entity'
import { DataSource } from 'typeorm'

export const categorySeeder = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(Category)

  const data = [
    {
      id: 1,
      name: 'Mobile Phones',
      main_category: { id: 1 },
      image: 'mobiles.png',
    },
    {
      id: 2,
      name: 'Laptops',
      main_category: { id: 1 },
      image: 'laptops.png',
    },
    {
      id: 3,
      name: 'Mens Wear',
      main_category: { id: 2 },
      image: 'menswear.png',
    },
  ]

  await repo.save(data)
  console.log('🌱 Categories seeded')
}
