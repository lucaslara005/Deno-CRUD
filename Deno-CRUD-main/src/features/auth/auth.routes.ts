import { Router } from "express";
import { AuthController } from "./auth.constroller.ts";

const router = Router(); //instacia de roteador, responsavel por gerenciar um grupo especifico de rotas
const authController = new AuthController();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Autentica usuário e gera um JWT
 *     responses:
 *       200:
 *         description: Token gerado com sucesso
 */
router.post("/login", authController.login);  //Quando uma requisição chegar a esse endpoint, o Express executará exatamente a função do controller.

export default router; //exporta o roteador configurado para que ele possa ser acoplado ao servidor principal
