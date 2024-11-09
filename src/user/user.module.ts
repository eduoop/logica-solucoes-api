import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HttpModule } from '@nestjs/axios';
import { EnvService } from 'src/env/env.service';
import { CsvService } from 'src/csv/csv.service';

@Module({
  imports: [HttpModule],
  controllers: [UserController],
  providers: [UserService, EnvService, CsvService],
})
export class UserModule { }
