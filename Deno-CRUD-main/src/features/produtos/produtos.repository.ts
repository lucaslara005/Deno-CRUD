import mongoose, { QueryOptions } from "mongoose";
import { IProduto, ILogMovimentacao } from "./produtos.interface.ts";
import { ProdutoModel, LogMovimentacaoModel } from "./produtos.model.ts";

export class BaseRepository<T> {
    protected model: mongoose.Model<T>;
    constructor(model: mongoose.Model<T>) {
    this.model = model;
  }

  public create(data: Partial<T> | Partial<T>[], options?: QueryOptions) {
    const docs = Array.isArray(data) ? data : [data];
    return this.model.create(docs, options);
  }

  public find(query: object = {}, options?: QueryOptions) {
    return this.model.find(query, null, options);
  }

  public findById(id: string, options?: QueryOptions) {
    return this.model.findById(id, null, options);
  }

  public updateById(id: string, data: Partial<T>, options?: QueryOptions) {
    return this.model.findByIdAndUpdate(id, data, { new: true, ...options });
  }

  public deleteById(id: string, options?: QueryOptions) {
    return this.model.findByIdAndDelete(id, options);
  }
}

export class ProdutoRepository extends BaseRepository<IProduto> {
  constructor(model: mongoose.Model<IProduto> = ProdutoModel) {
    super(model);
  }

  public findBySku(sku: string, options?: QueryOptions) {
    return this.model.findOne({ sku: sku.toUpperCase() }, null, options);
  }
}

export class LogMovimentacaoRepository extends BaseRepository<ILogMovimentacao> {
  constructor(model: mongoose.Model<ILogMovimentacao> = LogMovimentacaoModel) {
    super(model);
  }
}