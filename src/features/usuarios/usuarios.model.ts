import mongoose, { Schema } from "mongoose";
import { IUsuario } from "./usuarios.interface.ts";

export class UsuarioClass implements IUsuario {
  nome!: IUsuario["nome"];
  email!: IUsuario["email"];
  senha!: IUsuario["senha"];
  role?: IUsuario["role"];
}

const UsuarioSchema = new Schema<IUsuario>(
  {
    nome: {
      type: String,
      required: [true, "O nome é obrigatório!"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "O e-mail é obrigatório!"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    senha: {
      type: String,
      required: [true, "A senha é obrigatória!"],
    },
    role: {
      type: String,
      default: "admin",
    },
  },
  { timestamps: true }
);

UsuarioSchema.loadClass(UsuarioClass);

export const UsuarioModel = mongoose.model<IUsuario>("Usuario", UsuarioSchema);