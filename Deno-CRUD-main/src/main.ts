import "dotenv/config";
import express, { type NextFunction, type Request, type Response } from "express";
import responser from "responser";
import throwlhos from "throwlhos";
import { Database } from "./config/database.ts";
import routerAuth from "./features/auth/auth.routes.ts";
import routerProdutos from "./features/produtos/produtos.routes.ts";

const dbHost = Deno.env.get("DB_HOST") || "localhost";
const dbName = Deno.env.get("DB_NAME") || "produtos_db";
const port = Number(Deno.env.get("PORT") || "3000");


const mongoUri = `mongodb://${dbHost}:27017/${dbName}?replicaSet=rs0`;

console.log(`A iniciar servidor na porta ${port}...`);
await Database.connect(mongoUri);



const app = express(); //"app" vira um objeto que reune a configuracao da aplicacao
app.use(express.json()); //cria um middleware que reconhece requisições com corpo JSON e interpreta esse conteúdo, deixando os dados disponíveis em req.body
app.use(responser.default);
app.use("/api/auth", routerAuth); //acoplhamento ao servidor principal. Rota final: POST /api/auth/login
app.use("/api/produtos", routerProdutos);
app.use(throwlhos.default.middleware);

app.use((
  err: { code?: number; status?: string; message?: string; errors?: unknown },
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const code = Number.isInteger(err?.code) && err.code! >= 400 && err.code! <= 599
    ? err.code!
    : 500; // erros que não são do throwlhos viram 500
  res.status(code).json({
    code,
    status: err?.status,
    message: err?.message,
    errors: err?.errors,
  });
});

app.listen(port, () => { //o servidor comeca a escutar as requisicoes aqui
  console.log(`Servidor iniciado na porta ${port}.`);
});