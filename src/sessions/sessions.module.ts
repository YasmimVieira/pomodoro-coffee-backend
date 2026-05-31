import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { SessionsRepository } from '../repository/sessions.repository';
import { Sessions } from './sessions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sessions])],
  providers: [SessionsService, SessionsRepository],
  controllers: [SessionsController],
})
export class SessionsModule {}
