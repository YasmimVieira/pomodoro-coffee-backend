import { Injectable } from '@nestjs/common';
import { SessionsRepository } from '../repository/sessions.repository';

@Injectable()
export class SessionsService {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  create(userId: string, focusMinutes: number, cycles: number, completedAt: number) {
    return this.sessionsRepository.create({
      focusMinutes,
      cycles,
      completedAt,
      user: { id: userId },
    });
  }

  findByUser(userId: string) {
    return this.sessionsRepository.findByUser(userId);
  }

  getStats(userId: string) {
    return this.sessionsRepository.getStats(userId);
  }
}
