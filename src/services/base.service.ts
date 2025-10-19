import { Repository } from "typeorm";

export abstract class BaseService<T> {
  constructor(protected repo: Repository<T>) {}

  async findAll(options = {}) {
    return this.repo.find(options);
  }

  async findById(id: number) {
    // @ts-ignore
    return this.repo.findOne({ where: { id } });
  }

  async create(entity: Partial<T>) {
    const e = this.repo.create(entity as any);
    await this.repo.save(e);
    return e;
  }

  async update(id: number, data: Partial<T>) {
    // @ts-ignore
    const existing = await this.findById(id);
    if (!existing) return null;
    this.repo.merge(existing as any, data);
    await this.repo.save(existing as any);
    return existing;
  }

  async delete(id: number) {
    const res = await this.repo.delete({ id } as any);
    return res.affected !== 0;
  }
}
