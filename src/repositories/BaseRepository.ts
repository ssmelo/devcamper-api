import {  Document, Model, PromiseProvider } from "mongoose";
import { IBaseRepository } from "./interfaces/IBaseRepository";

class BaseRepository<T extends Document> implements IBaseRepository<T> {

    private readonly _model: Model<T>;

    constructor(model: Model<T>) {
        this._model = model;
    }

    async get(): Promise<T[]> {
        return this._model.find();
    }
    async getOne(id: string): Promise<T> {
        return this._model.findById(id);
    }
    create(item: T): Promise<T> {
        return this._model.create(item);
    }
    update(id: string, item: T): Promise<T> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<T> {
        throw new Error("Method not implemented.");
    }
};

export { BaseRepository }