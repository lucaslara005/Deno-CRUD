import requestCheck from "request-check";
import { IProduto } from "./produtos.interface.ts";

export class ProdutoValidator {
  public static validateCreate(data: Partial<IProduto>): string | null {
    const rc = requestCheck.default();
    
    rc.addRule("nome", {
      validator: (value: unknown) => typeof value === "string" && value.trim().length > 0,
      message: "O nome do produto é obrigatório.",
    });
    rc.addRule("sku", {
      validator: (value: unknown) => typeof value === "string" && value.trim().length > 0,
      message: "O SKU é obrigatório.",
    });
    rc.addRule("categoria", {
      validator: (value: unknown) => typeof value === "string" && value.trim().length > 0,
      message: "A categoria é obrigatória.",
    });
    rc.addRule("preco", {
      validator: (value: unknown) => typeof value === "number" && Number.isFinite(value),
      message: "O preço deve ser numérico.",
    });
    rc.addRule("estoque", {
      validator: (value: unknown) => typeof value === "number" && Number.isFinite(value),
      message: "O estoque deve ser numérico.",
    });

    const errors = rc.check(
      { nome: data.nome },
      { preco: data.preco },
      { sku: data.sku },
      { categoria: data.categoria },
      { estoque: data.estoque, isRequiredField: false },
    ) as { message: string }[] | undefined;

    if (errors?.length) {
      return errors
        .map((error: { message: string }) => error.message)
        .join(" ");
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