import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { User } from 'src/utils/interfaces/user.model';
import * as fastCsv from 'fast-csv';

@Injectable()
export class CsvService implements OnModuleInit {
  private readonly filePath = path.resolve('database.csv');
  private usersData: User[] = [];

  onModuleInit() {
    this.loadCsvData();
  }

  private async loadCsvData(): Promise<void> {
    if (fs.existsSync(this.filePath)) {
      const stream = fs.createReadStream(this.filePath);

      this.usersData = [];

      return new Promise((resolve, reject) => {
        fastCsv.parseStream(stream, { headers: true })
          .on('data', (row) => {
            const { id, first_name, last_name, username, email, avatar, date_of_birth, phone_number } = row;
            if (id && first_name && last_name && username && email && avatar && date_of_birth && phone_number) {
              this.usersData.push({
                id: Number(id),
                first_name,
                last_name,
                username,
                email,
                avatar,
                date_of_birth,
                phone_number,
              });
            }
          })
          .on('end', () => {
            resolve();
          })
          .on('error', (error) => {
            reject(error);
          });
      });
    } else {
      console.error('Arquivo CSV não encontrado!');
    }
  }

  private async saveUsers(): Promise<void> {

    if (this.usersData.length === 0) {
      fs.writeFileSync(this.filePath, '');
      return;
    }

    const writeStream = fs.createWriteStream(this.filePath);
    const csvContent = fastCsv.format({ headers: true });

    csvContent.write([
      'id', 'first_name', 'last_name', 'username', 'email', 'avatar', 'date_of_birth', 'phone_number'
    ]);

    this.usersData.forEach(user => {
      csvContent.write([
        user.id,
        user.first_name,
        user.last_name,
        user.username,
        user.email,
        user.avatar,
        user.date_of_birth,
        user.phone_number
      ]);
    });

    csvContent.pipe(writeStream);
  }

  async addUsers(users: User[]): Promise<void> {
    await this.loadCsvData();
    const newUsers = users;
    let csvContent = [];

    if (fs.existsSync(this.filePath)) {
      const csvFile = fs.readFileSync(this.filePath, 'utf8');

      if (csvFile.length > 0) {
        const existingData = csvFile.split('\n').slice(1).map((row) => {
          const [id, first_name, last_name, username, email, avatar, date_of_birth, phone_number] = row.split(',');
          return {
            id: Number(id),
            first_name,
            last_name,
            username,
            email,
            avatar,
            date_of_birth,
            phone_number,
          };
        });

        const newUserRows = newUsers.filter((user) => {
          return !existingData.some(existingUser => existingUser.id === user.id);
        }).map((user) => ({
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
        csvContent = allData;
      } else {
        csvContent = newUsers;
      }
    } else {
      csvContent = newUsers;
    }

    this.usersData = csvContent;
    await this.saveUsers();
  }

  async updateUser(id: number, updatedUser: User): Promise<void> {
    const user = this.usersData.find(user => user.id === id);

    if (!user) {
      throw new Error(`Usuário não encontrado`);
    }

    Object.assign(user, updatedUser);

    await this.saveUsers();
  }

  async removeUsers(ids: number[]): Promise<void> {
    await this.loadCsvData();
    const usersToRemove = this.usersData.filter(user => ids.includes(Number(user.id)));

    if (usersToRemove.length === 0) {
      throw new Error('Nenhum usuário encontrado para remover');
    }

    this.usersData = this.usersData.filter(user => !ids.includes(Number(user.id)));

    if (this.usersData.length === 0) {
      this.usersData = [];
    }

    await this.saveUsers();
  }

  async getUsers(): Promise<User[]> {
    await this.loadCsvData();
    return this.usersData;
  }
}
