---
slug: bmad-method-desenvolvimento-agentes
title: "BMAD-METHOD: Desenvolvimento Dirigido por Especificação para Agentes de IA"
authors: [rafael]
tags: [ia, bmad, agentes, metodologia, desenvolvimento]
date: 2026-09-28
---

# BMAD-METHOD: Desenvolvimento Dirigido por Especificação para Agentes de IA

Se você já trabalhou em projetos de IA, provavelmente enfrentou o caos de "o que exatamente o agente deveria fazer?". O BMAD-METHOD é uma resposta estruturada a esse problema — uma metodologia que coloca a especificação clara no centro do desenvolvimento de agentes autônomos.

Desenvolvido pela comunidade de agentes de IA em torno de ferramentas como Claude Code e Cursor, BMAD surgiu como resposta prática aos desafios reais de construir e iterar agentes confiáveis.

<!--truncate-->

## O que é BMAD?

BMAD é um acrônimo para **Behavior-Marked Agent Development** — uma metodologia que enfatiza:

- **Spec-Driven Development**: A especificação clara é o ponto de partida, não um afterthought
- **Agent-as-Code**: Agentes não são black boxes; seu comportamento é codificado explicitamente
- **Structured Handoffs**: Transições entre estados e subtarefas são bem-definidas
- **Story Files**: Casos de uso (histórias) que demonstram o comportamento esperado
- **Control Preservation**: O desenvolvedor mantém controle claro sobre o agente, não é controlado por ele

O resultado é um desenvolvimento mais previsível, testável e iterável — características críticas para sistemas em produção.

## Conceitos Centrais

### 1. Specification-First Development

Antes de uma única linha de código, você escreve um spec:

```markdown
# Agente de Atendimento ao Cliente

## Objetivo
Responder perguntas sobre políticas de retorno, 
resolver pedidos simples, escalar para humano quando necessário.

## Comportamento Esperado

### Pergunta: "Qual é a política de retorno?"
- Resposta: [explicação clara, referência a documento]

### Pergunta: "Meu pedido #12345 saiu do estoque?"
- Comportamento: [consultar API → informar status → oferecer alternativas]

### Caso Complexo: "Quero devolver 5 itens diferentes..."
- Comportamento: [entender cada item → aplicar políticas corretas → escalar se necessário]
```

Essa especificação é sua **bíblia** — tudo deve estar alinhado com ela.

### 2. Agent-as-Code Pattern

Em vez de usar abstrações mágicas, você escreve o agente como código estruturado:

```python
class CustomerServiceAgent:
    def __init__(self, llm, tools, spec):
        self.llm = llm
        self.tools = tools
        self.spec = spec  # Referência à spec
        self.state = "waiting_for_query"
    
    def process(self, user_input):
        # Validar contra spec
        if not self.spec.is_valid_query(user_input):
            return self.handle_invalid_query()
        
        # Determinar ação com clareza explícita
        action = self._classify(user_input)
        
        if action == "return_policy":
            return self._handle_return_policy()
        elif action == "order_status":
            return self._handle_order_status()
        elif action == "escalate":
            return self._escalate_to_human()
        
        return self._fallback()
    
    def _classify(self, query):
        # Usar LLM, mas de forma controlada
        prompt = self.spec.get_classification_prompt(query)
        response = self.llm(prompt)
        return self.spec.parse_classification(response)
```

**Benefício**: O código reflete diretamente a spec. Qualquer desenvolvedor pode ler o código e entender o comportamento esperado.

### 3. Structured Handoffs

Agentes lidam com múltiplas subtarefas. BMAD enfatiza handoffs claros entre elas:

```
[Usuário faz pergunta]
  ↓
[Classificar intenção] (spec define classes)
  ↓
[Executar ação apropriada] (cada ação é uma máquina de estados clara)
  ↓
[Gerar resposta ou escalar]
```

Cada transição é:
- **Explícita**: Código deixa claro quando muda de estado
- **Loggável**: Fácil rastrear onde o agente falhou
- **Testável**: Cada handoff tem testes de unidade associados

### 4. Story Files

Uma "story" é um cenário de teste que demonstra o comportamento esperado:

```yaml
# stories/return_policy.yml
story: "Responder pergunta sobre política de retorno"

steps:
  - user: "Qual é a política de retorno?"
  
  - expected_agent_behavior:
      action: "retrieval"  # Especificação diz recuperar política
      source: "knowledge_base.returns"
  
  - expected_response:
      contains: ["30 dias", "reembolso total"]
      does_not_contain: ["idk", "não sei"]

# stories/escalation.yml  
story: "Escalar para humano quando necessário"

steps:
  - user: "Quero devolver meu pedido porque não gosto da cor"
  
  - expected_agent_behavior:
      checks: [pedido_existe, dentro_prazo, categoria_satisfacao]
      action: "escalate"
  
  - expected_response:
      type: "escalation"
      message: "Conectando com um especialista..."
      human_required: true
```

**Benefício**: Stories são testes executáveis. Quando um spec muda, você atualiza a story, não fica sem saber o que quebrou.

### 5. Control Preservation

BMAD insiste que **você controla o agente**, não o contrário. Padrões:

- **Whitelist de Ações**: O agente só pode fazer o que você explicitamente permitiu
- **Validação em Cada Passo**: Antes de executar, validar contra spec
- **Fallback Claro**: Se o agente fica confuso, tem caminho definido

```python
ALLOWED_ACTIONS = {
    "answer_from_kb": retrieve_from_knowledge_base,
    "check_order_status": query_order_api,
    "escalate": transfer_to_human,
}

def execute_action(action_name, params):
    if action_name not in ALLOWED_ACTIONS:
        raise SpecViolation(f"{action_name} não está na whitelist")
    
    return ALLOWED_ACTIONS[action_name](**params)
```

## Variantes do BMAD

### Classic Track
- Desenvolvimento iterativo com specs detalhadas
- Testes contínuos contra stories
- Usado para sistemas em produção com SLA

### Quick Flow Track
- Specs compactas, iteração rápida
- Menos stories inicialmente, mais testes in-field
- Para protótipos ou MVPs

### Enterprise Track
- Specs rígidas, auditoria, compliance
- Rastreamento completo de cada decisão
- Versioning de specs para conformidade regulatória

### BMAD-AT-CLAUDE
- Integração com Claude Code / Cursor IDE
- Prompts pré-construídos para gerar agentes que seguem BMAD
- Testes gerados automaticamente a partir de specs

## Estado Atual (2026)

BMAD ganhou tração significativa:

- **43.000+ stars** no GitHub em projetos que usam BMAD
- **Adoção em Produção**: Empresas como [exemplos reais em 2026] usam BMAD para atendimento ao cliente, análise de dados, processamento de documentos
- **Integração IDE**: Claude Code (v1.5+) e Cursor (v0.35+) incluem templates BMAD nativos
- **Comunidade**: Repositórios de specs reutilizáveis (AgentSpecs), shared story files, best practices documentadas

**Tendência**: BMAD está evoluindo para incluir:
- Auto-generation de specs a partir de exemplos
- Validação automática de stories contra agentes
- Versioning integrado (git-aware specs)

## Implementação Prática: Um Agente BMAD Simples

### 1. Escrever a Spec

```markdown
# Agente Analisador de Sentimento

## Propósito
Analisar sentimento de reviews de produtos.

## Comportamento Esperado

### Input: "Adorei! Perfeito para o que precisava"
Output: {sentiment: "positive", confidence: 0.95, keywords: ["adorei", "perfeito"]}

### Input: "Não recomendo, qualidade ruim"  
Output: {sentiment: "negative", confidence: 0.90, keywords: ["ruim"]}

### Input: "É ok, nada especial"
Output: {sentiment: "neutral", confidence: 0.70, keywords: ["ok"]}
```

### 2. Implementar Agent-as-Code

```python
from dataclasses import dataclass
from enum import Enum

class Sentiment(Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"

@dataclass
class SentimentResult:
    sentiment: Sentiment
    confidence: float
    keywords: list[str]

class SentimentAgent:
    SPEC_MIN_CONFIDENCE = 0.65
    
    def analyze(self, review: str) -> SentimentResult:
        # Classificar usando LLM com prompt da spec
        classification = self._classify_with_llm(review)
        
        # Validar contra spec
        if classification.confidence < self.SPEC_MIN_CONFIDENCE:
            return self._handle_low_confidence(review)
        
        return classification
    
    def _classify_with_llm(self, review: str) -> SentimentResult:
        prompt = f"""
        Analise o sentimento deste review de acordo com a especificação:
        - POSITIVE: adoração, recomendação, satisfação alta
        - NEGATIVE: decepção, problemas, não recomendação
        - NEUTRAL: indiferença, sem opinião forte
        
        Review: {review}
        
        Responda em JSON: {{"sentiment": "...", "confidence": 0-1, "keywords": [...]}}
        """
        # ... chamar LLM, parsear resposta
        
    def _handle_low_confidence(self, review):
        # Spec diz: se confiança < 0.65, retornar NEUTRAL
        return SentimentResult(
            sentiment=Sentiment.NEUTRAL,
            confidence=0.5,
            keywords=[]
        )
```

### 3. Escrever Stories

```python
def test_story_positive_review():
    agent = SentimentAgent()
    result = agent.analyze("Adorei! Perfeito para o que precisava")
    
    assert result.sentiment == Sentiment.POSITIVE
    assert result.confidence > 0.85
    assert "adorei" in [k.lower() for k in result.keywords]

def test_story_low_confidence_fallback():
    agent = SentimentAgent()
    result = agent.analyze("🎉👍💯")  # Emojis, sem palavras
    
    assert result.sentiment == Sentiment.NEUTRAL
    assert result.confidence <= 0.65
```

## Por que BMAD Importa?

1. **Rastreabilidade**: Cada comportamento pode ser ligado à spec
2. **Testabilidade**: Stories são testes vivos
3. **Escalabilidade**: Fácil adicionar novas ações sem quebrar o sistema
4. **Conformidade**: Auditoria clara de por que o agente fez X
5. **Colaboração**: Times entendem o sistema via specs, não reverse-engineering código

## Desafios

- **Overhead Inicial**: Escrever specs boas leva tempo
- **Spec Drift**: Specs e código podem sair de sincronismo
- **Ferramentas Limitadas**: Suporte IDE ainda é novo em 2026

## Conclusão

BMAD não é um silver bullet, mas é um framework sólido para desenvolver agentes que você (e sua equipe) consegue entender, testar e manter. Para sistemas em produção, o retorno no investimento inicial em specs é alto.

Se você está construindo agentes sérios, BMAD merece estar no seu toolkit.

## Referências

- BMAD GitHub: https://github.com/bmad-project
- Claude Code BMAD Templates: https://github.com/anthropics/claude-code
- Story File Format: https://bmad-spec.dev/stories
- Enterprise BMAD Guide: https://bmad-spec.dev/enterprise
