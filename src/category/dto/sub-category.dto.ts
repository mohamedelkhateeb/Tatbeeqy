import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator'

export class CreateSubCategoryDto {
  @ApiProperty({
    type: String,
    description: 'Name of the sub category',
    example: 'Laptops',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    type: Number,
    description: 'Category ID this sub category belongs to',
    example: 3,
  })
  @IsNumber()
  @IsNotEmpty()
  category: number

  @ApiPropertyOptional({
    type: String,
    description: 'Image URL of the sub category',
    example: 'https://example.com/laptop.jpg',
  })
  @IsString()
  @IsOptional()
  image?: string
}
