import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity()
export class Variant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  color: string;

  @Column()
  size: string;

  @Column()
  material: string;

  @Column()
  stock: number;

  @Column({ unique: true })
  combination_key: string;

  @ManyToOne(() => Product, (product) => product.variants)
  product: Product;
}