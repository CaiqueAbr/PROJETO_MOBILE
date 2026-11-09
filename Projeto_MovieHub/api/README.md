# MovieHub API

API REST em Node.js/Express com SQLite. O arquivo do banco é criado automaticamente em `api/data/moviehub.sqlite` na primeira inicialização.

## Iniciar

Requer Node.js 22.13 ou superior para executar o app Expo e a API neste projeto. O backend isolado requer Node.js 20 ou superior.

```bash
cd api
npm install
```

Copie `.env.example` para `.env` e configure `JWT_SECRET` com uma chave aleatória longa. Depois:

```bash
npm run dev
```

A API fica em `http://127.0.0.1:3333`; a verificação está em `GET /api/health`.

Para acessar a partir do celular, configure no app o endereço IPv4 da máquina na mesma rede Wi-Fi. No emulador Android, use `http://10.0.2.2:3333`; em simuladores iOS, `http://localhost:3333` costuma apontar para a máquina host. `HOST=0.0.0.0` permite conexões pela rede local.

## Rotas

| Método | Rota | Acesso | Uso |
| --- | --- | --- | --- |
| GET | `/api/health` | público | Estado da API |
| POST | `/api/auth/register` | público | Criar conta (`name`, `email`, `password`) |
| POST | `/api/auth/login` | público | Entrar (`email`, `password`) |
| GET | `/api/movies` | público | Listar filmes; filtros `search`, `genre`, `year`, `sort`, `page`, `limit` |
| GET | `/api/movies/:id` | público | Detalhe e avaliações |
| POST | `/api/movies` | autenticado | Cadastrar filme |
| PATCH | `/api/movies/:id` | autor autenticado | Editar filme |
| DELETE | `/api/movies/:id` | autor autenticado | Excluir filme |
| POST | `/api/movies/:movieId/reviews` | autenticado | Avaliar (`rating` de 1 a 5, `comment`) |
| PATCH | `/api/reviews/:id` | autor autenticado | Editar avaliação |
| DELETE | `/api/reviews/:id` | autor autenticado | Excluir avaliação |
| GET | `/api/me/reviews` | autenticado | Listar minhas avaliações |
| GET | `/api/favorites` | autenticado | Listar favoritos |
| PUT | `/api/favorites/:movieId` | autenticado | Adicionar favorito |
| DELETE | `/api/favorites/:movieId` | autenticado | Remover favorito |

Envie o token recebido no login/cadastro no cabeçalho `Authorization: Bearer <token>`. Cadastro de filme exige login; somente quem cadastrou pode editar ou excluir esse registro. Cada usuário pode deixar uma avaliação por filme.

Exemplo de filme:

```json
{
  "title": "A Viagem de Chihiro",
  "synopsis": "Uma menina atravessa um mundo mágico.",
  "releaseYear": 2001,
  "genre": "Fantasia",
  "director": "Hayao Miyazaki",
  "posterUrl": "https://exemplo.com/poster.jpg"
}
```

Respostas de erro usam `{ "error": "mensagem" }`. Listagens devolvem `{ "items": [], "pagination": { "page", "limit", "total", "pages" } }`.

## Banco de dados

As tabelas `users`, `movies`, `reviews` e `favorites` são criadas automaticamente no início. Chaves estrangeiras mantêm os relacionamentos; avaliações e favoritos são removidos em cascata quando um usuário ou filme é removido. Senhas são armazenadas com hash bcrypt.

`npm run db:reset` apaga o banco local e seus dados. Use somente para reiniciar o ambiente de desenvolvimento.
