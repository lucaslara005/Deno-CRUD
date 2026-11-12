import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import throwlhos from "throwlhos";
import { UsuarioRepository } from "../usuarios/usuarios.repository.ts";

export class AuthService {
  constructor(
    private usuarioRepo: UsuarioRepository = new UsuarioRepository()
  ) {}

  public async login(email?: string, password?: string) {
    if (!email || !password) {
      throw throwlhos.default.err_badRequest("E-mail e senha são obrigatórios.");
    }

    const usuario = await this.usuarioRepo.findByEmail(email);
    if (!usuario) {
      throw throwlhos.default.err_badRequest("E-mail ou senha inválidos.");
    }

    const senhaValida = await bcrypt.compare(password, usuario.senha);  //bcrypt.compare nao descriptogrrafa e sim transforma a senha informada no login no mesmo padrao da criptgrafia da senha gravda no banco de dados
    if (!senhaValida) {
      throw throwlhos.default.err_badRequest("E-mail ou senha inválidos.");
    }

    const secret = Deno.env.get("JWT_SECRET") || "secret_key_padrao"; //chave usada para assinar o token
    const token = jwt.sign( // jwt.sign({payload}, {secret}, {options})  --> cria a string criptografica do token
      {
        id: usuario._id,
        email: usuario.email,
        role: usuario.role
      },
      secret,
      { expiresIn: "8h" }
    );

    return {
      token,
      usuario: {
        id: usuario._id,
        email: usuario.email,
        role: usuario.role
      },
    };
  }
}