import mongoose from "mongoose";
import { IProduto } from "./produtos.interface.ts";
import { ProdutoRepository, LogMovimentacaoRepository } from "./produtos.repository.ts";
import { ProdutoValidator } from "./produtos.validator.ts";

export class CriarProdutoComLogService {
    constructor(private produtoRepo: ProdutoRepository = new ProdutoRepository(), private logRepo: LogMovimentacaoRepository = new LogMovimentacaoRepository()
  ) {}

  public async execute(data: IProduto) {
    const validationError = ProdutoValidator.validateCreate(data);
    if (validationError) {
      throw new Error("Dados inválidos");
    }

    const skuExistente = await this.produtoRepo.findBySku(data.sku);
    if (skuExistente) {
      throw new Error(`Já existe um produto registado com o SKU: ${data.sku.toUpperCase()}`);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const [novoProduto] = await this.produtoRepo.create(
        [
          {
            nome: data.nome,
            preco: data.preco,
            sku: data.sku,
            estoque: data.estoque ?? 0,
            categoria: data.categoria,
            descricao: data.descricao ?? null,
          },
        ],
        { session }
      );

      await this.logRepo.create(
        [
          {
            produtoId: novoProduto._id,
            tipo: "CADASTRO",
            quantidade: novoProduto.estoque,
            descricao: `Produto ${novoProduto.nome} criado com estoque inicial de ${novoProduto.estoque}.`,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return novoProduto;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}