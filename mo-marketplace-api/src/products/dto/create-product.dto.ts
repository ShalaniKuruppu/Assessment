import { IsString, IsNotEmpty, IsArray, ValidateNested, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

class VariantDto {
  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  size: string;

  @IsString()
  @IsNotEmpty()
  material: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(99999)
  stock: number;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  variants: VariantDto[];
}