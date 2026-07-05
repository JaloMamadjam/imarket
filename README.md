# iMarket — Sistema de Gerenciamento de Estoque, Vendas e Doações

Projeto final da disciplina **Banco de Dados I (DEC7129 — 2026.1)** — UFSC Campus Araranguá.
Professor: Alexandre Leopoldo Gonçalves.

Integrantes: **Mamadjam Jalo** e **Mikail Freire Weng Sá**

## Sobre o projeto

O iMarket é um sistema de gerenciamento voltado para mercados de pequeno e médio porte, cobrindo todo o ciclo de vida de um produto: cadastro, fornecedores, estoque em múltiplos armazéns, vendas e pagamentos, além do destino de produtos não vendidos — doação para instituições parceiras ou registro de desperdício.

O projeto contempla:
- Modelagem conceitual e lógica com 15 tabelas (10 entidades + 5 relacionamentos N:N)
- API REST completa (Node.js + TypeScript + Express) com CRUD para todas as entidades
- Banco de dados PostgreSQL, com script de criação (DDL) e carga de dados inicial
- CLI interativa para demonstrar todas as operações sem depender de interface gráfica
- Relatórios com consultas SQL (mínimo 3 tabelas cada) e gráficos gerados em Python/Matplotlib
- Funcionalidade de IA Generativa (Google Gemini) para recomendação de doações e análise de estoque

## Tecnologias

- **Backend:** Node.js, TypeScript, Express
- **Banco de dados:** PostgreSQL
- **CLI:** Inquirer (menus interativos no terminal)
- **Gráficos:** Python 3 + Matplotlib
- **IA Generativa:** Google Gemini (`@google/genai`)

## Estrutura do projeto

```
backend/
├── cli/                    # Interface de linha de comando (menus)
│   ├── cadastros/           # CRUD de cada entidade via CLI
│   ├── operacoes/           # Operações e painel de indicadores
│   ├── relatorios/          # Execução das consultas + geração de gráficos
│   ├── ia/                  # Menu de IA Generativa
│   ├── python/grafico.py    # Script Python que gera os gráficos (PNG)
│   └── menu.ts              # Menu principal
├── src/
│   ├── controllers/         # Lógica das rotas da API
│   ├── routes/               # Definição das rotas Express
│   ├── database/
│   │   ├── ddl.sql            # Script de criação das tabelas
│   │   ├── inserts.sql        # Carga inicial de dados
│   │   ├── consultas.sql      # Consultas SQL do relatório (item 6)
│   │   └── db.ts              # Conexão com o PostgreSQL
│   ├── services/             # Integração com IA (Gemini) e dashboard
│   └── server.ts             # Ponto de entrada da API
├── .env.example              # Modelo de variáveis de ambiente
└── package.json
```

## Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- Python 3 com `matplotlib` instalado (`pip install matplotlib`)
- Uma chave de API do [Google Gemini](https://aistudio.google.com/apikey) (opcional, apenas para a funcionalidade de IA)

## Como rodar o projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/SEU_USUARIO/imarket.git
cd imarket/backend
```

### 2. Instalar as dependências
```bash
npm install
pip install matplotlib
```

### 3. Configurar as variáveis de ambiente
Copie o modelo e preencha com os seus dados:
```bash
cp .env.example .env
```
Edite o `.env` com as credenciais do seu PostgreSQL e (opcionalmente) sua chave do Gemini:
```
PORT=3000

DB_USER=postgres
DB_HOST=localhost
DB_NAME=mercado_BD
DB_PASSWORD=sua_senha
DB_PORT=5432

GEMINI_API_KEY=sua_chave_gemini
```

### 4. Criar o banco de dados
No PostgreSQL, crie um banco vazio com o nome definido em `DB_NAME`:
```sql
CREATE DATABASE "mercado_BD";
```

### 5. Subir a API
```bash
npm run dev
```
A API sobe em `http://localhost:3000`.

### 6. Popular o banco (criação das tabelas + dados iniciais)
Com a API rodando, chame o endpoint de setup:
```bash
curl -X POST http://localhost:3000/api/setup/init
```
Isso executa o `ddl.sql` (criação das tabelas) e o `inserts.sql` (carga de dados de exemplo). Para apagar tudo e recomeçar do zero:
```bash
curl -X POST http://localhost:3000/api/setup/reset
```

### 7. Usar a aplicação (CLI)
Em outro terminal, com a API já rodando:
```bash
npm run cli
```
O menu permite navegar por cadastros (CRUD de cada tabela), operações, relatórios com gráficos, IA Generativa e o próprio setup do banco (itens "Popular banco" e "Limpar banco" também estão disponíveis por aqui, sem precisar do `curl`).

## Relatórios e consultas (item 6)

As três consultas do relatório também podem ser executadas diretamente:
```bash
psql -U postgres -d mercado_BD -f src/database/consultas.sql
```
Os mesmos resultados são expostos pela API e usados pela CLI para gerar os gráficos:
- `GET /api/relatorios/produtos-mais-vendidos`
- `GET /api/relatorios/doacoes-por-instituicao`
- `GET /api/relatorios/desperdicios-por-motivo`

## Funcionalidade de IA Generativa

- `GET /api/ia/recomendar-doacoes` — sugere quais produtos priorizar em campanhas de doação, com base no estoque e nos lotes próximos do vencimento.
- `GET /api/ia/analisar-estoque` — gera uma análise textual do estado atual do estoque.

Requer uma chave válida em `GEMINI_API_KEY` no `.env`.

## Licença

Projeto acadêmico desenvolvido para fins educacionais na disciplina de Banco de Dados I — UFSC Campus Araranguá.
