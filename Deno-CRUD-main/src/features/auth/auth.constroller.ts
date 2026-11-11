import { Request, Response } from "express";
import responser from "responser";
import { AuthService } from "./auth.services.ts";

export class AuthController {
  constructor(
    private authService: AuthService = new AuthService()
  ) {}

  public login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body || {};

    const resultado = await this.authService.login(email, password);

    responser.send_ok(res, { //biblioteca utilitária para Node.js/Express usada para padronizar e simplificar o envio de respostas HTTP de sucesso. O cliente recebe um json formatado com o codigo de status 200 OK
      message: "Login realizado com sucesso.",
      data: resultado,
    });
  };
}