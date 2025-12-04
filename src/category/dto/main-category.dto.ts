import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateMainCategoryDto {
  @ApiProperty({
    type: String,
    description: 'Name of the main category',
    example: 'Electronics',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiPropertyOptional({
    type: String,
    description: 'Image URL for the main category',
    example: 'https://example.com/category.jpg',
  })
  @IsString()
  @IsOptional()
  image?: string

  @ApiPropertyOptional({
    type: String,
    description: 'Short description of the main category',
    example: 'All types of electronic devices',
  })
  @IsString()
  @IsOptional()
  description?: string
}
