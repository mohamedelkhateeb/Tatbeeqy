import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

//Orm entity
import { MainCategory } from './entities/main-category.entity'
import { Category } from './entities/category.entity'
import { SubCategory } from './entities/sub-category.entity'

//Service and Resolver
import { CategoryService } from './category.service'

//Module
import { UserModule } from 'src/user/user.module'
import { CategoryController } from './category.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([MainCategory, Category, SubCategory]),
    UserModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [TypeOrmModule],
})
export class CategoryModule {}
