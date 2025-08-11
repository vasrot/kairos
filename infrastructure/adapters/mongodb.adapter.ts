import mongoose, { Model, Document } from 'mongoose';
import { DbPort } from '../../domain/ports/db.port';

export class MongoDbAdapter<T extends Document> implements DbPort<T> {
  constructor(private model: Model<T>) {}

  async create(item: T): Promise<T> {
    const createdItem = new this.model(item);
    return createdItem.save();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async update(id: string, item: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, item, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }
}
