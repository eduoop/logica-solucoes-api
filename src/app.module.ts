import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigModule as ConfigModuleNest } from "@nestjs/config"
import { envSchema } from './env/env';
import { EnvModule } from './env/env.module';
import { CsvModule } from './csv/csv.module';

@Module({
  imports: [UserModule, HttpModule, ConfigModuleNest.forRoot({
    validate: (env) => envSchema.parse(env),
    isGlobal: true,
  }),
    EnvModule,
    CsvModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],

  controllers: [],
  providers: [],
})
export class AppModule { }
