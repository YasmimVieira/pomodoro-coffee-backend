import { IRepository } from 'src/interfaces/repository.interface';
import { Repository, FindOptionsWhere, ObjectLiteral, DeepPartial } from 'typeorm';

export class TypeORMRepository<T extends ObjectLiteral, ID = string>
  implements IRepository<T, ID>
{
  protected repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data as DeepPartial<T>);
    return this.repository.save(entity);
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findById(id: ID): Promise<T | null> {
    return this.repository.findOne({ where: { id } as FindOptionsWhere<T> });
  }

  async findBy(criteria: Partial<T>): Promise<T[]> {
    return this.repository.find({ where: criteria as FindOptionsWhere<T> });
  }

  async findOne(criteria: Partial<T>): Promise<T | null> {
    return this.repository.findOne({ where: criteria as FindOptionsWhere<T> });
  }

  async update(id: ID, data: Partial<T>): Promise<T> {
    await this.repository.update({ id } as FindOptionsWhere<T>, data);
    return this.findById(id) as Promise<T>;
  }

  async delete(id: ID): Promise<void> {
    await this.repository.delete({ id } as FindOptionsWhere<T>);
  }

  async count(criteria?: Partial<T>): Promise<number> {
    return this.repository.count({
      where: criteria as FindOptionsWhere<T>,
    });
  }

  async exists(criteria: Partial<T>): Promise<boolean> {
    const count = await this.count(criteria);
    return count > 0;
  }

  async findPaginated(
    page: number = 1,
    pageSize: number = 10,
    criteria?: Partial<T>,
  ): Promise<{ data: T[]; total: number; page: number; pageSize: number }> {
    const [data, total] = await this.repository.findAndCount({
      where: criteria as FindOptionsWhere<T>,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { data, total, page, pageSize };
  }

  protected getQueryBuilder(alias: string = 'entity') {
    return this.repository.createQueryBuilder(alias);
  }
}