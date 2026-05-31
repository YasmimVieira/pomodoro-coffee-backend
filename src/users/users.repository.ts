import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { TypeORMRepository } from 'src/repository/repository';

@Injectable()
export class UsersRepository extends TypeORMRepository<Users> {
  constructor(
    @InjectRepository(Users)
    repository: Repository<Users>,
  ) {
    super(repository);
  }

  // Métodos específicos do domínio
  async findByEmail(email: string): Promise<Users | null> {
    return this.repository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  async findByEmailWithPassword(email: string): Promise<Users | null> {
    // Precisa do password para autenticação
    return this.repository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email.toLowerCase() })
      .addSelect('user.password')
      .getOne();
  }
}