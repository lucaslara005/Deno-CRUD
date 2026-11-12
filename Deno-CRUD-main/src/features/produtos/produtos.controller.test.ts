import { assertEquals, assertExists } from "@std/assert";
import { Request, Response } from "express";
import { ProdutoController } from "./produtos.controller.ts";
import { CriarProdutoComLogService } from "./produtos.service.ts";
import { ProdutoRepository } from "./produtos.repository.ts";

const criarMockResponse = () => { //resposta falsa
  const res: Record<string, unknown> = {
    statusCode: 200,
    payload: null,
  };

  //metodos para modificar propriedades da resposta
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };

  res.json = (data: unknown) => {
    res.payload = data;
    return res;
  };

  res.send = (data: unknown) => {
    res.payload = data;
    return res;
  };


  return res as unknown as Response & { statusCode: number; payload: Record<string, unknown> };
};

Deno.test("ProdutoController - Deve listar produtos com status 200", async () => {   // /
  const fakeService = {} as CriarProdutoComLogService; //conjunto vazio, pois eu nao vou precisar criar
  const fakeProdutoRepo = {
    find: () =>
      Promise.resolve([
        { nome: "Cadeira Gamer", preco: 950, sku: "CAD-01", categoria: "Móveis" },
      ]),
  } as unknown as ProdutoRepository;

  const controller = new ProdutoController(fakeService, fakeProdutoRepo);
  const req = {} as Request;
  const res = criarMockResponse();

  await controller.listar(req, res);

  assertEquals(res.statusCode, 200);
});

Deno.test("ProdutoController - Deve responder 500 quando listar falhar no repositório", async () => {
  const fakeService = {} as CriarProdutoComLogService;
  const fakeRepo = {
    find: () => Promise.reject(new Error("Falha ao consultar produtos no banco")),  //simular uma queda de conexao
  } as unknown as ProdutoRepository;

  const controller = new ProdutoController(fakeService, fakeRepo);
  const req = {} as Request;
  const res = criarMockResponse();

  await controller.listar(req, res);

  assertEquals(res.statusCode, 500);
  assertEquals(res.payload.code, 500);
});

Deno.test("ProdutoController - Deve retornar status 200 ao buscar produto existente por ID", async () => { // /:id
  const fakeService = {} as CriarProdutoComLogService;
  const fakeRepo = {
    findById: () =>
      Promise.resolve({
        _id: "65f1a2b3c4d5e6f7a8b9c0d1",
        nome: "Webcam Full HD",
        preco: 320,
        sku: "WEB-001",
        categoria: "Periféricos",
      }),
  } as unknown as ProdutoRepository;

  const controller = new ProdutoController(fakeService, fakeRepo);
  const req = { params: { id: "65f1a2b3c4d5e6f7a8b9c0d1" } } as unknown as Request;
  const res = criarMockResponse();

  await controller.buscarPorId(req, res);

  assertEquals(res.statusCode, 200);
  assertExists(res.payload);
});


Deno.test("ProdutoController - Deve responder 404 se produto não existir", async () => {
  const fakeService = {} as CriarProdutoComLogService;
  const fakeRepo = {
    findById: () => Promise.resolve(null),
  } as unknown as ProdutoRepository;

  const controller = new ProdutoController(fakeService, fakeRepo);
  const req = { params: { id: "id_inexistente" } } as unknown as Request;
  const res = criarMockResponse();

  await controller.buscarPorId(req, res);

  assertEquals(res.statusCode, 404);
  assertEquals(res.payload.code, 404);
});