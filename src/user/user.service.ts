import { BadRequestException, Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { EnvService } from 'src/env/env.service';
import { validateOrReject, ValidationError } from 'class-validator';
import { json2csv } from 'json-2-csv';
import * as fs from 'fs';
import { User } from 'src/utils/interfaces/user.model';
import { CreateUserArrayDto } from './dto/create-user.dto';
import { CsvService } from 'src/csv/csv.service';
@Injectable()
export class UserService {
  constructor(
    private readonly httpService: HttpService, 
    private readonly envService: EnvService,
    private readonly csvService: CsvService
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

    console.log(this.csvService.getUsers())

    try {
      const createUserDto = new CreateUserArrayDto();
      Object.assign(createUserDto, usersData);

      await validateOrReject(createUserDto);
      try {
        const filePath = 'database.csv';
        const newUsersCsv = await json2csv(usersData.users);
      
        let csvContent = '';
      
        if (fs.existsSync(filePath)) {
          const csvFile = fs.readFileSync(filePath, 'utf8');
          if (csvFile.length > 0) {
            const existingData = csvFile.split('\n').slice(1).map((row) => {
              const [id, first_name, last_name, username, email, avatar, date_of_birth, phone_number] = row.split(',');
              return {
                id,
                first_name,
                last_name,
                username,
                email,
                avatar,
                date_of_birth,
                phone_number,
              };
            });
      
            const newUserRows = usersData.users.map((user) => ({
              id: Number(user.id),
              first_name: user.first_name,
              last_name: user.last_name,
              username: user.username,
              email: user.email,
              avatar: user.avatar,
              date_of_birth: user.date_of_birth,
              phone_number: user.phone_number,
            }));
      
            const allData = [...existingData, ...newUserRows];
      
            csvContent = json2csv(allData);
          } else {
            csvContent = newUsersCsv;
          }
        } else {
          csvContent = newUsersCsv;
        }
      
        fs.writeFileSync(filePath, csvContent, 'utf8');
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

