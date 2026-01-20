# PlanoReal

Planejador de aula realista (MVP) para professores da rede pública: formulário simples -> IA (OpenRouter) -> plano em JSON + PDF.

## Documentação

- **Relatório do Projeto**: consulte o arquivo [RELATORIO_PROJETO.md](./RELATORIO_PROJETO.md), localizado na raiz do repositório, para detalhes sobre o contexto, decisões técnicas e escopo do projeto.

## Rodando localmente

> **Observação**: É necessário ter o Node.js e npm instalados em sua máquina antes de seguir os passos abaixo. Se ainda não tiver instalado, acesse [nodejs.org](https://nodejs.org/) para fazer o download.

### 1. Instalar dependências

```bash
npm run install:all
```

### 2. Configurar o backend

```bash
cd backend
cp env.example .env
```

Edite `backend/.env` e preencha:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here (**obrigatória**)
OPENROUTER_MODEL=xiaomi/mimo-v2-flash:free (opcional, padrão: `xiaomi/mimo-v2-flash:free`)
PORT=3001 (opcional, padrão: `3001`)
```

Para obter uma API key gratuita: [https://openrouter.ai](https://openrouter.ai)

### 3. Configurar o frontend

```bash
cd frontend
cp env.example .env
```

Edite `frontend/.env` e preencha:

```env
VITE_API_URL=http://localhost:3001 (opcional, padrão: `http://localhost:3001`)
```

### 4. Executar

```bash
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- Health check: `http://localhost:3001/health`

## Stack

- **Frontend**: React (Vite), JavaScript, CSS
- **Backend**: Node.js, JavaScript, Express
- **IA**: OpenRouter (`OPENROUTER_MODEL`)
- **PDF**: jsPDF

## Limites do MVP

Não há login, banco de dados ou qualquer tipo de persistência. Também não existe uma interface gráfica para configuração da chave da API nem do modelo de IA.
