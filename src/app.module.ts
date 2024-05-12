import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import GLOBAL_CONFIG from './config/';
import { ClerkService } from './clerk/clerk.service';
import { ClerkModule } from './clerk/clerk.module';
import { PostsModule } from './posts/posts.module';
import { AnswersModule } from './answers/answers.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: GLOBAL_CONFIG,
    }),
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        database: config.get('database.database'),
        host: config.get('database.host'),
        username: config.get('database.username'),
        port: config.get('database.port'),
        password: config.get('database.password'),
        entities: config.get('database.entities'),
        synchronize: config.get('database.synchronize'),
      }),
    }),
    ClerkModule,
    PostsModule,
    AnswersModule,
    TagsModule,
  ],
  controllers: [AppController],
  providers: [ConfigService, AppService, ClerkService],
})
export class AppModule {}
