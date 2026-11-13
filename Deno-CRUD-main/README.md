# API GERENCIAMENTO DE PRODUTOS

## *Sistema de Cadastro e Controle de Produtos*

Essa é uma API minimalista construída com a biblioteca Express rodando no ambiente Deno, projetada para gerenciar um catálogo de produtos, incluindo autenticação de usuários, validação de dados e registro de log de movimentação de estoque.

- Express web framework
- TypeScript como linguagem principal
- Deno runtime
- Autenticação JWT e middlewares de segurança
- Mongoose ODM
- MongoDB (replica set, necessário para transações)
- bcrypt para criptografia de senhas
- throwlhos e responser para padronização de erros e respostas
- request-check para validação de dados
- `@std/assert` para testes unitários

## Funcionalidades

- CRUD completo para Produtos e LogMovimentacao(criar, listar, buscar por ID, atualizar e deletar)
- Cadastro de produto com regra de negócio: validação dos dados, verificação de SKU único e criação atômica do produto junto com o log de movimentação
- Transação no MongoDB com `commit` em caso de sucesso e `rollback` automático se qualquer etapa falhar
- Registro de log de movimentação de estoque (tipos `ENTRADA`, `SAIDA` e `CADASTRO`)
- Autenticação baseada em identidade do usuário (JWT, com expiração de 8 horas)
- Rotas protegidas exigindo autenticação para operações sensíveis (criar, atualizar e deletar)
- Tratamento padronizado de erros (400, 401, 404, 409, 500)
- Testes unitários para controllers e services
- Collection do Postman com token JWT reutilizável

## Endpoints

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| POST | `/api/auth/login` | Autentica o usuário e gera um JWT | Não |
| GET | `/api/produtos` | Lista todos os produtos | Não |
| GET | `/api/produtos/:id` | Busca um produto por ID | Não |
| POST | `/api/produtos` | Cria um produto com log atômico | Bearer token |
| PUT | `/api/produtos/:id` | Atualiza um produto por ID | Bearer token |
| DELETE | `/api/produtos/:id` | Remove um produto por ID | Bearer token |

As rotas protegidas exigem o header `Authorization: Bearer <token>`.

### Exemplos

**Login**

```json
POST /api/auth/login
{
  "email": "usuario@exemplo.com",
  "password": "sua-senha"
}
```

Resposta:

```json
{
  "code": 200,
  "message": "Login realizado com sucesso.",
  "data": {
    "token": "<jwt>",
    "usuario": { "id": "...", "email": "usuario@exemplo.com", "role": "admin" }
  }
}
```

**Criar produto**

```json
POST /api/produtos
{
  "nome": "Monitor 27",
  "preco": 1200,
  "sku": "MON-027",
  "estoque": 5,
  "categoria": "Monitores",
  "descricao": "Monitor 27 polegadas"
}
```

Campos obrigatórios: `nome`, `preco`, `sku` e `categoria`. O `estoque` é opcional (padrão `0`), e `preco` e `estoque` não podem ser negativos. O SKU é salvo em maiúsculas.

## Como executar

### Pré-requisitos

- Deno
- MongoDB rodando como **replica set** (`rs0`), pois a criação de produtos usa transação

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto (use o `.env.example` como base):

```env
DB_HOST=localhost
DB_NAME=produtos_db
PORT=3000
JWT_SECRET=uma_chave_longa_e_aleatoria
```

### Iniciar o servidor

```
deno task dev
```

O servidor sobe em `http://localhost:3000`.

### Criar um usuário

A API não possui rota de cadastro de usuários, então o primeiro usuário é inserido direto no MongoDB, com a senha já criptografada em bcrypt. (deno eval "import bcrypt from 'npm:bcrypt'; console.log(await bcrypt.hash('123456', 10));")

db.usuarios.insertOne({
  nome: "Lucas",
  email: "lucas@agx.com",
  senha: "$2b$10$CXm8VupGYLsmMeonyGSd6Oc2jSxFoiAdOSbEdWg7UTJuHyN1NKfRK",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})

1. Gere o hash da senha:

```
deno eval "import bcrypt from 'npm:bcryptjs'; console.log(await bcrypt.hash('sua-senha', 10))"
```

2. Insira o usuário no `mongosh`:

db.usuarios.insertOne({
  nome: "Seu Nome",
  email: "usuario@exemplo.com",
  senha: "<hash gerado>",
  role: "admin"
})


O e-mail deve ser salvo em minúsculas.

## Baixar dependencias
deno install

# Para iniciar o servidor
deno run dev

## Testes
deno task test


Os testes cobrem os controllers (listar, buscar por ID e erros 404 e 500) e os services (validação, SKU duplicado, commit e rollback da transação, login e geração do token JWT).

## Postman

A collection `AGX-Produtos.postman_collection.json` está pronta para importar:

1. Importe o arquivo no Postman.
2. Na aba **Variables** da collection, preencha `email` e `password`.
3. Execute **Auth → Login** uma vez. O token é salvo na variável `token` e reutilizado automaticamente por todas as requisições.

Se o token expirar, a collection faz o login sozinha antes de enviar a próxima requisição.

