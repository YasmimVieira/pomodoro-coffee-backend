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

  async findByUser(userId: string, page: number = 1) {
    const PAGE_SIZE = 10;
    const [data, total] = await this.repository.findAndCount({
      where: { user: { id: userId } },
      order: { completedAt: 'DESC' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    });

    return {
      data,
      total,
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil(total / PAGE_SIZE),
    };
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
