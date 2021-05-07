import { Document, Model, Query } from "mongoose";

interface IBaseRepository<T extends Document> {
    get(): Promise<T[]>;
    getOne(id: string): Promise<T>;
    create(item: T): Promise<T>;
    update(id: string, item: T): Promise<T>;
    delete(id: string): Promise<T>;
}

export { IBaseRepository }