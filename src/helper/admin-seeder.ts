import { DataSource } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User } from '@/user/model/user.entity'

export async function createAdminUser(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User)

  // Check if admin already exists
  const existingAdmin = await userRepository.findOne({
    where: { role: 'admin' },
  })

  if (existingAdmin) {
    console.log('⚠️ Admin user already exists. Skipping seeding.')
    return
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash('Admin@123', 10)

  // Create admin
  const admin = userRepository.create({
    phone: '01000000000', // required
    name: 'Super Admin',
    email: 'admin@tatbeeqy.com',
    password: hashedPassword,
    role: 'admin',
    isVerified: true,
    isBanned: false,
  })

  await userRepository.save(admin)
  console.log('✅ Admin user created successfully!')
}
