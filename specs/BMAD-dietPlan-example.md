# Diet Planner Agent - Especificação BMAD Baseada em Projeto Real

Especificação BMAD completa baseada na estrutura real do projeto `rafaelbercam/dietPlan`.

## Objetivo

Criar um agente BMAD que gera planos de dieta personalizados com múltiplas opções de refeições e grupos de alimentos (frutas, carnes, carboidratos, vegetais, bebidas, suplementos, sobremesas, laticínios).

## Inputs

```typescript
interface DietPlanRequest {
  // Dados pessoais
  age: number;
  gender: 'M' | 'F';
  weight_kg: number;
  height_cm: number;
  
  // Estilo de vida
  activity_level: 'sedentário' | 'leve' | 'moderado' | 'intenso' | 'muito_intenso';
  
  // Objetivos
  fitness_goals: ('perda_peso' | 'ganho_muscular' | 'manutenção' | 'saúde')[];
  
  // Restrições
  dietary_restrictions: ('vegetariano' | 'vegano' | 'sem_gluten' | 'sem_lactose' | 'ceto')[];
  food_allergies: string[];
  
  // Preferências
  preferred_foods: string[];
  disliked_foods: string[];
  
  // Nutricionista (consultoria)
  nutritionist?: {
    name: string;
    lastConsultDate: string;
    expirationDays: number;
  };
}
```

## Data Structures (Real do Projeto)

```typescript
// Do projeto real: src/types/index.ts
export type FoodCategory = 
  | 'fruit' | 'meat' | 'carb' | 'vegetable' 
  | 'drink' | 'supplement' | 'dessert' | 'dairy';

export interface FoodOption {
  id: string;
  name: string;
  amount: string;
}

export interface FoodItem {
  id: string;
  name: string;
  amount: string;
  category: FoodCategory;
  replaceable: boolean; // Pode ser substituído?
  multiSelect?: boolean; // Múltiplas seleções?
  selectedOption?: FoodOption;
  selectedOptions?: FoodOption[];
  options?: FoodOption[];
}

export interface Meal {
  id: string;
  time: string; // "07:00", "12:00", etc.
  title: string; // "Café da Manhã", "Almoço", etc.
  foods: FoodItem[];
}

export interface MealPlanPeriod {
  id: string;
  label: string; // "Semana 1", "Setembro 2026", etc.
  startDate: string;
  endDate: string;
  meals: Meal[];
}
```

## Behavior - Story Files

### Story 1: Usuário com Objetivo de Perda de Peso (sem restrições)

**Input:**
```json
{
  "age": 32,
  "gender": "M",
  "weight_kg": 85,
  "height_cm": 180,
  "activity_level": "moderado",
  "fitness_goals": ["perda_peso"],
  "dietary_restrictions": [],
  "food_allergies": [],
  "preferred_foods": ["frango", "arroz integral", "brócolis"],
  "disliked_foods": ["ovos"]
}
```

**Expected Output (MealPlanPeriod):**
```json
{
  "id": "week-1",
  "label": "Semana 1 - Perda de Peso",
  "startDate": "2026-09-27",
  "endDate": "2026-10-03",
  "meals": [
    {
      "id": "monday-breakfast",
      "time": "07:00",
      "title": "Café da Manhã",
      "foods": [
        {
          "id": "toast-integral",
          "name": "Toast integral",
          "amount": "2 fatias",
          "category": "carb",
          "replaceable": true,
          "options": [
            { "id": "toast1", "name": "Toast integral", "amount": "2 fatias" },
            { "id": "aveia1", "name": "Aveia em flocos", "amount": "1/2 xícara" }
          ],
          "selectedOption": { "id": "toast1", "name": "Toast integral", "amount": "2 fatias" }
        },
        {
          "id": "frango-desfiado",
          "name": "Frango desfiado",
          "amount": "100g",
          "category": "meat",
          "replaceable": true,
          "options": [
            { "id": "frango1", "name": "Frango desfiado", "amount": "100g" },
            { "id": "atum1", "name": "Atum enlatado", "amount": "80g" }
          ],
          "selectedOption": { "id": "frango1", "name": "Frango desfiado", "amount": "100g" }
        },
        {
          "id": "frutas-multiplas",
          "name": "Frutas",
          "amount": "Mista",
          "category": "fruit",
          "replaceable": true,
          "multiSelect": true,
          "options": [
            { "id": "banana1", "name": "Banana", "amount": "1 média" },
            { "id": "maca1", "name": "Maçã", "amount": "1 média" },
            { "id": "morango1", "name": "Morango", "amount": "150g" }
          ],
          "selectedOptions": [
            { "id": "banana1", "name": "Banana", "amount": "1 média" }
          ]
        }
      ]
    },
    {
      "id": "monday-lunch",
      "time": "12:00",
      "title": "Almoço",
      "foods": [
        {
          "id": "frango-grelhado",
          "name": "Frango grelhado",
          "amount": "150g",
          "category": "meat",
          "replaceable": true,
          "selectedOption": { "id": "frango2", "name": "Frango grelhado", "amount": "150g" }
        },
        {
          "id": "arroz-integral",
          "name": "Arroz integral",
          "amount": "1 xícara cozida",
          "category": "carb",
          "replaceable": true,
          "selectedOption": { "id": "arroz1", "name": "Arroz integral", "amount": "1 xícara cozida" }
        },
        {
          "id": "brocolis",
          "name": "Brócolis cozido",
          "amount": "200g",
          "category": "vegetable",
          "replaceable": true,
          "selectedOption": { "id": "brocolis1", "name": "Brócolis cozido", "amount": "200g" }
        }
      ]
    }
  ]
}
```

**Validações Esperadas:**
- ✅ Total calórico ~2000 kcal/dia (±5%)
- ✅ Proteína: ~120g (1.4g/kg)
- ✅ Nenhum ovo (disliked_foods)
- ✅ Frango em múltiplas refeições (preferred_foods)
- ✅ Cada refeição tem múltiplas opções (replaceable: true)
- ✅ Frutas com multiSelect (pode escolher mais de uma)

---

### Story 2: Vegetariano com Restrição de Lactose (Ganho de Massa)

**Input:**
```json
{
  "age": 28,
  "gender": "F",
  "weight_kg": 65,
  "height_cm": 165,
  "activity_level": "intenso",
  "fitness_goals": ["ganho_muscular"],
  "dietary_restrictions": ["vegetariano", "sem_lactose"],
  "food_allergies": [],
  "preferred_foods": ["tofu", "legumes", "castanhas"],
  "disliked_foods": []
}
```

**Expected Output:**
```json
{
  "id": "week-1-vegan-muscle",
  "label": "Semana 1 - Ganho Muscular (Vegetariano, Sem Lactose)",
  "startDate": "2026-09-27",
  "endDate": "2026-10-03",
  "meals": [
    {
      "id": "monday-breakfast",
      "time": "07:00",
      "title": "Café da Manhã",
      "foods": [
        {
          "id": "batida-proteica",
          "name": "Batida de proteína vegetal",
          "amount": "1 xícara",
          "category": "drink",
          "replaceable": true,
          "options": [
            { "id": "batida1", "name": "Batida de proteína vegetal", "amount": "1 xícara" },
            { "id": "acai1", "name": "Açaí com leite vegetal", "amount": "250ml" }
          ]
        },
        {
          "id": "granel-cereais",
          "name": "Granola caseira",
          "amount": "50g",
          "category": "carb",
          "replaceable": true
        },
        {
          "id": "castanhas",
          "name": "Castanhas variadas",
          "amount": "30g",
          "category": "supplement",
          "replaceable": true,
          "multiSelect": true,
          "options": [
            { "id": "castanha-do-para", "name": "Castanha do pará", "amount": "20g" },
            { "id": "amendoa", "name": "Amêndoa", "amount": "25g" },
            { "id": "noz", "name": "Noz", "amount": "20g" }
          ]
        }
      ]
    }
  ]
}
```

**Validações Esperadas:**
- ✅ NENHUMA carne, ovos, ou laticínios
- ✅ Proteína mínima: 65 * 2.0 = 130g (ganho muscular)
- ✅ Fontes: tofu, legumes, proteína vegetal, castanhas
- ✅ Cada refeição tem alternativas (replaceable)
- ✅ Estrutura de `options` e `selectedOption` mantida

---

## Implementation Requirements

### 1. Agent deve retornar MealPlanPeriod válido
- Seguir estrutura do projeto real (`src/types/index.ts`)
- Todas as foodItems devem ter ID único
- Respeitar FoodCategory enum

### 2. Validações Obrigatórias
```typescript
// Deve validar:
- Total calórico ±5% do esperado
- Proteína dentro da meta (baseada em goal)
- Nenhum alimento em disliked_foods
- Nenhum alimento banido por restrições
- Cada refeição tem ≥1 opção (replaceable: true)
```

### 3. Integração com mealPlanService.ts
```typescript
// O agente deve gerar output que possa ser usado:
const planPeriod = await claudeAgent.generateMealPlan(request);
const store = useMealPlanStore();
store.addMealPlan(planPeriod);
store.exportToJSON(); // Pronto para GitHub Pages
```

---

## Testing (Story-Driven)

```typescript
// tests/dietPlanAgent.test.ts

describe('DietPlan BMAD Agent', () => {
  test('Story 1: Perda de Peso sem restrições', async () => {
    const result = await agent.generate(story1Input);
    
    // Validações
    expect(result.meals).toHaveLength(4); // 4 refeições
    expect(result.meals.every(m => m.foods.some(f => f.replaceable))).toBe(true);
    
    // Calorias
    const totalCals = calculateCalories(result);
    expect(totalCals).toBeCloseTo(2000, -1);
  });
  
  test('Story 2: Vegetariano Sem Lactose', async () => {
    const result = await agent.generate(story2Input);
    
    // Nenhuma carne/ovos/laticínios
    result.meals.forEach(meal => {
      meal.foods.forEach(food => {
        expect(forbiddenFoods).not.toContain(food.name);
      });
    });
  });
});
```

---

## Próximos Passos para Implementação

1. **Ler estrutura real** do dietPlan (`src/types/`, `src/data/`)
2. **Usar prompt estruturado** que força output no formato MealPlanPeriod
3. **Integrar com mealPlanService.ts** existente
4. **Testar com stories reais** (2+ casos de uso)
5. **Deploy no GitHub Pages** (build:docs no package.json já configurado)

---

**Status:** Spec BMAD baseada em projeto real e pronta para implementação! 🍽️
