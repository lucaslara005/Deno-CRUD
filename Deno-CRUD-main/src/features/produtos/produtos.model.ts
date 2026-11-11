import mongoose, { Schema } from "mongoose";
import { IProduto, ILogMovimentacao } from "./produtos.interface.ts";

export class ProdutoClass implements IProduto {
  nome!: IProduto["nome"];
  preco!: IProduto["preco"];
  sku!: IProduto["sku"];
  estoque!: IProduto["estoque"];
  categoria!: IProduto["categoria"];
  descricao!: IProduto["descricao"];

  get nomeComSku(): string {
    return `${this.nome} (${this.sku})`;
  }
}

export class LogMovimentacaoClass implements ILogMovimentacao {
  produtoId!: ILogMovimentacao["produtoId"];
  tipo!: ILogMovimentacao["tipo"];
  quantidade!: ILogMovimentacao["quantidade"];
  descricao!: ILogMovimentacao["descricao"];
}

const ProdutoSchema = new Schema<IProduto>(
  {
    nome: {
      type: String,
      required: [true, "O nome do produto é obrigatório!"],
      trim: true,
    },
    preco: {
      type: Number,
      required: [true, "O preço do produto é obrigatório!"],
      min: [0, "O preço não pode ser negativo!"],
    },
    sku: {
      type: String,
      required: [true, "O SKU é obrigatório!"],
      trim: true,
      unique: true,
      set: (value: string) => (value ? value.toUpperCase() : value),
    },
    estoque: {
      type: Number,
      required: [true, "A quantidade em estoque é obrigatória!"],
      min: [0, "O estoque não pode ser negativo!"],
      default: 0,
    },
    categoria: {
      type: String,
      required: [true, "A categoria é obrigatória!"],
      trim: true,
    },
    descricao: {
      type: String,
      required: false,
      default: null,
    }
  },
  { timestamps: true }
);

ProdutoSchema.loadClass(ProdutoClass);

const LogMovimentacaoSchema = new Schema<ILogMovimentacao>(
  {
    produtoId: {
      type: Schema.Types.ObjectId,
      ref: "Produto",
      required: [true, "O ID do produto é obrigatório!"],
    },
    tipo: {
      type: String,
      enum: ["ENTRADA", "SAIDA", "CADASTRO"],
      required: [true, "O tipo de movimentação é obrigatório!"],
    },
    quantidade: {
      type: Number,
      required: [true, "A quantidade é obrigatória!"],
    },
    descricao: {
      type: String,
      required: [true, "A descrição é obrigatória!"],
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

LogMovimentacaoSchema.loadClass(LogMovimentacaoClass); //nesse caso, nao precisava mas é pela padronizacao do projeto

export const ProdutoModel = mongoose.model<IProduto>("Produto", ProdutoSchema);
export const LogMovimentacaoModel = mongoose.model<ILogMovimentacao>("LogMovimentacao", LogMovimentacaoSchema);