import { Controller, Get, Query, Body, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserArrayDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(
    @Query('limit') limit: string = '1'
  ) {
    return this.userService.findAll(Number(limit));
  }

  @Post()
  create(@Body() createUserArrayDto: CreateUserArrayDto) {
    return this.userService.create(createUserArrayDto);
  }
}
