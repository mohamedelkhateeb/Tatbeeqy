import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common'

// Service
import { CategoryService } from './category.service'

// DTOs
import { CreateMainCategoryDto } from './dto/main-category.dto'
import { CreateCategoryDto } from './dto/category.dto'
import { CreateSubCategoryDto } from './dto/sub-category.dto'
import { SearchInput } from '@/user/dto/search.dto'

// Guards
import { AuthGuard } from '@/auth/auth.guard'
import { RolesGuard } from '@/auth/roles.guard'
import { Roles } from '@/auth/decorator/auth.decorator'
import { Role } from '@/auth/enum/auth.enum'
import { ApiTags } from '@nestjs/swagger'
@ApiTags('Category')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // ===========================
  // MAIN CATEGORY
  // ===========================

  // GET all main categories
  @Get('main')
  getMainCategories(@Query() searchInput: SearchInput) {
    return this.categoryService.mainCategories(searchInput)
  }

  // GET single main category
  @Get('main/:id')
  getMainCategory(@Param('id') id: number) {
    return this.categoryService.mainCategory(id)
  }

  // CREATE main category
  @Post('main')
  @Roles(Role.MODERATOR, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  addMainCategory(@Body() mainCategoryInput: CreateMainCategoryDto) {
    return this.categoryService.addMain(mainCategoryInput)
  }

  // UPDATE main category
  @Put('main/:id')
  @Roles(Role.MODERATOR, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  updateMainCategory(
    @Param('id') id: number,
    @Body() mainCategoryInput: CreateMainCategoryDto,
  ) {
    return this.categoryService.updateMain(mainCategoryInput, id)
  }

  // DELETE main category
  @Delete('main/:id')
  @Roles(Role.MODERATOR, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  deleteMainCategory(@Param('id') id: number) {
    return this.categoryService.deleteMain(id)
  }

  // ===========================
  // CATEGORY
  // ===========================

  // GET all categories
  @Get('sub-main')
  getCategories(@Query() searchInput: SearchInput) {
    return this.categoryService.categories(searchInput)
  }

  // GET single category
  @Get('sub-main/:id')
  getCategory(@Param('id') id: number) {
    return this.categoryService.category(id)
  }

  // CREATE category
  @Post('sub-main')
  @Roles(Role.MODERATOR, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  addCategory(@Body() categoryInput: CreateCategoryDto) {
    return this.categoryService.addCategory(categoryInput)
  }

  // UPDATE category
  @Put('sub-main:id')
  @Roles(Role.MODERATOR, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  updateCategory(
    @Param('id') id: number,
    @Body() categoryInput: CreateCategoryDto,
  ) {
    return this.categoryService.updateCategory(categoryInput, id)
  }

  // DELETE category
  @Delete('sub-main:id')
  @Roles(Role.MODERATOR, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  deleteCategory(@Param('id') id: number) {
    return this.categoryService.deleteCategory(id)
  }

  // ===========================
  // SUB CATEGORY
  // ===========================

  // GET all sub categories
  @Get('sub')
  getSubCategories(@Query() searchInput: SearchInput) {
    return this.categoryService.getSubs(searchInput)
  }

  // GET single sub category
  @Get('sub/:id')
  getSubCategory(@Param('id') id: number) {
    return this.categoryService.getSub(id)
  }

  // CREATE sub category
  @Post('sub')
  @Roles(Role.MODERATOR, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  createSubCategory(@Body() subCategoryInput: CreateSubCategoryDto) {
    return this.categoryService.createSub(subCategoryInput)
  }

  // UPDATE sub category
  @Put('sub/:id')
  @Roles(Role.MODERATOR, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  updateSubCategory(
    @Param('id') id: number,
    @Body() subCategoryInput: CreateSubCategoryDto,
  ) {
    return this.categoryService.updateSub(id, subCategoryInput)
  }

  // DELETE sub category
  @Delete('sub/:id')
  @Roles(Role.MODERATOR, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  deleteSubCategory(@Param('id') id: number) {
    return this.categoryService.deleteSub(id)
  }
}
