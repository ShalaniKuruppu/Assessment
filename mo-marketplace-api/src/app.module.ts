import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { VariantsModule } from './variants/variants.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'password',
      database: 'mo_marketplace',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductsModule,
    VariantsModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule {}
