import { assertEquals, assertExists, assertRejects } from "@std/assert"; //dispara erro e interrompe o teste, caso alguma condicao falhar
import type mongoose from "mongoose";
import { CriarProdutoComLogService } from "./produtos.service.ts";
import { ProdutoRepository, LogMovimentacaoRepository } from "./produtos.repository.ts";

const criarSessaoFalsa = () => {
  const estado = { //grava cada passo da sessao
    iniciada: false,
    confirmada: false,
    abortada: false,
    encerrada: false,
  };

  const session = { //objeto que finge ser o Mongoose
    startTransaction: () => { //sincorno
      estado.iniciada = true;
    },
    commitTransaction: () => { 
      estado.confirmada = true;
      return Promise.resolve();
    },
    abortTransaction: () => {
      estado.abortada = true;
      return Promise.resolve();
    },
    endSession: () => { //sincorno
      estado.encerrada = true;
    },
  } as unknown as mongoose.ClientSession; //ClientSession exige varias propriedades, por isso tem q dizer que esse objeto se comporta como um ClientSession

  return { session, estado };
};

Deno.test("CriarProdutoComLogService - Deve rejeitar dados inválidos (preço negativo)", async () => {
  const fakeProdutoRepo = {} as ProdutoRepository;
  const fakeLogRepo = {} as LogMovimentacaoRepository;

  const service = new CriarProdutoComLogService(fakeProdutoRepo, fakeLogRepo);

  await assertRejects(
    async () => {
      await service.execute({
        nome: "Teclado Mecânico",
        preco: -50,
        sku: "TEC-001",
        categoria: "Periféricos",
        estoque: 1
      });
    },
    Error,
    "Dados inválidos"
  );
});

Deno.test("CriarProdutoComLogService - Deve rejeitar quando o SKU já existir", async () => {
  const fakeProdutoRepo = {
    findBySku: () => Promise.resolve({ nome: "Produto Existente", sku: "TEC-001" }),
  } as unknown as ProdutoRepository;

  const fakeLogRepo = {} as LogMovimentacaoRepository;

  const service = new CriarProdutoComLogService(fakeProdutoRepo, fakeLogRepo);

  await assertRejects(
    async () => {
      await service.execute({
        nome: "Teclado Novo",
        preco: 200,
        sku: "TEC-001",
        categoria: "Periféricos",
        estoque: 1
      });
    },
    Error,
    "Já existe um produto registado com o SKU: TEC-001"
  );
});

Deno.test("CriarProdutoComLogService - Deve criar produto, registar log e confirmar transação", async () => {
  const { session, estado } = criarSessaoFalsa();
  let logGravado = false;

  const fakeProdutoRepo = {
    findBySku: () => Promise.resolve(null),
    create: () =>
      Promise.resolve([
        {
          _id: "65f1a2b3c4d5e6f7a8b9c0d1",
          nome: "Monitor 27",
          preco: 1200,
          sku: "MON-027",
          estoque: 5,
          categoria: "Monitores",
        },
      ]),
  } as unknown as ProdutoRepository;

  const fakeLogRepo = {
    create: () => {
      logGravado = true;
      return Promise.resolve([{ _id: "log123" }]);
    },
  } as unknown as LogMovimentacaoRepository;

  // Injeta a sessão falsa diretamente no construtor, para que assim os valores de "estado" sejam atualizados
  const service = new CriarProdutoComLogService(
    fakeProdutoRepo,
    fakeLogRepo,
    () => Promise.resolve(session)
  );

  const produtoCriado = await service.execute({
    nome: "Monitor 27",
    preco: 1200,
    sku: "MON-027",
    estoque: 5,
    categoria: "Monitores",
  });

  assertExists(produtoCriado);
  assertEquals(produtoCriado.sku, "MON-027");
  assertEquals(logGravado, true);
  assertEquals(estado.iniciada, true);
  assertEquals(estado.confirmada, true);
  assertEquals(estado.abortada, false);
  assertEquals(estado.encerrada, true);
});

Deno.test("CriarProdutoComLogService - Deve fazer rollback (abortTransaction) se o log falhar", async () => {
  const { session, estado } = criarSessaoFalsa();

  const fakeProdutoRepo = {
    findBySku: () => Promise.resolve(null),
    create: () =>
      Promise.resolve([
        {
          _id: "65f1a2b3c4d5e6f7a8b9c0d1",
          nome: "Mouse Sem Fio",
          preco: 150,
          sku: "MOU-001",
          estoque: 10,
          categoria: "Periféricos",
        },
      ]),
  } as unknown as ProdutoRepository;

  const fakeLogRepo = {
    create: () => Promise.reject(new Error("Falha simulada ao gravar log")),
  } as unknown as LogMovimentacaoRepository;

  // Injeta a sessão falsa diretamente no construtor
  const service = new CriarProdutoComLogService(
    fakeProdutoRepo,
    fakeLogRepo,
    () => Promise.resolve(session)
  );

  await assertRejects(
    async () => {
      await service.execute({
        nome: "Mouse Sem Fio",
        preco: 150,
        sku: "MOU-001",
        estoque: 10,
        categoria: "Periféricos",
      });
    },
    Error,
    "Falha simulada ao gravar log"
  );

  assertEquals(estado.iniciada, true);
  assertEquals(estado.confirmada, false);
  assertEquals(estado.abortada, true);
  assertEquals(estado.encerrada, true);
});