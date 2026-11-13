import { assertEquals, assertExists, assertRejects } from "@std/assert";
import bcrypt from "bcrypt";
import { AuthService } from "./auth.services.ts";
import { UsuarioRepository } from "../usuarios/usuarios.repository.ts";

Deno.test("AuthService - Deve rejeitar login se o e-mail não for encontrado", async () => {
  const fakeUsuarioRepo = {
    findByEmail: () => Promise.resolve(null),
  } as unknown as UsuarioRepository;

  const authService = new AuthService(fakeUsuarioRepo);

  await assertRejects(async () => {
    await authService.login("inexistente@agx.com", "123456");
  });
});

Deno.test("AuthService - Deve retornar token JWT quando credenciais forem válidas", async () => {
  const senhaCriptografada = await bcrypt.hash("senhaSegura123", 4);

  const fakeUsuarioRepo = {
    findByEmail: () =>
      Promise.resolve({
        _id: "user_01",
        nome: "Lucas Lara",
        email: "lucas@agx.com",
        senha: senhaCriptografada,
        role: "admin",
      }),
  } as unknown as UsuarioRepository;

  const authService = new AuthService(fakeUsuarioRepo);
  const resultado = await authService.login("lucas@agx.com", "senhaSegura123");

  assertExists(resultado.token);
  assertEquals(resultado.usuario.email, "lucas@agx.com");
});