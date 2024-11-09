import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateRecordedUserDto {
  @ApiProperty({ example: "John", required: false })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiProperty({ example: "Doe", required: false })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiProperty({ example: "johndoe", required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ example: "johndoe@example.com", required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: "https://example.com/avatar.jpg", required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ example: "1985-06-15", required: false })
  @IsOptional()
  @IsString()
  date_of_birth?: string;

  @ApiProperty({ example: "+1-555-1234", required: false })
  @IsOptional()
  @IsString()
  phone_number?: string;
}
