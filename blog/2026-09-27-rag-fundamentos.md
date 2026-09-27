---
slug: rag-fundamentos-arquitetura
title: "RAG: Fundamentos e Padrões de Arquitetura"
authors: [rafael]
tags: [ia, rag, llm, retrieval, generacao]
date: 2026-09-27
---

# RAG: Fundamentos e Padrões de Arquitetura

A busca por sistemas de IA mais precisos e atualizados levou ao desenvolvimento de uma técnica elegante: RAG (Retrieval-Augmented Generation). Ao combinar um modelo de linguagem com a capacidade de consultar fontes externas de conhecimento, RAG resolve dois problemas clássicos dos LLMs: alucinações (respostas fabricadas) e desatualização do conhecimento de treino.

Neste artigo, você aprenderá os conceitos fundamentais de RAG, seus padrões de implementação (desde os mais simples até os mais sofisticados), e como avaliar qual abordagem faz sentido para seu caso de uso.

<!--truncate-->

## O que é RAG?

RAG é uma arquitetura de dois estágios:

1. **Retriever** (Recuperador): Busca documentos relevantes em uma base de conhecimento
2. **Generator** (Gerador): Usa esses documentos como contexto para gerar uma resposta com o LLM

Em vez de contar exclusivamente com o conhecimento parametrizado do modelo durante treino, RAG permite que o LLM consulte informações atualizadas, especializadas ou propriedades em tempo real — resultando em respostas mais precisas e rastreáveis.

### Por que RAG?

- **Redução de Alucinações**: O modelo tem fatos reais para consultar, não apenas "adivinhar"
- **Conhecimento Atualizado**: Documentos podem ser atualizados sem retreinar o modelo
- **Rastreabilidade**: Cada resposta pode citar suas fontes
- **Economia de Tokens**: Melhor uso do contexto do LLM via documentos recuperados relevantes
- **Escalabilidade**: Funciona com bases de conhecimento muito maiores que o contexto do modelo

## Componentes Fundamentais

### 1. Recuperador (Retriever)

O retriever busca os `k` documentos mais relevantes para a query do usuário. Existem duas estratégias principais:

**Sparse Retrieval (Keyword-based)**
- Usa algoritmos como BM25 (TF-IDF melhorado)
- Rápido, interpretável, funciona bem em datasets estruturados
- Limitação: sensível a variações de linguagem e sinônimos

**Dense Retrieval (Semantic)**
- Converte textos em embeddings (vetores densos)
- Busca por similaridade semântica no espaço de embeddings
- Mais preciso para significado, mas requer índice vetorial (mais caro computacionalmente)

**Hybrid**: Combina ambos para o melhor dos dois mundos — velocidade + precisão semântica.

### 2. Embeddings

Um embedding é uma representação numérica (vetor) de um texto que captura seu significado semântico. Modelos de embedding modernos (OpenAI `text-embedding-3-large`, Voyage-3, Jina 2.0) produzem vetores de alta dimensão onde textos semanticamente similares ficam próximos no espaço vetorial.

**Qualidade do embedding** impacta diretamente a qualidade do RAG — embeddings melhores significam recuperação mais precisa.

### 3. Indexação

Os documentos são divididos em chunks (fragmentos) e convertidos em embeddings, depois armazenados em um **vector Database** (Pinecone, Weaviate, Qdrant, Milvus) ou índice (Elasticsearch, LuceneIndexer).

Decisões críticas aqui:
- **Tamanho do chunk**: Muito pequeno = contexto insuficiente; muito grande = ruído
- **Estratégia de overlap**: Chunks sobrepostos ajudam a preservar contexto nas bordas
- **Metadados**: Armazenar fonte, data, categoria facilita filtragem pós-retrieval

### 4. Prompt Engineering

Após recuperar documentos, o prompt deve ser construído para guiar o LLM a usar essas referências. Um padrão comum:

```
Contexto:
[DOCUMENTOS RECUPERADOS]

Pergunta: [QUERY DO USUÁRIO]

Responda baseado estritamente no contexto acima. Se a informação não estiver no contexto, diga "não encontrado".
```

## Padrões de Implementação

### 1. Naive RAG (Simples, Mas Comum)

```
Query → Recuperar documentos → Concatenar ao prompt → LLM responde
```

**Vantagens**: Implementação trivial, funciona para cases simples.
**Desvantagens**: Sem otimização; pode recuperar documentos irrelevantes; contexto comprimido de forma ingênua.

### 2. Advanced RAG

Adiciona otimizações em cada estágio:

- **Query Reformulation**: Reescrever a query para melhorar recuperação (ex: usar sinônimos, expandir para queries multi-hop)
- **Reranking**: Recuperar mais documentos (`k=20`), depois usar um modelo de reranking para selecionar os `top-5` mais relevantes
- **Iterative Retrieval**: Recuperar → processar → recuperar novamente se necessário (para queries complexas)
- **Structured RAG**: Recuperar dados estruturados (JSON, tabelas), não apenas texto livre

### 3. Graph RAG

Ao invés de documentos flat, usar um **Knowledge Graph** (grafo de conhecimento) onde nós são entidades e arestas são relações. Permite consultas multi-hop e raciocínio mais rico.

Exemplo: Em vez de "qual é a capital de Portugal?", o grafo permite raciocinar sobre "qual é a capital do país que faz fronteira com Espanha?".

### 4. Hybrid RAG (Combina vetorial + conhecimento estruturado)

- Recupera documentos via semântica
- Realiza lookups em Knowledge Graphs para contexto relacional
- Combina respostas para maior robustez

## Implementação Prática: Exemplo com LangChain

```python
from langchain.vectorstores import Pinecone
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI

# 1. Embeddings
embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

# 2. Vector Store
vector_store = Pinecone.from_documents(
    documents, embeddings, index_name="meu-index"
)

# 3. Retriever
retriever = vector_store.as_retriever(search_kwargs={"k": 5})

# 4. QA Chain
qa = RetrievalQA.from_chain_type(
    llm=OpenAI(model="gpt-4"),
    chain_type="stuff",  # ou "map_reduce" para documentos grandes
    retriever=retriever
)

# 5. Query
resposta = qa("Qual é a política de retorno?")
print(resposta)
```

## Desafios e Trade-offs

### 1. Qualidade do Chunk

Como dividir documentos? Opções:
- **Tamanho fixo**: Simples, mas pode cortar contexto
- **Semantic**: Dividir onde há mudança de tema (mais complexo, melhor)
- **Estrutural**: Respeitar capítulos, seções (ideal para documentação estruturada)

### 2. Hallucinations Persistem

Mesmo com RAG, o LLM pode fabricar informações se o documento recuperado for vago ou contraditório. Solução: usar **constrained generation** ou **fact verification**.

### 3. Escalabilidade

Recuperar e processar milhões de documentos é caro. Soluções:
- Usar filtering antes de retrieval (por data, categoria, etc.)
- Reranking para reduzir contexto final
- Modelos de LLM mais eficientes (SLMs, quantização)

### 4. Atualização de Conhecimento

Como manter documentos atualizados? Opções:
- Re-indexação periódica (batch)
- Indexação em tempo real (streaming)
- Híbrido: fatos "hot" em cache, resto em disco

## Estado Atual (2026)

**Tendência Global**: Shift para **long context**. Com modelos como Claude 200K, GPT-4 Turbo 128K, Gemini 2.0 1M tokens, a necessidade de RAG diminui para muitos casos — mas RAG ainda é crítico para:
- Datasets > contexto do modelo
- Atualização dinâmica de conhecimento
- Casos onde rastreabilidade é obrigatória (legal, saúde)

**Ferramentas Populares**:
- **LangChain**: Framework completo com chains, agents, memory
- **LlamaIndex**: Otimizado para RAG, melhor observabilidade
- **Haystack**: Especializado em NLP pipelines
- **Eval Frameworks**: RAGAS, TruLens para avaliar qualidade RAG

## Conclusão

RAG é uma técnica poderosa e madure que combina o melhor dos dois mundos: a capacidade semântica dos LLMs com a precisão de bases de conhecimento atualizadas. Seu sucesso depende de três pilares:

1. **Embeddings de qualidade**
2. **Chunking inteligente**
3. **Prompt engineering claro**

Para a maioria dos casos de produção, uma implementação "Advanced RAG" com reranking e query reformulation oferece o melhor equilíbrio custo-benefício. Escolha sua arquitetura baseado em:
- Tamanho da base de conhecimento
- Frequência de atualização
- Requerimento de rastreabilidade
- Budget computacional

RAG não é a solução universal, mas é um padrão estabelecido e confiável para sistemas de IA em produção.

## Referências

- Lewis et al. (2020): "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" — https://arxiv.org/abs/2005.11401
- Karpukhin et al. (2020): "Dense Passage Retrieval for Open-Domain Question Answering" — https://arxiv.org/abs/2004.04906
- LlamaIndex Docs: https://docs.llamaindex.ai/
- LangChain RAG Guide: https://python.langchain.com/docs/modules/data_connection/
- RAGAS: Framework for RAG evaluation — https://github.com/explodinggradients/ragas
