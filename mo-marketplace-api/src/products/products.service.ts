import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './product.entity';
import { Variant } from '../variants/variant.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(Variant)
    private variantRepo: Repository<Variant>,
  ) {}

  async create(dto: CreateProductDto) {
    const product = this.productRepo.create({
      name: dto.name,
      description: dto.description,
    });

    await this.productRepo.save(product);

    const variants: Variant[] = [];

    for (const v of dto.variants) {
      const combinationKey = `${v.color}-${v.size}-${v.material}`;

      // prevent duplicates
      const exists = await this.variantRepo.findOne({
        where: { combination_key: combinationKey },
      });

      if (exists) {
        throw new BadRequestException(
          `Variant ${combinationKey} already exists`,
        );
      }

      const variant = this.variantRepo.create({
        ...v,
        combination_key: combinationKey,
        product,
      });

      variants.push(variant);
    }

    await this.variantRepo.save(variants);

    return { product, variants };
  }


  async findAll() {
  return this.productRepo.find({
    relations: ['variants'], //include variants
  });
}

  async findOne(id: number) {
  const product = await this.productRepo.findOne({
    where: { id },
    relations: ['variants'],
  });

  if (!product) {
    throw new NotFoundException('Product not found');
  }

  return product;
}

  async updateProductFeatures(id: number, dto: UpdateProductDto) {
    const product = await this.productRepo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (dto.name !== undefined) {
      product.name = dto.name.trim();
    }

    if (dto.description !== undefined) {
      product.description = dto.description.trim();
    }

    await this.productRepo.save(product);

    return this.findOne(id);
  }

  async deleteProduct(id: number) {
    const product = await this.productRepo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.variantRepo
      .createQueryBuilder()
      .delete()
      .where('"productId" = :id', { id })
      .execute();

    await this.productRepo.delete(id);

    return { message: 'Product deleted successfully' };
  }
}