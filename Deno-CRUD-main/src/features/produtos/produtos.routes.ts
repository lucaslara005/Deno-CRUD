import { Router } from "express";
import { ProdutoController } from "./produtos.controller.ts";
import { authMiddleware } from "../../middlewares/auth.middleware.ts";

const router = Router();
const controller = new ProdutoController();

/**
 * @openapi
 * /api/produtos:
 *   post:
 *     summary: Cria um novo produto com registo de log atómico
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       409:
 *         description: SKU duplicado
 */
router.post("/", authMiddleware, controller.criar);

/**
 * @openapi
 * /api/produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     responses:
 *       200:
 *         description: Lista de produtos devolvida
 */
router.get("/", controller.listar);

/**
 * @openapi
 * /api/produtos/{id}:
 *   get:
 *     summary: Procura um produto por ID
 *     responses:
 *       200:
 *         description: Produto encontrado
 *       404:
 *         description: Produto não encontrado
 */
router.get("/:id", controller.buscarPorId);

/**
 * @openapi
 * /api/produtos/{id}:
 *   put:
 *     summary: Atualiza um produto por ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Produto atualizado
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Produto não encontrado
 */
router.put("/:id", authMiddleware, controller.atualizar);

/**
 * @openapi
 * /api/produtos/{id}:
 *   delete:
 *     summary: Apaga um produto por ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Produto removido
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Produto não encontrado
 */
router.delete("/:id", authMiddleware, controller.deletar);

export default router;