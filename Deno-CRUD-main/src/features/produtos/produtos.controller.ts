import { Request, Response } from "express";
import "responser";
import throwlhos from "throwlhos";
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

      res.send_created("Produto criado com sucesso!", { data: novoProduto });
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("Dados inválidos")) {
        throw throwlhos.err_badRequest(error.message);
      }
      if (error instanceof Error && error.message.includes("já existe")) {
        throw throwlhos.err_conflict(error.message);
      }
      throw error;
    }
  };

  public listar = async (_req: Request, res: Response): Promise<void> => {  //vai direto no repositorio
    try{
      const produtos = await this.produtoRepo.find({});
    res.send_ok("Produtos listados com sucesso.", {data: produtos,});
    } catch(error) {
        throw throwlhos.err_internalServerError("Falha ao consultar produtos no banco");
    }
  };
  

  public buscarPorId = async (req: Request, res: Response): Promise<void> => {
    const id  = req.params.id;
    const produto = await this.produtoRepo.findById(id);

    if (!produto) {
      throw throwlhos.err_notFound("Produto não encontrado.");
    }

    res.send_ok("Produto localizado com sucesso.", {
      
      data: produto,
    });
  };

  public atualizar = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const produtoAtualizado = await this.produtoRepo.updateById(id, req.body);

    if (!produtoAtualizado) {
      throw res.err_notFound("Produto não encontrado para atualização.");
    }

    res.send_ok("Produto atualizado com sucesso.", {
      
      data: produtoAtualizado,
    });
  };

  public deletar = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const produtoDeletado = await this.produtoRepo.deleteById(id);

    if (!produtoDeletado) {
      throw throwlhos.err_notFound("Produto não encontrado para remoção.");
    }

    res.send_ok("Produto removido com sucesso.", {data: produtoDeletado});
  };
}