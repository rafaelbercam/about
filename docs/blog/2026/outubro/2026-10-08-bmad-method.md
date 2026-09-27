---
slug: bmad-method
title: "BMAD-METHOD: Desenvolvimento Dirigido por Especificação (Hands-On)"
description: "Metodologia prática para construir agentes com specs estruturadas - exemplo real com Diet Planner"
tags: [bmad, agentes, metodologia, desenvolvimento, hands-on]
authors: [rafael]
---

# BMAD-METHOD: Desenvolvimento Dirigido por Especificação (Hands-On)

Chega de agentes que "funcionam às vezes". BMAD-METHOD é uma abordagem **spec-first** que você pode aplicar hoje em seus projetos. Neste artigo, vamos construir juntos um **Diet Planner** - agente que gera planos de dieta personalizados com opções de cardápio.

<!--truncate-->

## O que é BMAD (Behavior-Marked Agent Development)?

BMAD é uma metodologia que coloca **especificação clara** no centro do desenvolvimento:

1. **Spec-First**: Especificação completa antes de código
2. **Behavior-Marked**: Comportamentos bem definidos e testáveis
3. **Agent-as-Code**: Lógica explícita, sem magic
4. **Story-Driven**: Testes baseados em casos de uso reais
5. **Control Preservation**: Você controla tudo

---

## Projeto Real: Diet Planner Agent

Vamos construir um agente que:
- Recebe preferências do usuário (restrições, objetivos, metas calóricas)
- Gera plano de dieta personalizado
- Oferece múltiplas opções de cardápio
- Retorna resultado estruturado

### Passo 1: Especificação Completa

Antes de qualquer código, escrevemos a spec completa:

```markdown
# Diet Planner Agent - Especificação

## Objetivo
Gerar um plano de dieta personalizado com 7 dias de cardápio
baseado nas preferências, restrições e objetivos nutricionais do usuário.

## Inputs
- age: number (18-80)
- weight_kg: number
- height_cm: number
- activity_level: "sedentário" | "leve" | "moderado" | "intenso" | "muito_intenso"
- dietary_restrictions: string[] (e.g., ["vegetariano", "sem_gluten"])
- fitness_goals: string[] (e.g., ["perda_peso", "ganho_muscular", "saúde"])
- daily_calorie_target: number (opcional, calculado se não fornecido)

## Behavior - Story Files

### Story 1: Usuário Comum com Objetivo de Perda de Peso
Input:
- age: 32
- weight_kg: 85
- height_cm: 180
- activity_level: "moderado"
- dietary_restrictions: []
- fitness_goals: ["perda_peso"]

Expected Output:
```json
{
  "daily_calorie_target": 2200,
  "meal_plan": {
    "day": 1,
    "meals": [
      {
        "type": "café da manhã",
        "options": [
          {
            "name": "Ovos scrambled com toast integral",
            "calories": 350,
            "protein_g": 25,
            "carbs_g": 30,
            "fat_g": 12
          },
          {
            "name": "Iogurte grego com granola e banana",
            "calories": 340,
            "protein_g": 20,
            "carbs_g": 45,
            "fat_g": 8
          }
        ]
      },
      {
        "type": "almoço",
        "options": [
          {
            "name": "Frango grelhado, arroz integral, brócolis",
            "calories": 520,
            "protein_g": 45,
            "carbs_g": 55,
            "fat_g": 10
          }
        ]
      },
      {
        "type": "lanche",
        "options": [
          {
            "name": "Maçã com manteiga de amendoim",
            "calories": 200,
            "protein_g": 8,
            "carbs_g": 25,
            "fat_g": 8
          }
        ]
      },
      {
        "type": "jantar",
        "options": [
          {
            "name": "Salmão grelhado, batata doce, espinafre",
            "calories": 420,
            "protein_g": 40,
            "carbs_g": 40,
            "fat_g": 14
          }
        ]
      }
    ],
    "total_calories": 1490,
    "macro_targets": {
      "protein_g": 113,
      "carbs_g": 150,
      "fat_g": 42
    }
  },
  "week_variety": {
    "description": "7 dias diferentes com rotação de alimentos",
    "highlights": ["Diferentes proteínas", "Opções vegetarianas", "Refeições rápidas"]
  }
}
```

### Story 2: Vegetariano com Ganho de Músculo
Input:
- dietary_restrictions: ["vegetariano"]
- fitness_goals: ["ganho_muscular"]

Expected Behavior:
- Proteína aumentada para 2.0g/kg
- Foco em fontes vegetais: legumes, tofu, tempeh, nozes
- Cardápio deve oferecer MÚLTIPLAS opções por refeição

---

## Passo 2: Estrutura de Código (Agent-as-Code)

### 2a. Setup do Projeto

```bash
# Clonar ou criar novo projeto
git clone https://github.com/rafaelbercam/dietPlan
cd dietPlan

# Instalar dependências
npm install

# Ou usar template do seu próprio projeto
```

### 2b. Implementação do Agent

```typescript
// src/agents/dietPlannerAgent.ts

interface DietSpecification {
  age: number;
  weight_kg: number;
  height_cm: number;
  activity_level: "sedentário" | "leve" | "moderado" | "intenso" | "muito_intenso";
  dietary_restrictions: string[];
  fitness_goals: string[];
  daily_calorie_target?: number;
}

interface MealOption {
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

interface DietPlan {
  daily_calorie_target: number;
  meal_plan: Array<{
    day: number;
    meals: Array<{
      type: "café da manhã" | "almoço" | "lanche" | "jantar";
      options: MealOption[];
    }>;
    total_calories: number;
  }>;
  week_variety: {
    description: string;
    highlights: string[];
  };
}

export class DietPlannerAgent {
  private spec: DietSpecification;

  constructor(spec: DietSpecification) {
    this.validateSpec(spec);
    this.spec = spec;
  }

  private validateSpec(spec: DietSpecification): void {
    if (spec.age < 18 || spec.age > 80) {
      throw new Error("Idade deve estar entre 18 e 80 anos");
    }
    if (spec.weight_kg <= 0 || spec.height_cm <= 0) {
      throw new Error("Peso e altura devem ser positivos");
    }
  }

  private calculateCalorieTarget(): number {
    // Fórmula de Harris-Benedict ajustada
    let bmr: number;
    const age = this.spec.age;
    const weight = this.spec.weight_kg;
    const height = this.spec.height_cm;

    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);

    const activityMultipliers: Record<string, number> = {
      sedentário: 1.2,
      leve: 1.375,
      moderado: 1.55,
      intenso: 1.725,
      muito_intenso: 1.9
    };

    const tdee = bmr * (activityMultipliers[this.spec.activity_level] || 1.55);

    // Ajuste por objetivo
    let target = tdee;
    if (this.spec.fitness_goals.includes("perda_peso")) {
      target *= 0.85; // 15% deficit
    } else if (this.spec.fitness_goals.includes("ganho_muscular")) {
      target *= 1.1; // 10% superávit
    }

    return Math.round(target);
  }

  async generatePlan(): Promise<DietPlan> {
    const calorieTarget = this.spec.daily_calorie_target || this.calculateCalorieTarget();

    // TODO: Integrar com Claude para gerar opções de refeições
    // usando a spec como contexto

    // Por enquanto, retornar estrutura esperada
    return {
      daily_calorie_target: calorieTarget,
      meal_plan: [], // Preenchido por Claude
      week_variety: {
        description: "Plano variadoajustado à sua especificação",
        highlights: []
      }
    };
  }
}
```

---

## Passo 3: Integração com Claude (Usando BMAD)

### 3a. Prompt Estruturado

```typescript
// src/prompts/dietPlannerPrompt.ts

export const DIET_SPEC_PROMPT = (spec: DietSpecification, calorieTarget: number) => `
Você é um nutricionista especializado em planos de dieta personalizados.

## Especificação do Usuário
- Idade: ${spec.age} anos
- Peso: ${spec.weight_kg}kg
- Altura: ${spec.height_cm}cm
- Nível de atividade: ${spec.activity_level}
- Restrições dietéticas: ${spec.dietary_restrictions.length > 0 ? spec.dietary_restrictions.join(", ") : "Nenhuma"}
- Objetivos: ${spec.fitness_goals.join(", ")}
- Alvo calórico diário: ${calorieTarget} kcal

## Tarefa
Gere um plano de dieta de 7 dias com:
1. Múltiplas opções de cardápio para cada refeição
2. Informações nutricionais detalhadas (calorias, proteína, carbs, gordura)
3. Variedade de alimentos ao longo da semana
4. Respeitar TODAS as restrições dietéticas

## Formato de Saída
Retorne válido JSON seguindo este schema:
{
  "daily_calorie_target": ${calorieTarget},
  "meal_plan": [
    {
      "day": 1,
      "meals": [
        {
          "type": "café da manhã",
          "options": [
            {
              "name": "...",
              "calories": ...,
              "protein_g": ...,
              "carbs_g": ...,
              "fat_g": ...
            }
          ]
        }
      ],
      "total_calories": ...
    }
  ],
  "week_variety": {
    "description": "...",
    "highlights": ["..."]
  }
}

## Constraints
- Total de calorias ± 5% do alvo
- Proteína mínima: ${Math.max(80, spec.weight_kg * 1.6)}g/dia
- NUNCA incluir itens das restrições dietéticas
- Cardápio deve ser realista e preparável em casa
`;
```

### 3b. Usar o Agent com Claude

```typescript
// src/services/dietPlanService.ts

import Anthropic from "@anthropic-ai/sdk";
import { DietPlannerAgent } from "../agents/dietPlannerAgent";
import { DIET_SPEC_PROMPT } from "../prompts/dietPlannerPrompt";

export async function generateDietPlan(spec: DietSpecification): Promise<DietPlan> {
  const agent = new DietPlannerAgent(spec);
  const calorieTarget = spec.daily_calorie_target || agent.calculateCalories();

  const client = new Anthropic();

  const message = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: DIET_SPEC_PROMPT(spec, calorieTarget)
      }
    ]
  });

  // Extrair JSON da resposta
  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Resposta inesperada do Claude");
  }

  // Parse JSON (com tratamento de erros)
  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Não foi possível extrair JSON da resposta");
  }

  return JSON.parse(jsonMatch[0]) as DietPlan;
}
```

---

## Passo 4: Testar com Story Files

### 4a. Testes Baseados em Specs

```typescript
// tests/dietPlanner.test.ts

import { generateDietPlan } from "../src/services/dietPlanService";

describe("DietPlannerAgent - Story Tests", () => {
  test("Story 1: Perda de Peso - Usuário Comum", async () => {
    const spec = {
      age: 32,
      weight_kg: 85,
      height_cm: 180,
      activity_level: "moderado" as const,
      dietary_restrictions: [],
      fitness_goals: ["perda_peso"]
    };

    const plan = await generateDietPlan(spec);

    // Validações segundo a spec
    expect(plan.daily_calorie_target).toBeCloseTo(2200, -1); // ±100
    expect(plan.meal_plan).toHaveLength(7); // 7 dias
    
    plan.meal_plan.forEach((day) => {
      // Total de calorias ±5%
      expect(day.total_calories).toBeCloseTo(2200, 0);
      
      // Cada refeição tem múltiplas opções
      day.meals.forEach((meal) => {
        expect(meal.options.length).toBeGreaterThan(1);
      });
    });
  });

  test("Story 2: Vegetariano - Ganho de Massa", async () => {
    const spec = {
      age: 28,
      weight_kg: 75,
      height_cm: 175,
      activity_level: "intenso" as const,
      dietary_restrictions: ["vegetariano"],
      fitness_goals: ["ganho_muscular"]
    };

    const plan = await generateDietPlan(spec);

    // Proteína aumentada para ganho muscular
    plan.meal_plan.forEach((day) => {
      const totalProtein = day.meals.reduce((sum, meal) => {
        return sum + meal.options[0].protein_g; // Pega primeira opção
      }, 0);
      expect(totalProtein).toBeGreaterThanOrEqual(75 * 1.8); // 1.8g/kg mínimo
    });

    // Nenhuma refeição com carne
    plan.meal_plan.forEach((day) => {
      day.meals.forEach((meal) => {
        meal.options.forEach((option) => {
          const forbiddenFoods = ["frango", "carne", "peixe", "ovos"];
          forbiddenFoods.forEach((food) => {
            expect(option.name.toLowerCase()).not.toContain(food);
          });
        });
      });
    });
  });
});
```

### 4b. Executar Testes

```bash
npm test -- dietPlanner.test.ts
```

---

## Passo 5: Deploy (GitHub Pages)

### 5a. Estrutura do Repo

```
dietPlan/
├── src/
│   ├── agents/
│   │   └── dietPlannerAgent.ts
│   ├── services/
│   │   └── dietPlanService.ts
│   ├── prompts/
│   │   └── dietPlannerPrompt.ts
│   └── pages/
│       └── index.tsx (React component)
├── tests/
│   └── dietPlanner.test.ts
├── package.json
├── .env.example
└── README.md
```

### 5b. GitHub Actions (Deploy)

```yaml
# .github/workflows/deploy.yml

name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      - run: npm test
      - run: npm run build
      
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## Seu Turno: Construa o Diet Planner

### Checklist para Implementar

- [ ] **Passo 1**: Clone/crie repo e escreva a especificação completa
- [ ] **Passo 2**: Implemente DietPlannerAgent com validação
- [ ] **Passo 3**: Crie prompts estruturados para Claude
- [ ] **Passo 4**: Escreva testes baseados nas stories
- [ ] **Passo 5**: Configure GitHub Actions para deploy
- [ ] **Passo 6**: Teste com histórias reais (seu caso + 2 stories)
- [ ] **Passo 7**: Deploy no GitHub Pages
- [ ] **Passo 8**: Mande o link do repo!

### Resources Necessários

```bash
# Dependências
npm install @anthropic-ai/sdk
npm install -D jest @types/jest

# Variáveis de Ambiente
ANTHROPIC_API_KEY=your_key_here
```

---

## Por Que BMAD Funciona?

1. **Spec-First elimina ambiguidade** — Você sabe exatamente o que o agente deve fazer
2. **Story Files = Testes automáticos** — Valida comportamento, não apenas output
3. **Agent-as-Code é transparente** — Sem "magic", você controla tudo
4. **Iteração clara** — Falhas na spec? Atualize e re-teste

---

## Referências & Próximos Passos

**Depois de implementar:**
- Adicionar cache de refeições (Redis)
- Expandir para suporte a alergias específicas
- Integrar com APIs de informação nutricional (USDA FoodData Central)
- Adicionar feedback loop (usuário avalia plano → agente melhora)

**Seus Resultados:**
Quando terminar, compartilhe o link do seu repo! Vamos usar como case study real de BMAD em produção.

---

**Commit: Pratique BMAD com Diet Planner** 🍽️ Especificação clara → Código confiável
