import { DeepPartial } from 'typeorm';

export interface IRepository<T, ID = string> {
  create(data: DeepPartial<T>): Promise<T>;
  findAll(): Promise<T[]>;
  findById(id: ID): Promise<T | null>;
  findBy(criteria: Partial<T>): Promise<T[]>;
  findOne(criteria: Partial<T>): Promise<T | null>;
  update(id: ID, data: Partial<T>): Promise<T>;
  delete(id: ID): Promise<void>;
  count(criteria?: Partial<T>): Promise<number>;
  exists(criteria: Partial<T>): Promise<boolean>;
  findPaginated(page: number, pageSize: number): Promise<{
    data: T[];
    total: number;
    page: number;
    pageSize: number;
  }>;
}