import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { Users } from './users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [UsersService, UsersRepository],
  controllers: [],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
