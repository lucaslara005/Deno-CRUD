import mongoose from "mongoose";


export class Database {

    //metodo static pq ele é chamado diretamente, a classe Database nao precisa ser instanciada por new Database() para o metodo ser usado
    public static async connect(uri: string): Promise<void> {
        
        //tratamento de excessao caso a conexao com o banco de dados falhe.
        try{
            await mongoose.connect(uri);
            console.log("Conexão à base de dados MongoDB estabelecida com sucesso.")
        } catch(error){
            console.error("Erro ao conectar à base de dados MongoDB:", error);
            Deno.exit(1);
        }
    }

    public static async disconnect(): Promise<void> {
        await mongoose.disconnect();
    }
}