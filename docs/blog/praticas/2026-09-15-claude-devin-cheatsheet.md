---
slug: claude-devin-cheatsheet
title: "Claude & Devin: Cheat Sheet de Comandos e Técnicas"
description: "Maximize produtividade com comandos, prompts e técnicas avançadas"
tags: [claude, devin, produtividade, comandos, prompts, ia]
authors: [rafael]
date: 2026-10-30
---

# Claude & Devin: Cheat Sheet de Comandos e Técnicas

*Escrito por Rafael Berçam Medeiros em 15 de Setembro de 2026*

Trabalhar com Claude e Devin é mais eficiente quando você conhece os comandos certos e as técnicas de prompt que amplificam o output de qualidade. Este artigo é um guia prático e direto ao ponto.

<!--truncate-->

## Claude Code: Slash Commands

### Essenciais

| Comando | Uso | Exemplo |
|---------|-----|---------|
| `/help` | Ver ajuda e comandos disponíveis | `/help` |
| `/clear` | Limpar histórico da conversa | `/clear` (reinicia contexto) |
| `/code-review` | Revisar código com agentes | `/code-review ultra` (multi-agent) |
| `/plan` | Ativar modo planning para arquitetura | `/plan Refatorar auth system` |
| `/fast` | Ativar modo fast (Opus com saída rápida) | `/fast` (toggle) |

### Menos Conhecidos mas Poderosos

| Comando | Uso |
|---------|-----|
| `! <bash>` | Executar shell commands no terminal | `! git status` |
| `/memory` | Salvar fatos persistentes sobre você | `/memory Usuário prefere respostas concisas` |
| `/ultrareview` | Deprecated alias para `/code-review ultra` | Usar `/code-review ultra` em vez disso |

---

## Técnicas de Prompt: Structure & Clarity

### 1. One-Shot vs Few-Shot

**Ruim:**
```
Me ajuda a escrever um componente React
```

**Bom:**
```
Crie um componente React Form com:
- Props: fields[], onSubmit, initialValues
- Validation com Zod
- Estilo com CSS modules
- Sem emojis, profissional

Exemplo similar que você pode referenciar:
[seu exemplo]
```

### 2. Role Definition (Persona)

```
Você é um code reviewer sênior com 15+ anos.
Seu foco é: performance, segurança, maintainability.
Critérios: SOLID principles, sem premature optimization.

Revise este código...
```

**Impacto:** Respostas mais contextualizadas e alinhadas.

### 3. Specify Output Format

**Vago:**
```
Me dá um plano para este projeto
```

**Preciso:**
```
Crie um plano em Markdown com:
- [ ] Tasks com checkboxes
- Dependências claras (Task B depende de Task A)
- Estimativa de esforço (small/medium/large)
- Riscos identificados

Formato:
## Phase 1: Setup
- [ ] Task X (depends on: none) | effort: small
  Risk: ...
```

### 4. Context Layering (Progressive Disclosure)

```
## Contexto
[Background breve]

## Problema Específico
[O que exatamente você quer resolver]

## Constraints
- Tecnologia X obrigatória
- Performance: < 100ms
- Budget: pequeno

## Success Criteria
[Como você sabe que foi bem]

[Seu código/pergunta]
```

---

## Otimizando para Qualidade: Red Flags to Avoid

### ❌ Erros Comuns

**Problema:** "Arrume isso"
```
// Meu código tá lento
function processData(data) { ... }
```
**Solução:** Forneça contexto
```
// Processa 1M registros em 30s, target: 5s
// Gargalo é aqui:
function processData(data) { ... }  // <- isso está slow
```

**Problema:** Pedir tudo de uma vez
```
Crie um sistema de auth completo
```
**Solução:** Decomponha
```
Fase 1: JWT validation middleware
- Input: req.headers.authorization
- Output: req.user = { id, role }
- Rejeita tokens inválidos/expirados

[Code snippet para refine]
```

**Problema:** Ambiguidade
```
Faz um componente de lista
```
**Solução:** Seja preciso
```
Componente <TaskList>:
- Props: tasks[] (id, title, completed, priority)
- Eventos: onToggle(id), onDelete(id)
- Features: filter por priority, sort por data
- Acessibilidade: ARIA labels
```

---

## Devin: Commands & Workflow

### Setup Rápido

```bash
# Verificar versão
devin --version

# Iniciar sesão interativa
devin start

# Executar comando direto
devin run "npm test"
```

### Prompts Eficazes para Devin

**Para Code Generation:**
```
Devin, implemente o módulo de autenticação:
- Stack: Node.js + Passport.js
- DB: PostgreSQL
- Features: Login, Signup, Refresh Token
- Tests: 80%+ coverage (Jest)

Reference: /path/to/existing/auth (anterior)
```

**Para Debugging:**
```
Devin, o teste falha com:
ERROR: "Cannot find module 'xyz'"

Context:
- Repo: /path
- Last working commit: abc123
- Changed files: [list]

Faz: diagnóstico + fix
```

**Para Refactoring:**
```
Devin, refatore este arquivo para:
1. Extrair 3 funções reutilizáveis
2. Remover duplicate logic
3. Manter compatibilidade backward (testes passam)

Antes e Depois lado-a-lado
```

---

## Maximizing Context Window

### Context is Precious

**Situação:** Contexto limitado, muito código

**Estratégia 1: Tree-Shake (Show Only Relevant)**
```
# Em vez de:
[Enviar projeto inteiro]

# Faça:
Analise este arquivo específico:
[arquivo relevante]

Referência de dependências:
- ServiceA (importa-o aqui, implementação irrelevante)
- Types do projeto: [tipos importantes]
```

**Estratégia 2: Folding (Resumir Padrões)**
```
Meu projeto segue este padrão de controller:

[1 exemplo completo]

Todos os outros controllers seguem a mesma estrutura.
Preciso adicionar novo endpoint em UserController...
```

**Estratégia 3: Batching (Agrupe Tasks Relacionadas)**
```
Em uma conversa:
1. Crie o schema
2. Implemente o service
3. Gere os testes

[Não: conversa separada para cada um]
```

---

## Memory & Persistence

### Using `/memory` Effectively

```markdown
# Sua memória persistente

## Preferences
- Sem emojis, profissional
- Respostas concisas com detalhe sob demanda
- Código TypeScript over JavaScript

## Context
- Projeto: about (Docusaurus portfolio)
- Stack: React 18, TypeScript, Node.js
- Deploy: GitHub Pages via Actions

## Patterns You Follow
- Components com CSS modules, não styled-components
- No custom hooks abstrações prematuras
- SOLID, Clean Code, Design Patterns
```

**Impacto:** Claude mantém contexto entre conversas, adapta tom/estilo.

---

## Advanced Techniques

### 1. Decompose Complex Tasks

**Ruim:** Um prompt gigante
**Bom:** Sequência de prompts focados

```
Chat 1: "Desenhe a arquitetura geral"
Chat 2: "Implemente o módulo A (com contexto do Chat 1)"
Chat 3: "Crie testes para A"
```

### 2. Iterative Refinement

```
1º Prompt: "Gere esboço"
   → Review: "Muito genérico, preciso X e Y"

2º Prompt: "Refine focando em X, Y. Aqui o que falta..."
   → Review: "Bom, mas falta Z"

3º Prompt: "Finalize com Z..."
```

**vs. tudo de uma vez:** Iteração converge melhor.

### 3. Prompt Chaining com Agents

```
Agent Pesquisador:
  → Busca papers sobre RAG
  → Retorna resumo estruturado

Agent Redator:
  → Recebe resumo
  → Escreve artigo técnico
  → Revisão final
```

---

## Code Review Workflow

### Usando `/code-review ultra`

```bash
# Pré-requisito: repositório git
git checkout -b feature/novo

# Fazer mudanças
git add .
git commit -m "feature: ..."

# Revisar
/code-review ultra

# Ou específico a uma PR:
/code-review ultra #123
```

**O que verifica:**
- Security vulnerabilities
- Performance issues
- Test coverage
- Code style consistency
- Architectural concerns

---

## Skills & Custom Workflows

### Descobrir Skills Disponíveis

```bash
/help  # Lista skills disponíveis
```

### Exemplo: Code Quality Skill

```
/code-review    # Análise rápida
/code-review ultra   # Análise profunda multi-agent
```

### Criar Seu Próprio Workflow

**Padrão:** Chat → Plan → Implement → Review → Refine

```
1. /plan "Redesenhar componente Form"
   ↓
2. Discutir arquitetura
   ↓
3. Implementar em Chat
   ↓
4. /code-review resultado
   ↓
5. Refine based on feedback
```

---

## Performance Tips

### Conversa Mais Rápida

| Técnica | Ganho |
|---------|-------|
| Ser preciso no 1º prompt | 60-70% menos iterações |
| Fornecer exemplos | 40% melhor qualidade |
| Usar `/fast` mode | 2-3x mais rápido (trade: Opus in fast mode) |
| Decompose tasks | 30% menos contexto waste |

### Exemplo Real

```
# Sem otimização: 5 turnos, 15 min
"Me cria um componente de login"
→ "Mais detalhes?"
→ "Com validação"
→ "Qual framework?"
→ "React"
→ "Aqui então"

# Com otimização: 1 turno, 2 min
"Crie <LoginForm> com:
- Props: onSubmit, initialEmail, loading
- Validation: Email + min 8 chars senha
- UI: inputs + error messages
- Tests: Jest snapshot + validation cases
- TypeScript strict"
```

---

## Command Palette Shortcuts (IDE Extensions)

### VS Code + Claude Code Extension

| Shortcut | Ação |
|----------|------|
| `Ctrl+Shift+P` → "Claude" | Abrir Claude Code |
| Seleção + "Ask Claude" | Prompt sobre seleção |
| `/plan` no editor | Ativar planning mode |
| Inline edits | Aplicar mudanças direto no arquivo |

---

## Troubleshooting

### "Resposta incompleta ou confusa"

**Checklist:**
- [ ] Seus prompts são ambíguos?
- [ ] Faltou contexto? (lincar arquivo, repo)
- [ ] Pediu tudo de uma vez?
- [ ] Exemplo não reflete seu caso real?

**Fix:** Repita com contexto + exemplo específico.

### "Gera muita boilerplate"

**Solução:**
```
Gere apenas o essencial, não boilerplate:
- Sem comentários óbvios
- Sem imports não usados
- Sem helper functions genéricas (eu adiciono depois)
```

### "Não entende meu projeto"

**Solução:**
```
1. Salve projeto context em /memory
2. Linkle arquivos relevantes no prompt
3. Mostre exemplo existente similar
4. Explique padrão que você segue
```

---

## Best Practices Summary

✅ **DO:**
- Ser específico e estruturado
- Fornecer contexto + exemplos
- Decompose tasks complexas
- Revisar + iterar
- Usar `/plan` para arquitetura
- Manter `/memory` atualizada

❌ **DON'T:**
- Pedir tudo de uma vez
- Ser vago ("arruma isso")
- Ignorar output e pedir igual novamente
- Usar emojis se não combina com estilo
- Replicar código sem entender

---

## Referências & Recursos

**Claude Docs:**
- Claude API: https://anthropic.com/docs
- Prompt Engineering Guide: https://claude.ai/docs/prompts
- Token Limits: https://claude.ai/docs/models/token-limits

**Claude Code:**
- CLI: https://github.com/anthropics/claude-code
- IDE Extensions: https://github.com/anthropics/claude-code

**Best Practices:**
- OpenAI Prompt Engineering: https://platform.openai.com/docs/guides/prompt-engineering
- Anthropic's Constitutional AI: https://www.anthropic.com/research/constitutional-ai

**Community:**
- Anthropic Discord: https://discord.gg/anthropic
- Papers: https://arxiv.org (busque "LLM prompting")

---

**Última atualização:** 2026-10-30 • Técnicas práticas de produção
