import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar: string;
  date_of_birth: string;
  phone_number: string;
}

@Injectable()
export class CsvService implements OnModuleInit {
  private readonly filePath = path.resolve('database.csv');  
  private usersData: User[] = [];

  onModuleInit() {
    this.loadCsvData();
  }

  private loadCsvData() {
    if (fs.existsSync(this.filePath)) {
      const csvFile = fs.readFileSync(this.filePath, 'utf8');
      
      if (csvFile.length > 0) {
        
        const rows = csvFile.split(/\r?\n/).slice(1);

        this.usersData = rows.map((row) => {
          const columns = row.split(',');  
          if (columns.length === 8) {  
            const [id, first_name, last_name, username, email, avatar, date_of_birth, phone_number] = columns;
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
          }
          return null;  
        }).filter(user => user !== null);
      } else {
        console.error('Arquivo CSV está vazio!');
      }
    } else {
      console.error('Arquivo CSV não encontrado!');
    }
  }

  getUsers(): User[] {
    return this.usersData;
  }
}
