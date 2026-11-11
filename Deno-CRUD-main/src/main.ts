import "dotenv/config";
import express from "express";
import { Database } from "./config/database.ts";
import routerAuth from "./features/auth/auth.routes.ts";


const dbHost = Deno.env.get("DB_HOST") || "localhost";
const dbName = Deno.env.get("DB_NAME") || "produtos_db";
const port = Deno.env.get("PORT") || "27017";


const mongoUri = `mongodb://${dbHost}:27017/${dbName}?replicaSet=rs0`;

console.log(`A iniciar servidor na porta ${port}...`);
await Database.connect(mongoUri);


/////
const app = express(); //"app" vira um objeto que reune a configuracao da aplicacao
app.use(express.json()); //cria um middleware que reconhece requisições com corpo JSON e interpreta esse conteúdo, deixando os dados disponíveis em req.body
app.use("/api/auth", routerAuth); //acoplhamento ao servidor principal. Rota final: POST /api/auth/login

app.listen(port, () => { //o servidor comeca a escutar as requisicoes aqui
  console.log(`Servidor iniciado na porta ${port}.`);
});

/////