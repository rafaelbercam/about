---
slug: bmad-method
title: "BMAD-METHOD: Desenvolvimento Dirigido por Especificação (Hands-On)"
description: "Metodologia prática de spec-first com 3 workflows: custom scripts, oficial BMAD, ou Claude CLI. Exemplo real: Diet Planner"
tags: [bmad, agentes, metodologia, desenvolvimento, hands-on, claude]
authors: [rafael]
---

# BMAD-METHOD: Desenvolvimento Dirigido por Especificação (Hands-On)

Chega de agentes que "funcionam às vezes". BMAD-METHOD é uma abordagem **spec-first** que coloca a especificação clara no centro do desenvolvimento. 

Este artigo é **100% prático**: você vai seguir um passo-a-passo real para construir um **Diet Planner** - agente que gera planos de dieta personalizados. Vou mostrar **3 workflows diferentes** para você escolher qual se adapta melhor.

<!--truncate-->

## O que é BMAD?

BMAD = **Behavior-Marked Agent Development**. Princípios:

1. **Spec-First**: Especificação clara antes de qualquer código
2. **Behavior-Marked**: Comportamentos bem definidos e testáveis  
3. **Agent-as-Code**: Lógica explícita, sem "magic"
4. **Story-Driven**: Testes baseados em casos de uso reais
5. **Control Preservation**: Você controla 100% do comportamento

---

## Exemplo Real: Diet Planner

Vamos construir um agente que:
- Recebe dados pessoais + preferências do usuário
- Gera plano de dieta personalizado para 7 dias
- Oferece **múltiplas opções** para cada refeição
- Valida contra restrições (vegetariano, sem lactose, etc.)
- Retorna JSON estruturado pronto para uso

**Base:** Projeto real https://github.com/rafaelbercam/dietPlan (Vue 3 + Vite + GitHub Pages)

---

## Passo 1: Entender a Especificação

Antes de qualquer código, definimos **o que o agente deve fazer**:

### Inputs (O que o agente recebe)

```typescript
{
  age: 32,
  weight_kg: 85,
  height_cm: 180,
  activity_level: "moderado",
  fitness_goals: ["perda_peso"],
  dietary_restrictions: [],
  preferred_foods: ["frango", "arroz integral"],
  disliked_foods: ["ovos"]
}
```

### Expected Output (O que o agente deve retornar)

```json
{
  "daily_calorie_target": 2200,
  "meal_plan": [
    {
      "day": 1,
      "meals": [
        {
          "type": "café da manhã",
          "options": [
            {
              "name": "Toast integral com frango",
              "calories": 350,
              "protein_g": 25,
              "carbs_g": 30,
              "fat_g": 12
            },
            {
              "name": "Aveia com frutas",
              "calories": 340,
              "protein_g": 12,
              "carbs_g": 55,
              "fat_g": 8
            }
          ]
        }
      ],
      "total_calories": 2200
    }
  ]
}
```

### Validações Esperadas

- ✅ Total calórico ±5% do target
- ✅ Proteína mínima baseada em objetivo (1.4g/kg para perda peso, 2.0g/kg para ganho muscular)
- ✅ Nenhum alimento em `disliked_foods`
- ✅ Nenhum alimento banido por `dietary_restrictions`
- ✅ Cada refeição tem **mínimo 2 opções**
- ✅ 7 dias com variedade de alimentos

---

## Passo 2: Escolha seu Workflow

### Workflow A: Official BMAD (Recomendado)

**Melhor para:** Ferramenta oficial com suporte, geração automática de código.

#### Passo A1: Instalar BMAD Method

```bash
npx bmad-method install
```

**Output esperado (real):**
```
Need to install the following packages:
bmad-method@6.12.0
Ok to proceed? (y) y

                    ██████╗ ███╗   ███╗ █████╗ ██████╗ ™
                    ██╔══██╗████╗ ████║██╔══██╗██╔══██╗
                    ██████╔╝██╔████╔██║███████║██║  ██║
                    ██╔══██╗██║╚██╔╝██║██╔══██║██║  ██║
                    ██████╔╝██║ ╚═╝ ██║██║  ██║██████╔╝
                     ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═════╝
                    Agile Ai Driven Development
                   Build More, Architect Dreams · © BMad Code

● Installation directory: /Users/rafaelbercam/Projects/new-diet-planner
```

#### Passo A2: Setup Interativo

O BMAD pede informações durante setup:

**Pergunta 1: Qual é seu nome/equipe?**
```
What should agents call you? (Use your name or a team name)
→ Rafaelbercam
```

**Pergunta 2: Nome do projeto?**
```
What is your project called?
→ new-diet-planner
```

**Pergunta 3: Linguagem para agentes?**
```
What language should agents use when chatting with you?
→ Portuguese
```

**Pergunta 4: Linguagem de documentação?**
```
Preferred document output language?
→ Portuguese
```

**Pergunta 5: Diretório de output?**
```
Where should output files be saved?
→ _bmad-output
```

**Pergunta 6: Integração com tools?**
```
Integrate with:
  Selected tools:
    • Claude Code ⭐
```

#### Estrutura Criada

Após setup, seu projeto fica assim:

```
new-diet-planner/
├── _bmad/                 # Núcleo BMAD instalado
│   ├── bmad-method/       # v6.12.0
│   └── shared-scripts/
├── _bmad-output/          # Outputs dos skills
├── .claude/
│   └── skills/            # 50 skills instaladas
└── .bmad-config.json      # Suas configurações
```

#### ⚠️ Aviso: UV Não Encontrado

O BMAD usa `uv` para rodar scripts Python:

```
⚠ uv not found on PATH. BMAD requires it to run Python scripts
  bmad-build and bmad-build-auto will HALT on activation without it

Easiest path: ask your AI agent to "install and set up uv for me"

Or install manually:
  macOS/Linux:  curl -LsSf https://astral.sh/uv/install.sh | sh
  Homebrew:     brew install uv
  Windows:      powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

**Solução:** Instale `uv` (uma vez) e depois BMAD funciona completo.

#### Passo A3: Criar Spec (Interativa)

```bash
bmad-method spec:create
```

Responda aos prompts:
- **Project name:** `Diet Planner`
- **Description:** `Agente que gera planos de dieta personalizados com múltiplas opções`
- **Inputs:** `age, weight_kg, height_cm, activity_level, dietary_restrictions, fitness_goals`
- **Outputs:** `{ daily_calorie_target, meal_plan[] }`
- **Story 1:** `Perda de Peso - age=32, weight_kg=85, fitness_goals=["perda_peso"]`
- **Story 2:** `Vegetariano - dietary_restrictions=["vegetariano"], fitness_goals=["ganho_muscular"]`

Gera:
- `bmad-spec.json` — Spec estruturada e validada

#### Passo A4: Gerar Código

```bash
# Agent scaffold
bmad-method generate:agent

# TypeScript types  
bmad-method generate:types

# Tests das stories
bmad-method generate:tests
```

**Isso gera automaticamente:**
- `src/agent.ts` — Estrutura do agent
- `src/types.ts` — Types validados
- `tests/agent.test.ts` — Testes das stories
- `src/spec.bmad.json` — Spec estruturada

#### Passo A5: Revisar Spec

```bash
bmad-method spec:view
# ou
cat bmad-spec.json
```

Agora sua spec está validada e documentada! ✅

---

### Workflow B: Claude CLI + Manual (Terminal)

**Melhor para:** Sem API keys, terminal-based workflow, integração com scripts locais.

```bash
# 1. No seu projeto
mkdir diet-planner && cd diet-planner
npm init -y

# 2. Criar spec via Claude CLI (terminal)
claude "Crie uma especificação BMAD estruturada para:
- Projeto: Diet Planner
- Inputs: age, weight_kg, height_cm, activity_level, dietary_restrictions, fitness_goals
- Outputs: { daily_calorie_target, meal_plan[] }
- Story 1: Perda de peso (user age=32, weight=85kg)
- Story 2: Vegetariano (dietary_restrictions=['vegetariano'])
Formato JSON, pronto para implementação" > spec.json

# 3. Revisar spec
cat spec.json

# 4. Gerar types baseado em spec
claude "Baseado nesta spec BMAD, crie tipos TypeScript" < spec.json > src/types.ts

# 5. Gerar agent skeleton
claude "Crie um agent TypeScript skeleton usando estes types" < src/types.ts > src/agent.ts

# 6. Gerar testes das stories
claude "Crie testes Jest baseados nas stories da spec" < spec.json > tests/agent.test.ts
```

---

### Workflow C: Spec-Only (Learn Mode)

**Melhor para:** Entender a metodologia antes de implementar.

Leia a especificação completa no arquivo:
```bash
cat docs/BMAD-dietPlan-example.md
```

Contém:
- Estrutura real do projeto dietPlan
- 2 stories com dados reais
- Tipos TypeScript reais
- Validações esperadas
- Integration points com mealPlanService.ts

---

## Passo 3: Implementar o Agent

Qualquer que seja seu workflow, você terá agora:
- ✅ Spec validada
- ✅ Types gerados
- ✅ Structure do agent
- ✅ Testes das stories

### Implementação Básica (TypeScript + Claude API)

```typescript
import Anthropic from '@anthropic-ai/sdk';
import type { DietPlanRequest, MealPlanPeriod } from './types';

const client = new Anthropic();

async function generateDietPlan(request: DietPlanRequest): Promise<MealPlanPeriod> {
  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: `
        Você é um nutricionista especializado em planos de dieta.
        
        Gere um plano de dieta baseado nesta especificação BMAD:
        ${JSON.stringify(request, null, 2)}
        
        Retorne válido JSON seguindo o schema MealPlanPeriod com:
        - 7 dias de cardápio
        - Múltiplas opções para cada refeição
        - Respeitando TODAS as restrições dietéticas
        - Total calórico dentro de ±5% do target
      `
    }]
  });

  // Parse response
  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response');
  
  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON in response');
  
  return JSON.parse(jsonMatch[0]) as MealPlanPeriod;
}

// Usar
const result = await generateDietPlan({
  age: 32,
  weight_kg: 85,
  height_cm: 180,
  activity_level: 'moderado',
  fitness_goals: ['perda_peso'],
  dietary_restrictions: [],
  preferred_foods: ['frango'],
  disliked_foods: ['ovos']
});

console.log(result);
```

---

## Passo 4: Testar com Stories

### Story 1: Perda de Peso (Sem Restrições)

```typescript
test('Story 1: Perda de Peso', async () => {
  const request = {
    age: 32,
    weight_kg: 85,
    height_cm: 180,
    activity_level: 'moderado' as const,
    fitness_goals: ['perda_peso'],
    dietary_restrictions: [],
    preferred_foods: ['frango', 'arroz integral'],
    disliked_foods: ['ovos']
  };

  const result = await generateDietPlan(request);

  // Validações
  expect(result.meal_plan).toHaveLength(7); // 7 dias
  expect(result.daily_calorie_target).toBeCloseTo(2200, -1); // ±100

  // Cada refeição tem múltiplas opções
  result.meal_plan.forEach(day => {
    day.meals.forEach(meal => {
      expect(meal.options.length).toBeGreaterThanOrEqual(2);
    });
  });

  // Nenhum ovo (disliked)
  const allFoods = result.meal_plan
    .flatMap(d => d.meals)
    .flatMap(m => m.options)
    .map(o => o.name.toLowerCase());
  
  expect(allFoods.every(f => !f.includes('ovo'))).toBe(true);
});
```

### Story 2: Vegetariano com Ganho de Massa

```typescript
test('Story 2: Vegetariano Ganho Muscular', async () => {
  const request = {
    age: 28,
    weight_kg: 65,
    height_cm: 165,
    activity_level: 'intenso' as const,
    fitness_goals: ['ganho_muscular'],
    dietary_restrictions: ['vegetariano'],
    preferred_foods: ['tofu', 'legumes'],
    disliked_foods: []
  };

  const result = await generateDietPlan(request);

  // Proteína mínima: 65kg * 2.0g/kg = 130g
  const totalProtein = result.meal_plan[0].meals
    .flatMap(m => m.options)
    .reduce((sum, o) => sum + o.protein_g, 0);
  
  expect(totalProtein).toBeGreaterThanOrEqual(130);

  // Nenhuma carne/ovos/laticínios
  const forbiddenFoods = ['frango', 'carne', 'peixe', 'ovos', 'leite', 'queijo'];
  const allFoods = result.meal_plan
    .flatMap(d => d.meals)
    .flatMap(m => m.options)
    .map(o => o.name.toLowerCase());
  
  forbiddenFoods.forEach(food => {
    expect(allFoods.every(f => !f.includes(food))).toBe(true);
  });
});
```

### Rodar Testes

```bash
# Official BMAD
npx bmad-method test

# Ou seu framework
npm test
```

---

## Passo 5: Deploy no GitHub Pages

### Setup com Vite (como dietPlan)

```bash
# Install
npm install -D vite typescript

# Build
npm run build

# Deploy via GitHub Actions (veja .github/workflows/)
git push
```

Seu agente estará em: `https://seu-usuario.github.io/diet-planner/`

---

## Passo 6: Mande o Link! 

Quando terminar:
1. ✅ Implementar agent seguindo spec BMAD
2. ✅ Passar em 2+ stories
3. ✅ Deploy no GitHub Pages
4. ✅ **Compartilhar o link do seu repo**

Vamos usar como **case study real de BMAD em produção**! 📊

---

## Resumo: 3 Workflows

| Workflow | Como Começar | Melhor Para |
|----------|-------------|-----------|
| **Official BMAD** | `npx bmad-method create` | Ferramenta com suporte, geração automática |
| **Claude CLI** | `claude "create spec"` | Terminal, sem API keys, máximo controle |
| **Spec-Only** | Ler `BMAD-dietPlan-example.md` | Aprender a metodologia |

---

## Checklist de Implementação

- [ ] **Spec:** Criar ou usar BMAD-dietPlan-example.md
- [ ] **Code:** Implementar agent (TypeScript + Claude)
- [ ] **Tests:** Passar em 2+ stories
- [ ] **Validation:** Testar contra constraints (calorias, proteína, restrições)
- [ ] **Build:** `npm run build`
- [ ] **Deploy:** Push para GitHub Pages
- [ ] **Share:** Compartilhar link do repo

---

## Pro Tips

:::tip Dica 1: Spec-First Sempre
Gastar 20% do tempo na spec evita 80% dos problemas na implementação.
:::

:::tip Dica 2: Stories são Testes
Cada story é um caso de teste automatizado. Use-os!
:::

:::tip Dica 3: Validate Early
Rode validações logo nos testes. Não deixe para produção.
:::

:::warning Armadilha Comum
Não puxa para "generalizar demais". Começa com Diet Planner concreto. Abstração vem depois.
:::

---

## Referências

**Official BMAD:**
- https://www.bmadcode.com/method
- https://www.npmjs.com/package/bmad-method
- https://docs.bmadcode.com

**Projeto Real (Referência):**
- https://github.com/rafaelbercam/dietPlan
- Tipos: `src/types/index.ts`
- Serviço: `src/services/mealPlanService.ts`
- Deploy: `npm run build:docs`

**Claude API:**
- https://anthropic.com/docs
- Max tokens: 200K para Sonnet 5
- Structured output support

---

## Próximos Posts

Baseado em seus resultados reais:
- Case study: Diet Planner em produção
- Extensões: memória, feedback loop, fine-tuning
- Agentes compostos: múltiplos specialized agents
- Evals: como validar qualidade de output

---

**Seu turno agora!** Escolha um workflow, siga o passo-a-passo e compartilhe os resultados. 

Vamos transformar BMAD-METHOD de teoria em prática, com código real rodando. 🚀

**Commit: Pratique BMAD com Diet Planner - 3 workflows hands-on** 🍽️
