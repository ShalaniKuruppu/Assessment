import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from './product.entity';
import { Variant } from '../variants/variant.entity';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Variant])],
  providers: [ProductsService, RolesGuard],
  controllers: [ProductsController],
})
export class ProductsModule {}