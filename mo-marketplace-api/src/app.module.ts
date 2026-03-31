import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { VariantsModule } from './variants/variants.module';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('db.host') ?? 'localhost',
        port: configService.get<number>('db.port') ?? 5433,
        username: configService.get<string>('db.username') ?? 'postgres',
        password: configService.get<string>('db.password') ?? 'password',
        database: configService.get<string>('db.name') ?? 'mo_marketplace',
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    ProductsModule,
    VariantsModule,
    AuthModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule {}
