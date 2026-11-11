import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import throwlhos from "throwlhos";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization; //pega o cabeçalho da requisicao e busca o atributo Authorization

  if (!authHeader) {
    throw throwlhos.err_unauthorized("Token de acesso não fornecido.", {
      path: req.originalUrl,
    });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throw throwlhos.err_unauthorized("Formato do token inválido. Utilize 'Bearer <token>'.", {
      header: authHeader,
    });
  }

  const token = parts[1];
  const secret = Deno.env.get("JWT_SECRET") || "secret_key_padrao";

  try {
    const decoded = jwt.verify(token, secret);
    (req as Request & { user?: unknown }).user = decoded;
    next();
  } catch (error) {
    throw throwlhos.err_unauthorized("Token inválido ou expirado.", {
      error: error instanceof Error ? error.message : error,
    });
  }
};