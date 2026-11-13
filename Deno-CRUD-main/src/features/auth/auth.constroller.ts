import { Request, Response } from "express";
import "responser";
import { AuthService } from "./auth.services.ts";

export class AuthController {
  constructor(
    private authService: AuthService = new AuthService()
  ) {}

  public login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body || {};

    const resultado = await this.authService.login(email, password);

    res.status(200).json({
      code: 200,
      message: "Login realizado com sucesso.",
      data: resultado,
    });
  };
}