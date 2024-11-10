import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RecordedUserService } from './recorded-user.service';
import { UpdateRecordedUserDto } from './dto/update-recorded-user.dto';

@Controller('recorded-users')
export class RecordedUserController {
  constructor(private readonly recordedUserService: RecordedUserService) {}

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = ''
  ) {
    return this.recordedUserService.findAll({ page, limit, search });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecordedUserDto: UpdateRecordedUserDto) {
    return this.recordedUserService.update(+id, updateRecordedUserDto);
  }

  @Delete()
  remove(@Body() body: {
    ids: number[]
  }) {
    return this.recordedUserService.remove(body.ids);
  }
}
