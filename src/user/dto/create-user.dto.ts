import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional, IsObject, ValidateNested, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class CreateUserDto {
  @ApiProperty({ example: 2412 })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({ example: "John" })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({ example: "Doe" })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({ example: "johndoe" })
  @IsString()
  username: string;

  @ApiProperty({ example: "johndoe@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "https://example.com/avatar.jpg", required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ example: "1985-06-15" })
  @IsString()
  date_of_birth: string;

  @ApiProperty({ example: "+1-555-1234" })
  @IsString()
  phone_number: string;
}

export class CreateUserArrayDto {
  @ApiProperty({ type: [CreateUserDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  @IsNotEmpty()
  users: CreateUserDto[];
}
