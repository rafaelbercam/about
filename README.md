# Portfólio - Rafael Bercam

Portfólio profissional e blog construído com [Docusaurus](https://docusaurus.io/).

Veja o site em: https://rafaelbercam.github.io/about/

## Setup Local

### Pré-requisitos

- Node.js 16+
- npm ou yarn

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm start
```

Inicia servidor de desenvolvimento em http://localhost:3000 com hot-reload.

### Build

```bash
npm run build
```

Gera conteúdo estático em `build/` pronto para produção.

### Deploy

O deployment é automático via GitHub Actions ao fazer push em `main`. O workflow construirá o site e publicará em GitHub Pages.

**Primeira vez**: Configure em `Settings → Pages` do seu repositório:
- Source: **GitHub Actions**

## Estrutura do Projeto

```
about/
├── blog/              # Posts do blog (Markdown)
├── docs/              # Documentação técnica dos projetos
├── src/
│   ├── components/    # Componentes React reutilizáveis
│   ├── data/          # Dados estruturados (ex: projetos)
│   ├── pages/         # Páginas customizadas (Home, Sobre, Projetos)
│   └── css/           # Estilos globais
├── static/            # Arquivos estáticos (logo, imagens, favicon)
├── docusaurus.config.js
├── sidebars.js
└── package.json
```

## Personalizando

### Adicionar um projeto

1. Edite `src/data/projects.ts` e adicione um novo objeto ao array `projects`
2. (Opcional) Crie um arquivo de documentação em `docs/seu-projeto.md`

### Editar informações pessoais

- **Home/Tagline**: `docusaurus.config.js` → `title`, `tagline`
- **Página Sobre**: `src/pages/sobre.tsx`
- **Links sociais**: `docusaurus.config.js` → `themeConfig.footer.links`

### Adicionar um post

1. Crie um arquivo em `blog/YYYY-MM-DD-titulo.md`
2. Adicione metadados no frontmatter:

```markdown
---
slug: titulo-do-post
title: Título do Post
authors: [rafael]
tags: [tag1, tag2]
---

Conteúdo do post em Markdown...
```

### Personalizar tema

Edite `src/css/custom.css` para customizar cores e estilos Docusaurus.

## Troubleshooting

- **Port 3000 já em uso**: `npm start -- --port 3001`
- **Limpando build cache**: `rm -rf build/ .docusaurus/` e `npm run build`
- **Problemas de compilação**: Verifique se todos os imports estão corretos
