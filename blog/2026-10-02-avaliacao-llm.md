---
slug: avaliacao-llm-judge
title: "Avaliação de Sistemas de IA: De BLEU à LLM-as-Judge"
authors: [rafael]
tags: [ia, eval, llm, qualidade, benchmark]
date: 2026-10-02
---

# Avaliação de Sistemas de IA: De BLEU à LLM-as-Judge

Como você sabe se seu agente está funcionando bem? No mundo das linguagens, BLEU e ROUGE foram o padrão por 20 anos — mas falham silenciosamente. Com a explosão dos LLMs, emergiu uma nova era: **LLM-as-Judge**, onde modelos de linguagem avaliam outros modelos.

Esse artigo explora como avaliar sistemas de IA em 2026, quando usar cada abordagem, e os vieses ocultos que ninguém fala.

<!--truncate-->

## Métricas Tradicionais: BLEU, ROUGE e o Por Que Falham

### BLEU (Bilingual Evaluation Understudy)

```
Referência: "A capital de Portugal é Lisboa"
Modelo: "A capital de Portugal é Lisboa"
BLEU Score: 100 (match perfeito)

Referência: "A capital de Portugal é Lisboa"
Modelo: "Lisboa é a capital de Portugal"
BLEU Score: ~0.6-0.7 (pior, mas significa a mesma coisa!)
```

**Como Funciona**:
- Compara n-gramas (sequências de N palavras) entre output e referência
- Score 0-1: quanto maior, melhor
- Fácil, rápido, determinístico

**Quando Funciona**:
- Tradução machine (quando referência é ouro)
- Tasks com respostas muito estruturadas

**Por Que Falha**:
- Insensível a semântica (paráfrases recebem score ruim)
- Sensível a ordem das palavras
- Falha em tarefas abertas (geração de texto, respostas criativas)

### ROUGE (Recall-Oriented Understudy for Gisting Evaluation)

Similar ao BLEU, mas enfatiza recall (cobertura de conteúdo da referência).

**Problema**: Igual ao BLEU — não entende significado.

## LLM-as-Judge: A Revolução

Em vez de métricas baseadas em regex/n-gramas, use um LLM para avaliar:

```
Evaluador: "Avalie esta resposta"

Entrada:
- Pergunta: "Qual é a capital de Portugal?"
- Resposta: "Lisboa, a maior cidade e capital do país"
- Critérios: Correto? Completo? Claro?

Output:
{
  "correctness": 10/10,
  "completeness": 8/10,
  "clarity": 9/10,
  "overall": 9/10,
  "reasoning": "Resposta está correta, completa e bem explicada"
}
```

### Por Que LLM-as-Judge Funciona

1. **Compreensão Semântica**: Entende paráfrases, sinônimos
2. **Flexibilidade**: Avalia qualquer tipo de tarefa (geração, código, raciocínio)
3. **Escala**: Reduz custo 500-5000x vs. avaliação humana
4. **Explicabilidade**: Modelos (bons) explicam por que score é X

### Concordância com Humanos

Estudos 2025-2026 mostram:
- LLM-as-Judge: ~80% concordância com avaliadores humanos
- Humano vs. Humano: ~80% concordância
- BLEU/ROUGE: ~30% concordância com humanos

**Conclusão**: LLM-as-Judge é tão confiável quanto humanos avaliarem uns aos outros!

## Dois Modos: Pointwise vs. Pairwise

### Pointwise: Score Absoluto

Avaliar uma resposta isoladamente:

```
Pergunta: "Explique quantum computing"
Resposta: [texto do modelo]

Juiz: Score de 1-10: _?_
```

**Vantagem**: Simples, direto.
**Desvantagem**: Scores absolutos são arbitrários ("o que é um 7?").

### Pairwise: Comparação

Comparar duas respostas:

```
Pergunta: "Qual é a capital de Portugal?"
Resposta A: "Lisboa"
Resposta B: "Lisboa, a maior cidade de Portugal com 500K habitantes"

Juiz: "Qual é melhor?"
Output: "B é melhor porque mais completa"
```

**Vantagem**: Mais robusto (relative scores vs. absolute).
**Desvantagem**: Custo 2x (duas respostas para avaliar).

## Frameworks e Benchmarks (2026)

### Arena-Hard

Benchmark dinâmico comunitário com 500+ perguntas curadas:

```
Formato: Pairwise
Avaliador: Claude 3.5, GPT-4, Llama 3.1 (rotate)
Atualizado: Semanalmente
Métrica: ELO rating (como xadrez)

Top performers (out 2026):
1. Claude 3.7 (2450 ELO)
2. GPT-4o (2380 ELO)
3. Llama 4 (2200 ELO)
```

### MT-Bench

80 perguntas multi-turno em 8 categorias (escrita, código, matemática, etc.):

```
Pergunta Turn 1: "Escreva um poema sobre IA"
Resposta: [poema]

Pergunta Turn 2 (contextual): "Adapte para iambic pentameter"
Resposta: [poema adaptado]

Avaliado: Correção, criatividade, seguimento de instruções
```

### MATH-Shepherd

Verificador passo-a-passo para raciocínio matemático:

```
Problema: "Resolva: 2x + 5 = 13"

Modelo output:
  Step 1: 2x = 13 - 5 = 8 ✓ (verificado)
  Step 2: x = 8 / 2 = 4 ✓ (verificado)
  Final: x = 4 ✓

Avaliador: "Raciocínio correto em todas as steps"
```

**Valor**: Detecta erros de raciocínio mesmo se resposta final está certa.

### JudgeArena

Benchmark para avaliar os **próprios LLM-judges**:

```
Pergunta: "Quem é melhor juiz? Claude ou GPT-4?"

Método:
1. Ambos avaliam 1000 pares de respostas
2. Comparar suas avaliações contra verdade humana
3. Calcular F1-score, vieses, concordância

Resultado (2026): Claude tem menor viés de comprehensão,
                  GPT-4 melhor em código
```

## Os Vieses Ocultos

### 1. Preferência por Respostas Longas

LLMs tendem a dar scores mais altos para respostas detalhadas:

```
Pergunta: "Qual é a capital de Portugal?"

Resposta A: "Lisboa"
Score esperado: 10/10 (correto, conciso)
Score real: 6/10 (LLM juiz: "muito breve")

Resposta B: "Lisboa é a capital de Portugal desde 1297.
            Localizada na costa atlântica, tem 500K habitantes..."
Score esperado: 8/10 (algumas informações extras)
Score real: 10/10
```

**Mitigação**: Usar critérios explícitos ("brevidade é bom para essa tarefa").

### 2. Ordem-Dependência (Position Bias)

Primeira opção em pairwise é favorecida:

```
Pairwise Avaliação:
  Opção A vs. Opção B: A ganhou 65%
  Opção B vs. Opção A: B ganhou 40% (mesmo conteúdo!)

Problema: LLM juiz é influenciado por posição
```

**Mitigação**: Sempre randomize ordem quando fazer pairwise.

### 3. Viés Familiar

Modelos favorecem outputs que parecem "seus":

```
LLM Judge (Claude): avalia respostas de Claude vs. GPT-4
Resultado: Claude 65%, GPT-4 35%

Mesma avaliação feita por GPT-4 Judge:
Resultado: Claude 35%, GPT-4 65%

Verdade: Ambas respostas têm qualidade similar!
```

## Implementação Prática: Sistema de Avaliação Híbrido

```python
from dataclasses import dataclass
from enum import Enum

class EvalMode(Enum):
    SMOKE_TEST = 1     # BLEU/ROUGE rápido
    DETAILED = 2       # LLM-as-Judge pointwise
    PRODUCTION = 3     # LLM-as-Judge pairwise

@dataclass
class EvalResult:
    score: float
    reasoning: str
    mode: EvalMode

class HybridEvaluator:
    def evaluate(self, query, response, mode=EvalMode.DETAILED):
        if mode == EvalMode.SMOKE_TEST:
            # Rápido
            return self._bleu_score(query, response)
        
        elif mode == EvalMode.DETAILED:
            # LLM-Judge pointwise
            prompt = f"""
            Avalie esta resposta em português de 1-10:
            
            Pergunta: {query}
            Resposta: {response}
            
            Critérios:
            - Correto? (5 pts)
            - Completo? (3 pts)
            - Claro? (2 pts)
            
            Responda em JSON:
            {{"score": 1-10, "reasoning": "..."}}
            """
            return self._llm_evaluate(prompt)
        
        elif mode == EvalMode.PRODUCTION:
            # Pairwise contra baseline
            baseline = self._get_baseline_response(query)
            
            comparison = f"""
            Qual resposta é melhor?
            
            Pergunta: {query}
            
            Resposta A (nova): {response}
            Resposta B (baseline): {baseline}
            
            Prefiro: A ou B? Por quê?
            """
            return self._llm_evaluate(comparison)
    
    def _bleu_score(self, query, response):
        # Implementação BLEU simplificada
        reference = self._get_reference(query)
        score = bleu([reference], [response])
        return EvalResult(score=score, reasoning="BLEU", mode=EvalMode.SMOKE_TEST)
    
    def _llm_evaluate(self, prompt):
        response = self.llm(prompt)
        # Parse response JSON
        result = json.loads(response)
        return EvalResult(
            score=result['score'],
            reasoning=result['reasoning'],
            mode=EvalMode.DETAILED
        )
```

## Best Practices (2026)

1. **Usar Multimodal**: BLEU (rápido) + LLM-Judge (profundo)
2. **Randomize Ordem**: Em pairwise, sempre randomizar posição
3. **Documentar Prompt**: Qual prompt você usou para o juiz? (crítico para reproduzibilidade)
4. **Validar Contra Humano**: Sempre correlacionar com avaliação humana em subset
5. **Versionar Modelo Juiz**: "Avaliado com GPT-4 v1.5, May 2026"
6. **Declarar Vieses Conhecidos**: Documentar "preferência por respostas longas"
7. **Hybrid Approach**: Não confie 100% em LLM-Judge para decisions críticas

## Desafios Persistentes

- **Reproducibilidade**: Atualizações de modelo mudam histórico de scores
- **Custo**: LLM-Judge custa 10-100x mais que BLEU/ROUGE
- **Alinhamento**: Vieses do juiz podem não alinhar com seus valores
- **Confiança**: Como sabe se o juiz é bom? Benchmark dos benchmarks!

## Conclusão

Em 2026, LLM-as-Judge é o padrão de facto para avaliar LLMs. BLEU/ROUGE são ferramentas de smoke test, não avaliação séria.

Para sistemas em produção:
- **MVP**: BLEU + teste humano básico
- **Alpha/Beta**: LLM-Judge pointwise
- **Produção**: LLM-Judge pairwise + validação humana contínua

O futuro é hybrid: máquinas avaliam rápido, humanos validam continuamente.

## Referências

- Arena-Hard: https://github.com/lmarena/arena-hard
- MT-Bench: https://github.com/lm-sys/FastChat/tree/main/fastchat/llm_judge
- MATH-Shepherd: https://arxiv.org/abs/2312.08935
- LLM-as-Judge Survey: https://arxiv.org/abs/2411.16594
- JudgeArena: https://arxiv.org/abs/2410.12784
- DeepEval Framework: https://deepeval.com/
- am-ELO: Stable ELO for Arena: https://arxiv.org/abs/2505.03475
