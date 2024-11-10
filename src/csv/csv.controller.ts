import { Controller, Get } from '@nestjs/common';
import { CsvService } from './csv.service';

@Controller('csv')
export class CSVController {
  constructor(private readonly csvService: CsvService) { }

  @Get()
  findAll() {
    return this.csvService.getRawCsv();
  }
}
