---
slug: bmad-method
title: "BMAD-METHOD: Desenvolvimento Dirigido por Especificação (Hands-On)"
description: "Metodologia prática de spec-first com 3 workflows: custom scripts, oficial BMAD, ou Claude CLI. Exemplo real: Diet Planner"
tags: [bmad, agentes, metodologia, desenvolvimento, hands-on, claude]
authors: [rafael]
---

import Video from '@site/src/components/VideoPlayer';

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

## BMAD Agent Briefing (Para Invocar Skills)

Use esta seção para invocar skills do BMAD. Copie e cole no seu agente BMAD:

```
# Diet Planner Agent - BMAD Briefing
Projeto: new-diet-planner
Linguagem: Portuguese
Data: 2026-10-08

## Objective
Criar agente que gera planos de dieta personalizados usando Claude API.

## Spec BMAD (JSON)
{
  "name": "Diet Planner",
  "inputs": {
    "age": "number (18-80)",
    "weight_kg": "number",
    "height_cm": "number",
    "activity_level": "string: sedentário|leve|moderado|intenso|muito_intenso",
    "fitness_goals": "array: perda_peso|ganho_muscular|manutenção|saúde",
    "dietary_restrictions": "array: vegetariano|vegano|sem_gluten|sem_lactose|ceto",
    "preferred_foods": "array of strings",
    "disliked_foods": "array of strings"
  },
  "outputs": {
    "daily_calorie_target": "number",
    "meal_plan": [
      {
        "day": "number (1-7)",
        "meals": [
          {
            "type": "string: café_manhã|almoço|lanche|jantar",
            "options": [
              {
                "name": "string",
                "calories": "number",
                "protein_g": "number",
                "carbs_g": "number",
                "fat_g": "number"
              }
            ]
          }
        ],
        "total_calories": "number"
      }
    ],
    "week_variety": {
      "description": "string",
      "highlights": "array of strings"
    }
  },
  "constraints": [
    "Total calórico ±5% do target",
    "Proteína mínima: perda_peso=1.4g/kg, ganho_muscular=2.0g/kg",
    "Nenhum alimento em disliked_foods",
    "Respeitar TODAS as dietary_restrictions",
    "Cada refeição: mínimo 2 opções",
    "7 dias com variedade de alimentos"
  ]
}

## Story Files (Testes)

### Story 1: Perda de Peso
Input:
{
  "age": 32,
  "weight_kg": 85,
  "height_cm": 180,
  "activity_level": "moderado",
  "fitness_goals": ["perda_peso"],
  "dietary_restrictions": [],
  "preferred_foods": ["frango", "arroz integral"],
  "disliked_foods": ["ovos"]
}

Expected:
- daily_calorie_target: ~2200 (±100)
- 7 days of meal_plan
- Protein: ~120g (1.4 * 85)
- No eggs anywhere
- Min 2 options per meal
- Total variety across week

### Story 2: Vegetariano Ganho de Massa
Input:
{
  "age": 28,
  "weight_kg": 65,
  "height_cm": 165,
  "activity_level": "intenso",
  "fitness_goals": ["ganho_muscular"],
  "dietary_restrictions": ["vegetariano"],
  "preferred_foods": ["tofu", "legumes"],
  "disliked_foods": []
}

Expected:
- daily_calorie_target: ~2800 (surplus)
- Protein: ≥130g (2.0 * 65)
- NO meat/eggs/dairy
- Min 2 options per meal
- Focus: tofu, legumes, nuts, seeds

## Stack
- Runtime: Node.js 18+
- Language: TypeScript
- LLM: Claude 3.5 Sonnet
- Package Manager: npm
- Testing: Jest
- Output Directory: _bmad-output/

## Implementation Notes
1. Criar types.ts baseado no spec JSON acima
2. Criar agent.ts com Claude API integration
3. Criar tests baseado nas 2 stories
4. Usar `claude` command para gerar/refinar
5. Validate contra constraints antes de return

## Commands to Invoke Skills
- bmad-build: Implementar agent + tests
- bmad-review: Revisar código contra spec
- bmad-validate: Validar spec vs implementation
- bmad-test: Rodar story files
```

### Como Usar Este Briefing

### ⚠️ Importante: Como Invocar Skills do BMAD

As skills do BMAD NÃO são comandos npm. Após `npx bmad-method install`, elas ficam em:
- `.claude/skills/` — Integradas com Claude Code
- Invocáveis via Claude agent ou prompt direto

**Forma 1: Via Agente Claude (Recomendado)**

```bash
# No seu projeto new-diet-planner
cd new-diet-planner

# Lance seu agente Claude
# (seu terminal Claude Code, não npm)
```

Depois converse com o agente:

```
Aqui está o briefing do projeto Diet Planner:

[Cole a seção BMAD Agent Briefing completa]

Usando este briefing, invoque a skill bmad-build para:
1. Criar types.ts baseado no spec JSON
2. Implementar agent.ts com Claude API integration
3. Criar tests das 2 stories
4. Validar contra constraints
5. Salvar output em _bmad-output/
```

**Forma 2: Invocar Skills Diretamente**

Depois de instalar BMAD, as skills estão disponíveis como prompts. Use Claude Code com:

```
/bmad-build

[Cole o briefing]
```

Ou se tiver acesso ao CLI BMAD:

```bash
# Ver skills disponíveis
ls .claude/skills/

# Ou listar via BMAD
bmad --help
```

### ❌ O que NÃO funciona:

```bash
# ❌ ERRADO - bmad-build não é pacote npm
npx bmad-build DIET_PLANNER.briefing

# ❌ ERRADO - não está em PATH
bmad-build DIET_PLANNER.briefing
```

### ✅ O que FUNCIONA:

**Opção A: Conversa com Claude Agent**
```
Hey Claude, implemente este BMAD briefing:
[Cole briefing]
```

**Opção B: Usar skill bmad-build via prompt**
```
/bmad-build

[Cole briefing]
```

**Opção C: Via Claude Code no terminal**
```bash
cd new-diet-planner
# Lance Claude Code aqui
# Use /skills ou /bmad-build
```

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

## Exemplo Real: Execução BMAD (Passos 1-2)

### Passo 1 ✅ Executado

Quando você invoca a skill com o briefing, o BMAD analisa e retorna:

```
Based on Step 1 analysis:

Context Summary:
- Intent: DIET_PLANNER.briefing — a freeform path (not an epic story)
- Goal: Single, cohesive goal: Create a Diet Planner Agent using Claude API
- Planning artifacts: None exist yet
- Git: Not a git repository (check skipped)
- Multi-goal: No issues detected — 2 test stories are implementation test cases, not separate goals

Now I'll create the necessary directories and proceed to Step 2 (planning).
```

### O que Isso Significa

✅ **BMAD entendeu:**
- Seu objetivo é criar um Diet Planner Agent
- 2 stories são casos de teste, não objetivos separados
- Vai criar diretórios necessários
- Próximo: Step 2 (Planning)

---

### Passo 2 ✅ Planning Complete

BMAD analisou a spec e identificou 2 questões de design:

**Decisão 1: Validação de Entrada**
```
❓ How strict should input validation be?
✅ Escolha: Option B - Validar ranges realistas
   - Idade: 18–80 anos
   - Peso: 50–200 kg
   - Height: 100–250 cm
   
Motivo: Production-ready, previne bugs silenciosos
```

**Decisão 2: Tratamento de Erros da API**
```
❓ How should Claude API errors be handled?
✅ Escolha: Option A - Retry automático com exponential backoff
   - 3 tentativas
   - Backoff: 1s → 2s → 4s
   - Robusto para rate limits
   
Motivo: Melhor para produção, handles transient failures
```

Spec pronto em: `_bmad-output/implementation-artifacts/spec-diet-planner-agent.md`

---

### ✅ CHECKPOINT 1 — Spec Ready for Review

BMAD completou Planning e spec está pronto! 

**Spec Location:** `_bmad-output/implementation-artifacts/spec-diet-planner-agent.md`

**Summary:**
- Feature: Diet Planner Agent (Claude 3.5 Sonnet API)
- Scope: 1 cohesive goal (~1,100 tokens)
- Approach: TypeScript with types, agent, utilities, tests
- Design Decisions Locked ✅
  - Validação: ranges realistas (18-80 idade, 50-200kg peso)
  - Erros: retry com backoff (3 tentativas, 1s→2s→4s)
- Deliverables: 7 files (types, agent, utils, tests, config, docs)
- Acceptance: 2 test stories + 3 GWT criteria

**Próximas Escolhas:**

1. ✅ **Approve & Continue** → Comece Step 3 (Implementation) agora nesta sessão
2. ⏸️ **Approve & Stop** → Deixe spec pronto e retome em nova sessão
3. 🔍 **Review Spec** → Faça revisão profunda com subagent antes de implementar

---

## Próximos Passos BMAD (Se Continuar)

Após Step 1, o BMAD vai:

**Step 2: Planning**
- Criar diretórios do projeto
- Estruturar arquitetura
- Gerar plano de implementação

**Step 3: Implementation** 
- Gerar `types.ts` baseado no briefing
- Gerar `agent.ts` com Claude API
- Gerar testes das stories

**Step 4: Validation**
- Rodar testes contra stories
- Validar constraints (calorias, proteína, etc)
- Revisar código

**Step 5: Output**
- Salvar tudo em `_bmad-output/`
- Relatório de sucesso

### Como Acompanhar

Seu agente BMAD vai reportar cada step:
```
Step 1 ✅ Analysis complete
Step 2 ⏳ Planning artifacts...
Step 3 ⏳ Generating code...
Step 4 ⏳ Running validations...
Step 5 ✅ Output ready in _bmad-output/
```

Deixe o BMAD trabalhar! Quando terminar, compartilhe os arquivos gerados.

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

## 🎬 Aplicação Rodando: Demo ao Vivo

Este é o **resultado prático** da metodologia BMAD. A aplicação recebe seus dados pessoais e retorna um plano de dieta personalizado em tempo real.

<Video src="/about/img/blog/dietPlannerMovie.mov" title="Diet Planner Agent - Demonstração ao vivo" />

### O que o Vídeo Mostra:

- 📝 **Entrada:** Formulário com dados do usuário (idade, peso, altura, objetivo, restrições)
- ⚙️ **Processamento:** Claude API gerando plano personalizado
- 📊 **Saída:** Plano de 7 dias com múltiplas opções de refeição
- ✅ **Validações:** Calorias ±5%, proteína, restrições dietéticas respeitadas

Essa é a **aplicação real** do seu BMAD Diet Planner Agent em produção!

### O que o Vídeo Mostra:

✅ **Entrada:** Formulário com seus dados (idade, peso, altura, objetivo, restrições)  
✅ **Processamento:** Claude API gerando plano personalizado  
✅ **Saída:** Plano de 7 dias com múltiplas opções para cada refeição  
✅ **Validações:** Calorias, proteína, e restrições dietéticas respeitadas  

Essa é a **aplicação real** do seu BMAD Diet Planner Agent em produção! 🍽️

---

---

## 🔑 Configurando a Secret API da Anthropic

Para rodar o Diet Planner Agent, você precisa de uma **chave API válida** da Anthropic. Siga os passos:

### Passo 1: Obter sua ANTHROPIC_API_KEY

1. Acesse https://console.anthropic.com/
2. Login com sua conta (ou crie uma)
3. Clique em **"API Keys"** no menu lateral
4. Clique em **"Create Key"**
5. Copie a chave gerada (ela aparece UMA VEZ)
6. **Guarde em local seguro** - não compartilhe!

### Passo 2: Configurar no Projeto

No repositório `new-diet-planner`, crie o arquivo `.env`:

```bash
# Copiar o template
cp .env.example .env

# Editar .env
nano .env  # ou seu editor favorito
```

**Conteúdo do `.env`:**
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
PORT=3000
```

**Importante:**
- ⚠️ NUNCA commite o `.env` (já está em `.gitignore`)
- ⚠️ NUNCA compartilhe sua API key
- ✅ Cada usuário tem sua própria chave

### Passo 3: Testar a Conexão

```bash
# Instalar dependências
npm install

# Rodar exemplo de teste
npx ts-node example.ts
```

Se vir saída com dados nutricionais, a API está conectada! ✅

---

## Rodando o Diet Planner Agent

### Opção A: Como Script (Rápido)

```bash
# Executa os exemplos (exemplo.ts)
npx ts-node example.ts
```

Mostra 3 casos reais:
1. Perda de Peso (32 anos, 85kg)
2. Ganho Muscular Vegetariano (28 anos, 65kg)
3. Múltiplas Restrições (35 anos, 75kg, sem lactose)

### Opção B: Como Servidor Web (Completo)

```bash
# Modo desenvolvimento (reload automático)
npm run dev

# Ou modo produção
npm run start
```

Acesse: **http://localhost:3000**

Endpoint disponível:
```bash
POST /api/generate-plan
Content-Type: application/json

{
  "age": 32,
  "weight_kg": 85,
  "height_cm": 180,
  "sex": "masculino",
  "activity_level": "moderado",
  "fitness_goals": ["perda_peso"],
  "dietary_restrictions": [],
  "preferred_foods": ["frango", "arroz"],
  "disliked_foods": ["ovos"]
}
```

Resposta:
```json
{
  "usuario": { ... },
  "plano_nutricional": { ... },
  "plano_7_dias": [ ... ],
  "resumo": { ... }
}
```

### Opção C: Testes Automatizados

```bash
# Rodar testes (requer ANTHROPIC_API_KEY)
npm test

# Modo watch (reexecuta ao salvar)
npm run test:watch
```

---

## 🎯 Próximos Passos

Repositório completo pronto em: **https://github.com/rafaelbercam/new-diet-planner**

1. Clone e configure `ANTHROPIC_API_KEY` no `.env`
2. Rode `npm install && npx ts-node example.ts`
3. Experimente as 3 opções de execução acima
4. Adapte para seus próprios casos de uso

**Modelo Usado:** Claude Haiku 4.5 (rápido e eficiente)  
**Retry Logic:** 3 tentativas com backoff exponencial (1s → 2s → 4s)

---

## Checklist de Implementação

- [x] **Spec:** BMAD Passo 1-2 completo
- [x] **Code:** Agent implementado (TypeScript + Claude)
- [x] **Testes:** 2+ stories validadas
- [x] **Validação:** Constraints (calorias, proteína, restrições)
- [x] **Build:** `npm run build` funcionando
- [x] **Repo:** GitHub com instruções claras
- [x] **API Key:** Guia de setup seguro

Tudo pronto para usar! 🚀

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
