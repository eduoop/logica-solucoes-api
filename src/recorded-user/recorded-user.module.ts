import { Module } from '@nestjs/common';
import { RecordedUserService } from './recorded-user.service';
import { RecordedUserController } from './recorded-user.controller';
import { CsvService } from 'src/csv/csv.service';

@Module({
  controllers: [RecordedUserController],
  providers: [RecordedUserService, CsvService],
})
export class RecordedUserModule {}
