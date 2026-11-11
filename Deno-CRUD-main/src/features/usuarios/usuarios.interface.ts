import { Types } from "mongoose";

export interface IUsuario {
  _id?: Types.ObjectId;
  nome: string;
  email: string;
  senha: string;
  role?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}