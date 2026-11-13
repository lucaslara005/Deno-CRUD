import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { throwlhos } from "../config/throwlhos.ts"

export interface CustomRequest extends Request { //payload do token
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;   //Authorization: Bearer <token>

  if (!authHeader) {
    throw throwlhos.err_unauthorized("Token de acesso não fornecido.");
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throw throwlhos.err_unauthorized("Formato do token inválido. Utilize 'Bearer <token>'.");
  }

  const token = parts[1];
  const secret = Deno.env.get("JWT_SECRET") || "secret_key_padrao";

  try {
    const decoded = jwt.verify(token, secret) as CustomRequest["user"];
    (req as CustomRequest).user = decoded; // req como uma interface que possui o campo user para armazenar os dados do token em req.user
    next();
  } catch {
      throw throwlhos.err_unauthorized("Codigo inválido ou expirado.");
    return;
  }
};