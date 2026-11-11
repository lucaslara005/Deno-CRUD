import "dotenv/config";
import { Database } from "./config/database.ts";

const dbHost = Deno.env.get("DB_HOST") || "localhost";
const dbName = Deno.env.get("DB_NAME") || "produtos_db";
const port = Deno.env.get("PORT") || "27017";


const mongoUri = `mongodb://${dbHost}:27017/${dbName}?replicaSet=rs0`;

console.log(`A iniciar servidor na porta ${port}...`);
await Database.connect(mongoUri);