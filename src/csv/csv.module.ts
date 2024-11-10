import { Module } from '@nestjs/common';
import { CsvService } from './csv.service';
import { CSVController } from './csv.controller';

@Module({
  providers: [CsvService],
  exports: [CsvService],
  controllers: [CSVController],
})
export class CsvModule {}
