---
slug: bmad-method
title: "BMAD-METHOD: Desenvolvimento Dirigido por Especificação"
description: "Metodologia estruturada para desenvolvimento de agentes de IA confiáveis"
tags: [bmad, agentes, metodologia, desenvolvimento]
authors: [rafael]
---

# BMAD-METHOD: Desenvolvimento Dirigido por Especificação para Agentes de IA

Se você já trabalhou em projetos de IA, provavelmente enfrentou o caos de "o que exatamente o agente deveria fazer?". O BMAD-METHOD é uma resposta estruturada a esse problema — uma metodologia que coloca a especificação clara no centro do desenvolvimento de agentes autônomos.

## O que é BMAD?

BMAD é um acrônimo para **Behavior-Marked Agent Development** — uma metodologia que enfatiza:

- **Spec-Driven Development**: A especificação clara é o ponto de partida, não um afterthought
- **Agent-as-Code**: Agentes não são black boxes; seu comportamento é codificado explicitamente
- **Structured Handoffs**: Transições entre estados e subtarefas são bem-definidas
- **Story Files**: Casos de uso (histórias) que demonstram o comportamento esperado
- **Control Preservation**: O desenvolvedor mantém controle claro sobre o agente

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
```

### 2. Agent-as-Code Pattern

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
```

### 3. Story Files

Uma "story" é um cenário de teste que demonstra o comportamento esperado:

```yaml
story: "Responder pergunta sobre política de retorno"

steps:
  - user: "Qual é a política de retorno?"
  
  - expected_agent_behavior:
      action: "retrieval"
      source: "knowledge_base.returns"
  
  - expected_response:
      contains: ["30 dias", "reembolso total"]
      does_not_contain: ["idk", "não sei"]
```

## Variantes do BMAD

### Classic Track
- Desenvolvimento iterativo com specs detalhadas
- Testes contínuos contra stories
- Usado para sistemas em produção com SLA

### Quick Flow Track
- Specs compactas, iteração rápida
- Menos stories inicialmente, mais testes in-field

### Enterprise Track
- Specs rígidas, auditoria, compliance
- Rastreamento completo de cada decisão

## Estado Atual (2026)

BMAD ganhou tração significativa:

- **43.000+ stars** no GitHub em projetos que usam BMAD
- **Adoção em Produção**: Empresas usam BMAD para atendimento ao cliente, análise de dados
- **Integração IDE**: Claude Code e Cursor incluem templates BMAD nativos

## Conclusão

BMAD não é um silver bullet, mas é um framework sólido para desenvolver agentes que você consegue entender, testar e manter. Para sistemas em produção, o retorno no investimento inicial em specs é alto.

## Referências

- BMAD GitHub: https://github.com/bmad-project
- Claude Code BMAD Templates: https://github.com/anthropics/claude-code
- Enterprise BMAD Guide: https://bmad-spec.dev/enterprise
