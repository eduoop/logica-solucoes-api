import { Injectable } from '@nestjs/common';
import { UpdateRecordedUserDto } from './dto/update-recorded-user.dto';
import { CsvService } from 'src/csv/csv.service';
import { User } from 'src/utils/interfaces/user.model';

@Injectable()
export class RecordedUserService {

  constructor(
    private readonly csvService: CsvService
  ) { }

  async findAll({ page, limit, search }: { page: number; limit: number; search: string }): Promise<{
    items: User[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  }> {

    const allUsers = await this.csvService.getUsers();

    let filteredUsers = allUsers;
    if (search) {
      filteredUsers = allUsers.filter(user =>
        user.first_name.toLowerCase().includes(search.toLowerCase()) ||
        user.username.toLowerCase().includes(search.toLowerCase())
      );
    }

    const totalItems = filteredUsers.length;

    const startIndex = (page - 1) * limit;
    const paginatedUsers = filteredUsers.splice(startIndex, limit);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: paginatedUsers,
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
    };
  }

  async update(id: number, updateRecordedUserDto: UpdateRecordedUserDto) {
    const allUsers = await this.csvService.getUsers();

    const userIndex = allUsers.findIndex(user => user.id === id);

    if (userIndex === -1) {
        throw new Error(`Usuário não encontrado`);
    }

    const { first_name, last_name, username, email, avatar, date_of_birth, phone_number } = updateRecordedUserDto;
    const updatedUserData = { first_name, last_name, username, email, avatar, date_of_birth, phone_number };

    const updatedUser = { ...allUsers[userIndex], ...updatedUserData };

    allUsers[userIndex] = updatedUser;

    await this.csvService.updateUser(id, updatedUser);

    return {
        updatedUser,
    };
}

  async remove(ids: number[]): Promise<{ message: string }> {
    try {
      await this.csvService.removeUsers(ids);
      return { message: 'Usuários removidos com sucesso' };
    } catch (e) {
      throw new Error(e.message || 'Erro ao remover os usuários');
    }
  }
}
