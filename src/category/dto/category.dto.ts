import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator'

export class CreateCategoryDto {
  @ApiProperty({
    type: String,
    description: 'The name of the category',
    example: 'Electronics',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiPropertyOptional({
    type: String,
    description: 'Image URL of the category',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsOptional()
  image?: string

  @ApiProperty({
    type: Number,
    description: 'ID of the main category this category belongs to',
    example: 4,
  })
  @IsNumber()
  @IsNotEmpty()
  main_category: number
}
