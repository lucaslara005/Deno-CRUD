import { Types } from "mongoose"

export interface IProduto {
    _id?: Types.ObjectId;
    nome: string;
    preco: number;
    sku: string;
    estoque: number;
    categoria: string;
    descricao?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ILogMovimentacao {
  _id?: Types.ObjectId;
  produtoId: Types.ObjectId;
  tipo: "ENTRADA" | "SAIDA" | "CADASTRO";
  quantidade: number;
  descricao: string;
  createdAt?: Date;
}