# Protótipo - Sistema de Gestão e Oferta de Fretes

## Requisitos

- Node.js 18+
- npm 9+

## Como criar/abrir o projeto localmente

### 1) Obter o código

Se você já tem a pasta, apenas abra o terminal nela.

Se não tem ainda, clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
```

### 2) Entrar na pasta do projeto

```bash
cd projetocodex
```

> Neste ambiente, o caminho da pasta é: `/workspace/projetocodex`.

### 3) Instalar dependências

```bash
npm install
```

### 4) Rodar em desenvolvimento

```bash
npm run dev
```

### 5) Abrir no navegador

Acesse o endereço exibido no terminal (normalmente):

```text
http://localhost:5173
```

E abra a rota de login:

```text
http://localhost:5173/login
```

## Fluxo rápido de uso

1. Acesse `/login`.
2. Entre com um perfil mockado (`adm`, `pcp`, `gplog`, `transportadora`, `compras`).
3. Ajuste a **Hora simulada** no header para validar regras de 11:00, 12:00 e 15:30.

## Escopo implementado

- React + TypeScript + Vite
- Rotas obrigatórias do PRD
- Mock em memória + persistência opcional em localStorage
- Regras por perfil e por hora simulada
