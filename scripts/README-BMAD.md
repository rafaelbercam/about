# BMAD Scripts - Desenvolvimento Dirigido por Especificação

Scripts para facilitar a implementação de agentes usando **BMAD-METHOD** com Claude CLI.

## Instalação

```bash
chmod +x scripts/generate-bmad-spec.sh scripts/bmad-setup.sh
```

## 1. Setup Rápido de Novo Projeto

### Com Estrutura do dietPlan Real

```bash
# Clone do projeto real como referência
git clone https://github.com/rafaelbercam/dietPlan.git diet-planner-bmad
cd diet-planner-bmad

# Veja a estrutura real
cat src/types/index.ts  # Estrutura de tipos
cat src/services/mealPlanService.ts  # Serviço
cat src/data/meals.ts  # Dados de exemplo
```

### Setup Rápido

```bash
./scripts/bmad-setup.sh "Diet Planner"
```

Isso cria:
- ✅ Diretório do projeto
- ✅ package.json com BMAD libs
- ✅ tsconfig.json
- ✅ jest.config.js
- ✅ Estrutura de pastas (src/, tests/, specs/)

## 2. Gerar Especificação BMAD

### Opção A: Via Script + Claude CLI (Recomendado)

```bash
./scripts/generate-bmad-spec.sh "Diet Planner" "Agente que gera planos de dieta personalizados"
```

Gera arquivo: `spec-diet-planner.md`

### Opção B: Diretamente no Terminal

```bash
# Gerar spec no stdout
claude "Crie uma especificação BMAD para um agente de plano de dieta"

# Salvar em arquivo
claude "Crie uma especificação BMAD para um agente de plano de dieta" > my-spec.md

# Com pipe
cat requirements.txt | claude "Crie BMAD spec baseado neste documento" > spec.md
```

### Opção C: Usar Lib BMAD Diretamente

```bash
cd seu-projeto
npx bmad-agent-init

# Ou com @papuman/bmad-buff
npx bmad-buff init --template agent
```

## 3. Exemplo Prático (Baseado no dietPlan Real)

### Estrutura do Projeto Real

O dietPlan usa:
- **Types:** `src/types/index.ts` (MealPlanPeriod, Meal, FoodItem, etc.)
- **Serviço:** `src/services/mealPlanService.ts` (integração com agente)
- **Store:** `src/stores/mealPlan.store.ts` (Pinia para estado)
- **Dados:** `src/data/` (meals, fruits, meats, carbs, vegetables, desserts)
- **Build:** `build:docs` para GitHub Pages

### Usar Spec Baseada em Projeto Real

```bash
# Spec já preparada baseada na estrutura real
cat specs/BMAD-dietPlan-example.md

# Ou gerar uma nova baseada no seu projeto
../scripts/generate-bmad-spec.sh "Diet Planner" "Baseado em rafaelbercam/dietPlan"
```

### Passo 1: Setup

```bash
./scripts/bmad-setup.sh "meu-agente"
cd meu-agente
```

### Passo 2: Gerar Spec

```bash
../scripts/generate-bmad-spec.sh "Meu Agente" "O que ele faz"
cat spec-meu-agente.md
```

### Passo 3: Implementar (veja exemplo em docs/BMAD-METHOD.md)

```bash
# Criar arquivo do agente
cat > src/index.ts << 'EOF'
// Sua implementação aqui
// Baseada na spec gerada
EOF
```

### Passo 4: Testar

```bash
npm test
npm run build
```

## 4. Integração com Claude CLI Interativa

```bash
# Conversa interativa para refinar spec
claude chat
> Estou criando um agente BMAD de Diet Planner
> Quer me ajudar a estruturar a spec?
> [cola conteúdo da spec]
> Como posso melhorar isso?
```

## 5. Usar BMAD Libs Diretas

### bmad-agent-init (Inicialização)
```bash
npx bmad-agent-init --project-name diet-planner --template agent
```

### @papuman/bmad-buff (Multi-LLM)
```bash
npm install @papuman/bmad-buff

# No seu código
const bmad = require('@papuman/bmad-buff');
const spec = bmad.generateSpec(projectName, description);
```

### bmad-mcp-server (Model Context Protocol)
```bash
npm install bmad-mcp-server

# Usa como MCP server para integração com IDE
```

## 6. Workflow Completo

```bash
# 1. Setup
./scripts/bmad-setup.sh "diet-planner"
cd diet-planner

# 2. Gerar Spec (usando Claude CLI)
../scripts/generate-bmad-spec.sh "Diet Planner" "Gera planos de dieta personalizados"

# 3. Revisar Spec
cat spec-diet-planner.md

# 4. Refinar via Claude interativo
claude chat < spec-diet-planner.md

# 5. Implementar agente
# - Editar src/index.ts com base na spec

# 6. Escrever testes
# - Criar tests/dietPlanner.test.ts baseado nas stories

# 7. Testar
npm test

# 8. Build
npm run build

# 9. Commitar
git add .
git commit -m "feat: BMAD agent para diet planner"
```

## 7. Tips & Tricks

### Gerar Multiple Specs
```bash
for project in "Diet Planner" "Task Manager" "Email Assistant"; do
  ../scripts/generate-bmad-spec.sh "$project" "Agente para $project"
done
```

### Usar Claude CLI em Prompts
```bash
# Gerar arquivo de teste baseado em spec
claude "Crie testes Jest baseados nesta spec BMAD" < spec-diet-planner.md > tests/diet.test.ts

# Gerar implementação stub
claude "Crie estrutura TypeScript baseada nesta spec" < spec-diet-planner.md > src/agent.ts

# Code review de implementação
claude "Revise este agente contra a spec BMAD" < src/agent.ts
```

### Integração com Git Hooks
```bash
# .git/hooks/pre-commit
#!/bin/bash
npm test
npm run build
```

## 8. Resources

- **Libs BMAD**:
  - https://www.npmjs.com/package/bmad-agent-init
  - https://www.npmjs.com/package/@papuman/bmad-buff
  - https://www.npmjs.com/package/bmad-mcp-server

- **Documentação**:
  - [BMAD-METHOD Article](../docs/blog/2026/outubro/2026-10-08-bmad-method.md)
  - https://github.com/papuman/BMAD-BUFF

- **Claude CLI**:
  - `claude --help`
  - `claude chat` (interativo)
  - `claude < arquivo.md` (via pipe)

## 9. Troubleshooting

**Q: Claude CLI não encontrado**
```bash
which claude
# Se não existir:
npm install -g @anthropic-ai/claude
```

**Q: Scripts não têm permissão de execução**
```bash
chmod +x scripts/*.sh
```

**Q: Problemas com npm install de libs BMAD**
```bash
# Usar versão específica
npm install @papuman/bmad-buff@4.1.2
```

---

**Pronto!** Agora você tem um workflow BMAD completo usando Claude CLI sem precisar de secrets! 🚀
