import "dotenv/config";
import express from "express";
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
app.use(throwlhos.default.middleware);
app.use("/api/auth", routerAuth); //acoplhamento ao servidor principal. Rota final: POST /api/auth/login
app.use("/api/produtos", routerProdutos);


app.listen(port, () => { //o servidor comeca a escutar as requisicoes aqui
  console.log(`Servidor iniciado na porta ${port}.`);
});