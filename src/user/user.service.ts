import { BadRequestException, Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { EnvService } from 'src/env/env.service';
import { validateOrReject, ValidationError } from 'class-validator';
import { User } from 'src/utils/interfaces/user.model';
import { CreateUserArrayDto } from './dto/create-user.dto';
import { CsvService } from 'src/csv/csv.service';
@Injectable()
export class UserService {
  constructor(
    private readonly httpService: HttpService, 
    private readonly envService: EnvService,
    private readonly csvService: CsvService,
  ) { }

  findAll(limit: number = 10): Observable<any> {
    const apiUrl = this.envService.get('RANDOM_DATA_API_URL');
    const url = `${apiUrl}?size=${limit}`;

    return this.httpService.get<User[]>(url).pipe(
      map((response) => {
        return {
          data: response.data,
          pagination: {
            itemsPerPage: limit,
          },
        };
      }),
    );
  }

  async create(usersData: CreateUserArrayDto) {

    try {
      const createUserDto = new CreateUserArrayDto();
      Object.assign(createUserDto, usersData);

      await validateOrReject(createUserDto);
      try {
      this.csvService.addUsers(usersData.users)
      }  catch (error) {
        console.error('Erro ao processar os dados:', error);
      }
    } catch (e) {
      if (e instanceof Array && e[0] instanceof ValidationError) {
        const errorMessages = e.map(error =>
          Object.values(error.constraints || {}).join(", ")
        );

        throw new BadRequestException({
          message: errorMessages,
          errors: e
        });
      }

      throw new BadRequestException(e);
    }
  }
}

