---
slug: hybrid-flow-arquiteturas-agentes
title: "HYBRID-FLOW: Combinando Reativo e Deliberativo em Arquiteturas de Agentes"
authors: [rafael]
tags: [ia, agentes, arquitetura, hybrid, llm]
date: 2026-09-30
---

# HYBRID-FLOW: Combinando Reativo e Deliberativo em Arquiteturas de Agentes

Um agente reativo age instantaneamente — vê o problema, age. Um agente deliberativo pensa — planeja antes de agir. Qual escolher? A resposta prática de 2025-2026 é: ambos.

HYBRID-FLOW é uma prática emergente (não um padrão formal *yet*) de combinar componentes reativos e deliberativos na mesma arquitetura. O resultado é resiliente, adaptável e eficiente — um agente que pensa quando necessário, age rápido quando possível.

<!--truncate-->

## Reativo vs. Deliberativo

### Arquitetura Reativa (ReAct)

```
[Observação] → [Decisão Imediata] → [Ação]

Exemplo:
User: "Qual é a temperatura em São Paulo?"
Agente: [Sem pensar] → Chamar API de clima → Retornar resultado
```

**Vantagens**:
- Rápido (latência baixa)
- Simples (menos pontos de falha)
- Direto em tarefas conhecidas

**Limitações**:
- Falha em problemas complexos
- Sem capacidade de replanejamento
- Inflexível a mudanças de contexto

### Arquitetura Deliberativa

```
[Observação] → [Planejamento] → [Plano] → [Execução] → [Ação]

Exemplo:
User: "Ajude-me a planejar uma viagem de 2 semanas para a Europa"
Agente: 
  1. Pensar: "Preciso saber: orçamento, datas, preferências"
  2. Planejar: "Criar itinerário com voos, hospedagem, atividades"
  3. Executar: "Buscar opções, montar proposta"
```

**Vantagens**:
- Lida com complexidade
- Flexível a mudanças
- Raciocínio explícito (rastreável)

**Limitações**:
- Lento (múltiplos passos)
- Overhead de planejamento para tarefas simples
- Planos podem ser sub-otimais

## HYBRID-FLOW: O Melhor dos Dois Mundos

HYBRID-FLOW combina ambas estratégias na mesma arquitetura:

```
┌─────────────────────┐
│  Entrada do Usuário │
└──────────┬──────────┘
           │
      ┌────▼─────┐
      │ Classify  │  "É simples ou complexo?"
      └────┬─────┘
           │
      ┌────┴─────────────┐
      │                  │
      │ Simples?         │ Complexo?
      │ (confiança>0.9)  │
      ▼                  ▼
   [REATIVO]        [DELIBERATIVO]
   Agir já          Pensar → Planejar → Agir
   Latência: 100ms  Latência: 1-2s
   │                │
   └────────┬───────┘
            │
      ┌─────▼──────┐
      │   Resultado │
      └────────────┘
```

### Padrão 1: Classificação + Roteamento

O agente classifica a complexidade e escolhe a estratégia:

```python
class HybridFlowAgent:
    def process(self, user_query: str):
        complexity = self.classify_complexity(user_query)
        
        if complexity < 0.4:  # Simples
            return self.reactive_handler(user_query)
        elif complexity < 0.7:  # Médio
            return self.hybrid_handler(user_query)
        else:  # Complexo
            return self.deliberative_handler(user_query)
    
    def reactive_handler(self, query):
        # Executar direto, sem planejamento
        return self.call_tool_directly(query)
    
    def hybrid_handler(self, query):
        # Pequeno planejamento, depois execução
        plan = self.quick_plan(query)  # 1 step de raciocínio
        return self.execute_plan(plan)
    
    def deliberative_handler(self, query):
        # Planejamento completo
        plan = self.detailed_plan(query)  # múltiplos steps
        refined_plan = self.refine_plan(plan)
        return self.execute_plan(refined_plan)
```

### Padrão 2: Fallback (Reativo → Deliberativo)

Começar reativo, escalar para deliberativo se necessário:

```python
def process_with_fallback(self, query):
    try:
        # Tentar rápido primeiro
        result = self.reactive_call(query)
        if self.validate_result(result):
            return result
    except ReactiveLimitExceeded:
        pass
    
    # Se falhou ou confiança baixa, pensar
    plan = self.deliberative_plan(query)
    return self.execute_plan(plan)
```

**Benefício**: Você get latência baixa em cases simples, confiabilidade em cases complexos.

### Padrão 3: Paralelo com Votação

Executar ambas estratégias em paralelo, depois consolidar:

```python
async def process_parallel(self, query):
    # Executar reativo e deliberativo simultaneamente
    reactive_result = asyncio.create_task(
        self.reactive_handler(query)
    )
    deliberative_result = asyncio.create_task(
        self.deliberative_handler(query)
    )
    
    r_res = await reactive_result
    d_res = await deliberative_result
    
    # Consolidar (usar o mais confiante, ou mediar)
    if r_res.confidence > 0.95:
        return r_res  # Reativo foi rápido e confiante
    
    return d_res  # Deliberativo foi mais cuidadoso
```

**Benefício**: Máxima confiabilidade — se um caminho falha, o outro pode salvar.

## Variantes em Produção

### 1. Smart Manufacturing (Hybrid LLM + SLM + Regras)

```
Sensor Input: "Temperatura subiu 20°C"

HYBRID:
├─ SLM (Small Language Model): Classificar urgência
│  └─ Output: "Urgência Crítica"
│
├─ Regras Determinísticas: Se urgência crítica → escalate
│  └─ Output: "Chamar especialista"
│
└─ LLM Grande (se necessário contexto): Explicar ao especialista
   └─ Output: "Possíveis causas: falha no sensor, sobre-aquecimento..."
```

### 2. LLM + Reinforcement Learning

Usar RL para aprender quando fazer reativo vs. deliberativo:

```
Agent treina em 1000s de queries:
- Aprender: "Para queries com palavra 'urgente', usar reativo"
- Aprender: "Para queries multi-step, sempre deliberativo"
- Resultado: Policy que classifica automaticamente
```

### 3. Roteamento Adaptativo por Dificuldade

```
SELECT agent BASED ON:
- Número de ferramentas necessárias
- Número de steps de raciocínio
- Clareza do objetivo
```

### 4. ReAcTree: Raciocínio Hierárquico

Combinação de ReAct (ação imediata) com árvore de raciocínio (planejamento):

```
Top-Level Reasoning (deliberativo):
└─ Plan subtasks
   ├─ Subtask 1: Retrieve data (reativo)
   ├─ Subtask 2: Analyze (deliberativo)
   └─ Subtask 3: Summarize (reativo)
```

## Implementação Prática: Agente de Suporte ao Cliente

```python
from typing import Literal

class SupportAgentHybrid:
    def process(self, ticket: str) -> str:
        # 1. Classificar
        query_type = self.classify_issue(ticket)
        complexity = self.estimate_complexity(ticket)
        
        # 2. Rotear
        if query_type == "faq" and complexity < 0.3:
            # FAQ simples → Reativo
            return self.retrieve_faq(ticket)
        
        elif query_type in ["billing", "order_status"]:
            # Precisa de lookup + resposta estruturada
            # Hybrid: pequeno planejamento
            query_plan = self._quick_plan(ticket)
            return self._execute(query_plan)
        
        else:
            # Problema complexo → Deliberativo completo
            reasoning = self.step_by_step_reasoning(ticket)
            plan = self.create_resolution_plan(reasoning)
            return self.execute_resolution(plan)
    
    def classify_issue(self, ticket):
        # Usar LLM rapido para classificação
        prompt = f"Classifique: {ticket}"
        return self.quick_llm(prompt)
    
    def estimate_complexity(self, ticket) -> float:
        # Estimar complexidade (0.0 a 1.0)
        factors = [
            len(ticket.split()),  # Tamanho
            ticket.count("?"),    # Número de perguntas
            "reembolso" in ticket.lower() or "problema" in ticket.lower(),
        ]
        return sum(factors) / len(factors)
    
    def step_by_step_reasoning(self, ticket):
        # Raciocínio deliberativo
        return self.llm(f"""
        Analise este ticket passo a passo:
        {ticket}
        
        Passos:
        1. Qual é o problema raiz?
        2. Qual é a política aplicável?
        3. Qual é a melhor resolução?
        """)
```

## Desafios

### 1. Quantificação de Trade-offs

Quando exatamente reativo supera deliberativo? Faltam métricas padronizadas.

### 2. Over-Engineering

Muitos sistemas implementam wrappers de "roteamento inteligente" que adicionam 20% de latência e 0% de confiabilidade melhorada — porque o sistema simples já funcionava bem.

**Regra de ouro**: Use HYBRID-FLOW só se reativo falha em > 15% dos casos.

### 3. Custos Ocultos

Rodar deliberativo como fallback pode triplicar custos (3x chamadas de LLM).

## Conclusão

HYBRID-FLOW não é uma solução universal, mas é pragmática para sistemas reais onde:
- Maioria das queries é simples
- Alguns casos são complexos
- Custo de latência + confiabilidade importam

Combinar reativo e deliberativo, com roteamento inteligente, oferece o melhor equilíbrio em 2026.

## Referências

- ReAct: Synergizing Reasoning and Acting in Language Models: https://arxiv.org/abs/2210.03629
- ReAcTree: Hierarchical Reasoning: https://arxiv.org/search/?query=reactree
- LLM + RL for Agent Routing: https://arxiv.org/search/?query=reinforcement+learning+agent+routing
- OpenAI Function Calling + Planning: https://platform.openai.com/docs/guides/function-calling
