import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Category } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  price: number;

  @IsString()
  image: string;

  @IsEnum(Category)
  category: Category;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sizes?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock?: number;
}

export class UpdateProductDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) price?: number;
  @IsOptional() @IsString() image?: string;
  @IsOptional() @IsEnum(Category) category?: Category;
  @IsOptional() @IsArray() @IsString({ each: true }) sizes?: string[];
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) stock?: number;
}

export class ProductQueryDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsEnum(Category) category?: Category;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) minPrice?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) maxPrice?: number;
  @IsOptional() @IsString() sort?: 'price_asc' | 'price_desc' | 'newest';
}
