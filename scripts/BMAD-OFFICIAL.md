# BMAD Method Oficial - Guia de Uso

Guia para usar a **ferramenta oficial** do BMAD Method de https://www.bmadcode.com/method

## Instalação Rápida

### 1. Instalar BMAD Method Globalmente

```bash
# Instalação via npx
npx bmad-method install

# Ou instalar localmente
npm install -g bmad-method
```

### 2. Criar Novo Projeto BMAD

```bash
# Criar projeto novo
npx bmad-method create my-diet-planner

# Ou inicializar em projeto existente
cd my-project
npx bmad-method init
```

## Workflow Oficial BMAD

### Passo 1: Criar Especificação

```bash
# Criar nova spec interativa
npx bmad-method spec:create

# Ou criar com template
npx bmad-method spec:create --template agent
```

**Prompts Interativos:**
1. Nome do projeto
2. Descrição
3. Inputs (definir dados de entrada)
4. Outputs (definir formato de saída)
5. Behavior/Stories (definir casos de uso)
6. Constraints (validações)

### Passo 2: Validar Especificação

```bash
# Validar spec criada
npx bmad-method spec:validate

# Ver spec em formato markdown
npx bmad-method spec:view
```

### Passo 3: Gerar Código Scaffold

```bash
# Gerar estrutura de código baseada em spec
npx bmad-method generate:agent

# Ou gerar tipos TypeScript
npx bmad-method generate:types

# Gerar testes baseados em stories
npx bmad-method generate:tests
```

### Passo 4: Implementar Agent

```bash
# Structure gerada:
src/
├── agent.ts          # Implementação do agent
├── types.ts          # Types gerados
├── spec.bmad.json   # Spec estruturada
└── tests/
    └── agent.test.ts # Testes das stories
```

### Passo 5: Testar

```bash
# Rodar testes baseados em stories
npx bmad-method test

# Ou com seu framework
npm test
```

### Passo 6: Validar Contra Spec

```bash
# Verificar se implementação segue spec
npx bmad-method validate:implementation

# Executar story files
npx bmad-method stories:run
```

---

## Exemplo Prático: Diet Planner

### 1. Setup Inicial

```bash
# Criar projeto
npx bmad-method create diet-planner
cd diet-planner

# Instalar dependências
npm install @anthropic-ai/sdk
```

### 2. Criar Spec Interativamente

```bash
npx bmad-method spec:create
```

**Respostas Sugeridas:**

```
? Project name: Diet Planner
? Description: Agente que gera planos de dieta personalizados com múltiplas opções de cardápio

? Define inputs:
- age: number (18-80)
- weight_kg: number
- height_cm: number
- activity_level: string ("sedentário"|"leve"|"moderado"|"intenso"|"muito_intenso")
- dietary_restrictions: string[] (e.g., ["vegetariano", "sem_gluten"])
- fitness_goals: string[] (e.g., ["perda_peso", "ganho_muscular"])

? Define outputs:
{
  "daily_calorie_target": number,
  "meal_plan": Array<{
    "day": number,
    "meals": Array<{
      "type": string,
      "options": Array<{
        "name": string,
        "calories": number,
        "protein_g": number,
        "carbs_g": number,
        "fat_g": number
      }>
    }>
  }>,
  "week_variety": {
    "description": string,
    "highlights": string[]
  }
}

? Add behavior/story (story1):
Name: Perda de Peso
Input: age=32, weight_kg=85, fitness_goals=["perda_peso"]
Expected: daily_calorie_target ~2200, plan com 7 dias diferentes

? Add another behavior/story (story2):
Name: Vegetariano Ganho de Massa
Input: dietary_restrictions=["vegetariano"], fitness_goals=["ganho_muscular"]
Expected: proteína mínima 1.8g/kg, sem carne/ovos/laticínios
```

### 3. Revisar Spec Gerada

```bash
npx bmad-method spec:view
```

Outputs arquivo `bmad-spec.json` ou `bmad-spec.md`

### 4. Gerar Código

```bash
# Gerar types TypeScript
npx bmad-method generate:types

# Gerar agent scaffold
npx bmad-method generate:agent

# Gerar testes das stories
npx bmad-method generate:tests
```

### 5. Implementar

```typescript
// src/agent.ts (gerado + customizado)

import Anthropic from "@anthropic-ai/sdk";
import { DietSpecification, DietPlan } from "./types";

export class DietPlannerAgent {
  private client = new Anthropic();

  async generatePlan(spec: DietSpecification): Promise<DietPlan> {
    // Implementação usando Claude
    const message = await this.client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      messages: [{
        role: "user",
        content: this.buildPrompt(spec)
      }]
    });

    return this.parseResponse(message);
  }

  private buildPrompt(spec: DietSpecification): string {
    return `
    Crie um plano de dieta baseado nesta especificação BMAD:
    ${JSON.stringify(spec, null, 2)}
    
    Retorne válido JSON seguindo o schema definido.
    `;
  }

  private parseResponse(message: any): DietPlan {
    // Parse and validate response
    return JSON.parse(message.content[0].text);
  }
}
```

### 6. Rodar Testes

```bash
# Testes gerados baseados nas stories
npx bmad-method test

# Ou seu próprio
npm test
```

### 7. Validar Implementação

```bash
# Validar que implementação segue spec
npx bmad-method validate:implementation
```

---

## Comparação: Scripts Custom vs Official BMAD

| Feature | Scripts Custom | Official BMAD |
|---------|----------------|---------------|
| Setup | `./scripts/bmad-setup.sh` | `npx bmad-method create` |
| Spec | `./scripts/generate-bmad-spec.sh` | `npx bmad-method spec:create` |
| Interativo | ❌ | ✅ Prompts |
| Generate Code | Manual | ✅ Automático |
| Validate Spec | Manual | ✅ `spec:validate` |
| Generate Tests | Manual | ✅ `generate:tests` |
| Validate Impl | Manual | ✅ `validate:implementation` |
| Story Runner | Manual | ✅ `stories:run` |

---

## Recomendação

**Use Official BMAD se:**
- ✅ Quer ferramenta com suporte oficial
- ✅ Precisa gerar código automaticamente
- ✅ Quer validação nativa de specs
- ✅ Prefere workflow interativo

**Use Scripts Custom se:**
- ✅ Quer integrar com Claude CLI (sem API keys)
- ✅ Precisa workflow específico
- ✅ Quer máximo controle

---

## Resources

- **Official:** https://www.bmadcode.com/method
- **NPM Package:** https://www.npmjs.com/package/bmad-method
- **GitHub:** https://github.com/bmadcode/bmad-method
- **Docs:** https://docs.bmadcode.com

---

## Próximos Passos

1. **Instalar:** `npx bmad-method install`
2. **Criar projeto:** `npx bmad-method create diet-planner`
3. **Criar spec:** `npx bmad-method spec:create`
4. **Gerar código:** `npx bmad-method generate:agent`
5. **Implementar:** Usar Claude CLI + geração oficial
6. **Testar:** `npx bmad-method test`
7. **Deploy:** GitHub Pages com `npm run build`

**Vamos coletar seus resultados reais!** 🚀
