---
slug: avaliacao-llm
title: "Avaliação de Sistemas de IA: LLM-as-Judge"
description: "De BLEU/ROUGE até avaliação automática com modelos de linguagem"
tags: [avaliacao, eval, llm, qualidade, benchmark]
authors: [rafael]
---

# Avaliação de Sistemas de IA: De BLEU à LLM-as-Judge

Como você sabe se seu agente está funcionando bem? BLEU e ROUGE foram padrão por 20 anos — mas falham silenciosamente. Com explosão dos LLMs, emergiu uma nova era: **LLM-as-Judge**.

## Métricas Tradicionais: Por Que Falham

### BLEU (Bilingual Evaluation Understudy)

```
Referência: "A capital de Portugal é Lisboa"
Modelo: "A capital de Portugal é Lisboa"
BLEU: 100 (match perfeito)

Referência: "A capital de Portugal é Lisboa"
Modelo: "Lisboa é a capital de Portugal"
BLEU: ~0.6 (pior, mas significa a mesma coisa!)
```

**Problema**: Insensível a semântica, sensível a ordem.

### ROUGE

Similar ao BLEU, mas enfatiza recall.

**Problema**: Igual ao BLEU — não entende significado.

## LLM-as-Judge: A Revolução

Use um LLM para avaliar:

```
Entrada:
- Pergunta: "Qual é a capital de Portugal?"
- Resposta: "Lisboa, a maior cidade e capital do país"

Output:
{
  "correctness": 10/10,
  "completeness": 8/10,
  "clarity": 9/10,
  "reasoning": "Resposta está correta, completa e clara"
}
```

### Por Que Funciona

1. **Compreensão Semântica**: Entende paráfrases, sinônimos
2. **Flexibilidade**: Avalia qualquer tipo de tarefa
3. **Escala**: Reduz custo 500-5000x vs. humano
4. **Explicabilidade**: Explica por que score é X

### Concordância com Humanos

- LLM-as-Judge: ~80% concordância com humanos
- Humano vs. Humano: ~80% concordância
- BLEU/ROUGE: ~30% concordância

**Conclusão**: LLM-as-Judge é tão confiável quanto humanos!

## Dois Modos: Pointwise vs. Pairwise

### Pointwise: Score Absoluto

```
Pergunta: "Explique quantum computing"
Resposta: [texto]

Juiz: Score 1-10?
```

**Vantagem**: Simples
**Desvantagem**: Scores absolutos são arbitrários

### Pairwise: Comparação

```
Pergunta: "Qual é a capital de Portugal?"
Resposta A: "Lisboa"
Resposta B: "Lisboa, a maior cidade com 500K habitantes"

Juiz: "Qual é melhor?"
```

**Vantagem**: Mais robusto
**Desvantagem**: 2x mais caro

## Frameworks Populares (2026)

### Arena-Hard

Benchmark dinâmico com 500+ perguntas:
- Formato: Pairwise
- Avaliador: Claude, GPT-4, Llama (rotate)
- Métrica: ELO rating

### MT-Bench

80 perguntas multi-turno em 8 categorias (escrita, código, matemática)

### MATH-Shepherd

Verificador passo-a-passo para raciocínio matemático

### JudgeArena

Benchmark para avaliar os próprios LLM-judges

## Vieses Ocultos

### 1. Preferência por Respostas Longas

```
"Qual é a capital?"

A: "Lisboa"
Score: 6/10 (LLM: "muito breve")

B: "Lisboa é a capital desde 1297..."
Score: 10/10
```

### 2. Order-Dependence

Primeira opção em pairwise é favorecida.

### 3. Viés Familiar

Modelos favorecem outputs que parecem "seus".

## Best Practices (2026)

1. Usar multimodal: BLEU (rápido) + LLM-Judge (profundo)
2. Randomize ordem em pairwise
3. Documentar prompt usado para o juiz
4. Validar contra humano em subset
5. Versionar modelo juiz ("GPT-4 v1.5, May 2026")
6. Declarar vieses conhecidos

## Desafios

- **Reproducibilidade**: Atualizações de modelo mudam scores
- **Custo**: LLM-Judge custa 10-100x mais que BLEU
- **Alinhamento**: Vieses do juiz podem não alinhar com seus valores

## Conclusão

Em 2026, LLM-as-Judge é o padrão. BLEU/ROUGE são smoke tests, não avaliação séria.

**Para produção**:
- MVP: BLEU + teste humano
- Alpha/Beta: LLM-Judge pointwise
- Produção: LLM-Judge pairwise + validação humana contínua

## Referências

- Arena-Hard: https://github.com/lmarena/arena-hard
- MT-Bench: https://github.com/lm-sys/FastChat
- MATH-Shepherd: https://arxiv.org/abs/2312.08935
- LLM-as-Judge Survey: https://arxiv.org/abs/2411.16594
- JudgeArena: https://arxiv.org/abs/2410.12784
- DeepEval Framework: https://deepeval.com/
- am-ELO: https://arxiv.org/abs/2505.03475
