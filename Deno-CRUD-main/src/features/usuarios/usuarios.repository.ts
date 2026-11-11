import mongoose, { QueryOptions } from "mongoose";
import { BaseRepository } from "../produtos/produtos.repository.ts";
import { IUsuario } from "./usuarios.interface.ts";
import { UsuarioModel } from "./usuarios.model.ts";

export class UsuarioRepository extends BaseRepository<IUsuario> {
  constructor(model: mongoose.Model<IUsuario> = UsuarioModel) {
    super(model);
  }

  public findByEmail(email: string, options?: QueryOptions) {
    return this.model.findOne({ email: email.toLowerCase() }, null, options);
  }
}