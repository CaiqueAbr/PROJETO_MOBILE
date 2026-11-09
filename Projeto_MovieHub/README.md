# Projeto MovieHub

Aplicativo mobile em React Native/Expo e API REST em Node.js. As telas do app estão conectadas à API e o banco SQLite é criado automaticamente.

## Rodar no navegador (Windows PowerShell)

Use o Node.js 22.13 ou superior. Abra **dois terminais** na pasta extraída deste projeto. No primeiro, inicie a API:

```powershell
cd .\api
Copy-Item .env.example .env
notepad .env
npm install
npm run dev
```

No `.env` da API, configure `JWT_SECRET` com uma chave local longa. Deixe esse terminal rodando. No segundo terminal, inicie o app web:

```powershell
cd .\MovieHub
Copy-Item .env.example .env
npm install
npm run web
```

Abra o endereço mostrado pelo Expo, geralmente `http://localhost:8081`. Verifique a API em `http://127.0.0.1:3333/api/health`. Crie uma conta no app e cadastre um filme: o registro será salvo no SQLite em `api/data/moviehub.sqlite`.

Se você abrir um PowerShell fora da raiz do projeto, primeiro use `cd "CAMINHO\PARA\Projeto_MovieHub"`. O `npm install` precisa ser executado dentro de `api` e dentro de `MovieHub`, cada um em seu terminal ou após mudar de pasta.

Consulte [api/README.md](api/README.md) para a lista de rotas. Para usar em emulador Android, configure o endereço da API como `http://10.0.2.2:3333/api`; em aparelho físico, use o IPv4 do computador na mesma rede Wi-Fi.
