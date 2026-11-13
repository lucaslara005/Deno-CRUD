import { Request, Response } from "express";
import "responser";
import { throwlhos } from "../../config/throwlhos.ts";
import { CriarProdutoComLogService } from "./produtos.service.ts";
import { ProdutoRepository } from "./produtos.repository.ts";


export class ProdutoController {
  constructor(
    private criarProdutoService: CriarProdutoComLogService = new CriarProdutoComLogService(),
    private produtoRepo: ProdutoRepository = new ProdutoRepository()
  ) {}

  public criar = async (req: Request, res: Response): Promise<void> => { //"criar" tem Service pq apresenta regra de negocio mais elaborada
    try {
      const novoProduto = await this.criarProdutoService.execute(req.body);

      res.status(201).json({ code: 201, message: "Produto criado com sucesso!", data: novoProduto });
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("Dados inválidos")) {
        throw throwlhos.err_badRequest(error.message, {body: req.body});
      }
      if (error instanceof Error && error.message.includes("já existe")) {
        throw throwlhos.err_conflict(error.message, {sku: req.body.sku});
      }
      throw error;
    }
  };

  public listar = async (req: Request, res: Response): Promise<void> => {  //vai direto no repositorio
    try{
      const produtos = await this.produtoRepo.find({});
    res.status(200).json({ code: 200, message: "Produtos listados com sucesso.", data: produtos });
    } catch(error) {
        throw throwlhos.err_internalServerError("Falha ao consultar produtos no banco!", {path: req.originalUrl, error: error instanceof Error ? error.message : error});
    }
  };
  

  public buscarPorId = async (req: Request, res: Response): Promise<void> => {
    const id  = req.params.id;
    const produto = await this.produtoRepo.findById(id);

    if (!produto) {
      throw throwlhos.err_notFound("Produto não encontrado.", {id: id});
    }

    res.status(200).json({
      code: 200,
      message: "Produto localizado com sucesso.",
      data: produto,
    });
  };

  public atualizar = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const produtoAtualizado = await this.produtoRepo.updateById(id, req.body);

    if (!produtoAtualizado) {
      throw throwlhos.err_notFound("Produto não encontrado para atualização.", {id: id});
    }

    res.status(200).json({
      code: 200,
      message: "Produto atualizado com sucesso.",
      data: produtoAtualizado,
    });
  };

  public deletar = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const produtoDeletado = await this.produtoRepo.deleteById(id);

    if (!produtoDeletado) {
      throw throwlhos.err_notFound("Produto não encontrado para remoção.", {ID: id});
    }

    res.status(200).json({ code: 200, message: "Produto removido com sucesso.", data: produtoDeletado });
  };
}