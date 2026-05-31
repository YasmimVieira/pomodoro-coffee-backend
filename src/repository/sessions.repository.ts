import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sessions } from '../sessions/sessions.entity';
import { TypeORMRepository } from './repository';

@Injectable()
export class SessionsRepository extends TypeORMRepository<Sessions> {
  constructor(
    @InjectRepository(Sessions)
    repository: Repository<Sessions>,
  ) {
    super(repository);
  }

  findByUser(userId: string): Promise<Sessions[]> {
    return this.repository.find({
      where: { user: { id: userId } },
      order: { completedAt: 'DESC' },
    });
  }

  async getStats(userId: string) {
    const result = await this.repository
      .createQueryBuilder('s')
      .select('COUNT(s.id)', 'totalSessions')
      .addSelect('COALESCE(SUM(s.focusMinutes), 0)', 'totalFocusMinutes')
      .addSelect('COALESCE(SUM(s.cycles), 0)', 'totalCycles')
      .where('s.userId = :userId', { userId })
      .getRawOne<{
        totalSessions: string;
        totalFocusMinutes: string;
        totalCycles: string;
      }>();

    return {
      totalSessions: Number(result?.totalSessions ?? 0),
      totalFocusMinutes: Number(result?.totalFocusMinutes ?? 0),
      totalCycles: Number(result?.totalCycles ?? 0),
    };
  }
}
