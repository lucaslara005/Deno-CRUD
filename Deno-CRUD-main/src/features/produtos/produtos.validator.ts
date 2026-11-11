import RequestCheckImport from "request-check";
import { IProduto } from "./produtos.interface.ts";
const RequestCheck = RequestCheckImport as any; //para que o compilador do typescript aceite RequestCheck como uma classe

export class ProdutoValidator {
  public static validateCreate(data: Partial<IProduto>): string | null {
    const rc =  new RequestCheck();

    rc.required(["nome", "preco", "sku", "categoria"], data);
    rc.isString(["nome", "sku", "categoria"], data);
    rc.isNumber(["preco"], data);

    if (data.estoque !== undefined && data.estoque !== null) {
      rc.isNumber(["estoque"], data);
    }

    if (rc.check()) {
      return rc.check();
    }

    if (typeof data.preco === "number" && data.preco < 0) {
      return "O preço não pode ser negativo!";
    }

    if (typeof data.estoque === "number" && data.estoque < 0) {
      return "O estoque não pode ser negativo!";
    }

    return null;
  }
}