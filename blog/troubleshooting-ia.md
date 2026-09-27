---
slug: troubleshooting-sistemas-ia
title: "Troubleshooting: 10 Problemas Comuns em Sistemas de IA"
authors: [rafael]
tags: [ia, troubleshooting, debugging, producao, dicas]
date: 2026-10-02
---

# Troubleshooting: 10 Problemas Comuns em Sistemas de IA

Seu sistema de IA está bugado? Este é o checklist que usamos em produção.

<!--truncate-->

## 1. "O LLM está alucinando"

### Sintoma
```
Query: "Qual é o preço do produto X?"
Resposta: "O produto X custa $499" (mas não existe em sua base)
```

### Causas Comuns
- ❌ Contexto insuficiente (RAG com top-1 documentos)
- ❌ Prompt permissivo ("sinta-se livre para inferir")
- ❌ Modelo muito criativo (temperature=1.0)

### Solução
```python
# Antes
qa = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

# Depois
qa = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    chain_type_kwargs={
        "prompt": PromptTemplate(
            template="Responda APENAS baseado neste contexto: {context}\n\nQ: {question}\nA:",
            input_variables=["context", "question"]
        )
    }
)

# Também
llm = OpenAI(temperature=0, model="gpt-3.5-turbo")  # temperature=0
```

---

## 2. "Latência explodiu"

### Sintoma
Queries que demoravam 500ms agora demoram 5s.

### Checklist

```python
# 1. Checar tamanho do contexto
def log_retrieval_time(retriever, query):
    start = time.time()
    docs = retriever.get_relevant_documents(query)
    retrieval_time = time.time() - start
    
    print(f"Retrieval: {retrieval_time:.2f}s")
    print(f"Docs recuperados: {len(docs)}")
    print(f"Total tokens: {sum(len(d.page_content.split()) for d in docs)}")
```

### Causas
- ❌ Vector DB lento (índice não otimizado)
- ❌ LLM em sobrecarga (rate limiting)
- ❌ Muitos documentos sendo processados

### Solução Rápida
```python
# Reduzir documentos recuperados
retriever = vector_store.as_retriever(
    search_kwargs={"k": 3}  # Era 10?
)

# Usar SLM para perguntas simples
def route_query(query):
    if len(query) < 50:
        return small_model  # Mistral 7B
    else:
        return large_model  # GPT-4
```

---

## 3. "Acurácia caiu sem motivo"

### Sintoma
Ontem: 95% acurácia
Hoje: 72% acurácia
Nada mudou.

### Investigação
```python
# Coletar dados
import json
from datetime import datetime

def log_inference(query, response, ground_truth, model_version):
    log = {
        "timestamp": datetime.now().isoformat(),
        "query": query,
        "response": response,
        "ground_truth": ground_truth,
        "model_version": model_version,
        "is_correct": response == ground_truth
    }
    with open("inference_log.jsonl", "a") as f:
        f.write(json.dumps(log) + "\n")

# Analisar
df = pd.read_json("inference_log.jsonl", lines=True)
df.groupby('model_version')['is_correct'].agg(['mean', 'count'])
```

### Causas Comuns
- ⚠️ Silenciosamente fez rollout de novo modelo
- ⚠️ Vector DB foi rebuiltado (embeddings diferentes)
- ⚠️ Dados de teste poisoned

### Solução
```python
# Sempre versionar
model_version = os.getenv("MODEL_VERSION", "gpt-3.5-turbo-1106")
embedding_version = "text-embedding-3-large-2026-q4"

# Manter histórico de performance
with open("model_metrics.json", "a") as f:
    metrics = {
        "timestamp": datetime.now().isoformat(),
        "model": model_version,
        "embeddings": embedding_version,
        "accuracy": 0.92,
        "latency_ms": 850
    }
    f.write(json.dumps(metrics) + "\n")
```

---

## 4. "RAG está trazendo documentos errados"

### Debug Passo-a-Passo

```python
def debug_retrieval(query):
    # 1. Ver embedding da query
    query_embedding = embeddings.embed_query(query)
    print(f"Query embedding shape: {len(query_embedding)}")
    
    # 2. Buscar top-10 (não top-3)
    docs = vector_store.similarity_search_with_score(query, k=10)
    
    # 3. Analisar scores
    for i, (doc, score) in enumerate(docs):
        print(f"{i}. Score: {score:.3f}")
        print(f"   Content: {doc.page_content[:100]}...")
        print()
    
    # 4. Está o documento certo lá (em posição errada)?
    # Se sim → problema é ranking, use reranker
    # Se não → problema é embedding, mude modelo
```

### Soluções por Cenário

**Problema:** Documento certo está em posição 7, não 1
```python
# Use reranker
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import CohereReranker

reranker = ContextualCompressionRetriever(
    base_compressor=CohereReranker(),
    base_retriever=vector_store.as_retriever(search_kwargs={"k": 10})
)
```

**Problema:** Documento certo não aparece nem no top-10
```python
# Trocar modelo de embedding
from langchain.embeddings import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(
    model_name="BAAI/bge-large-en-v1.5"  # Melhor que text-embedding-ada
)
```

---

## 5. "Rate limiting do LLM"

### Sintoma
```
RateLimitError: Rate limit exceeded. Retry after 60s
```

### Solução Rápida

```python
from tenacity import retry, wait_exponential, stop_after_attempt

@retry(
    wait=wait_exponential(multiplier=1, min=4, max=10),
    stop=stop_after_attempt(3)
)
def call_llm(prompt):
    return llm(prompt)
```

### Solução Escalável
```python
# Para produção: usar queue + async
from concurrent.futures import ThreadPoolExecutor
import queue
import time

class RateLimitedLLMQueue:
    def __init__(self, max_qpm=3000):  # 3K queries/min
        self.queue = queue.Queue()
        self.max_qpm = max_qpm
        self.executor = ThreadPoolExecutor(max_workers=1)
        
    def process_batch(self):
        delay = 60 / (self.max_qpm / 60)  # milliseconds between calls
        while True:
            prompt = self.queue.get()
            response = llm(prompt)
            time.sleep(delay / 1000)
            yield response
```

---

## 6-10: Checklists Rápidos

### 6. Token Limit Excedido

```python
# Verificar antes de enviar
def estimate_tokens(text):
    import tiktoken
    enc = tiktoken.encoding_for_model("gpt-3.5-turbo")
    return len(enc.encode(text))

total = estimate_tokens(context) + estimate_tokens(query)
if total > 4000:  # 4K limit
    # Truncar contexto ou usar modelo maior
```

### 7. Embedding Dimension Mismatch

```python
# Checar formato esperado
expected_dim = 1536  # text-embedding-ada

if embedding.shape[1] != expected_dim:
    raise ValueError(f"Expected {expected_dim}, got {embedding.shape[1]}")
```

### 8. JSON Parsing Errors

```python
# Usar structured output ao invés de regex
response = llm.predict(
    prompt=prompt,
    response_format={"type": "json_schema", "schema": {...}}
)
# Não precisa parsear, já vem JSON
```

### 9. Stale Cache

```python
# Invalidar cache após atualização
vector_store.delete_index()
vector_store = FAISS.from_documents(new_docs, embeddings)
```

### 10. Environment Variables Missing

```python
import os

required = ["OPENAI_API_KEY", "COHERE_API_KEY"]
missing = [k for k in required if not os.getenv(k)]

if missing:
    raise EnvironmentError(f"Missing: {', '.join(missing)}")
```

---

## Boilerplate: Sistema de Observabilidade Mínimo

```python
import logging
import time
from functools import wraps

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def observe(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        try:
            result = func(*args, **kwargs)
            elapsed = time.time() - start
            logger.info(f"{func.__name__} success in {elapsed:.2f}s")
            return result
        except Exception as e:
            elapsed = time.time() - start
            logger.error(f"{func.__name__} failed after {elapsed:.2f}s: {e}")
            raise
    return wrapper

@observe
def retrieve_and_answer(query):
    docs = retriever.get_relevant_documents(query)
    answer = llm(format_context(docs) + query)
    return answer
```

**Resumo:** Instrumentar, versionar, e monitorar. 90% dos bugs de IA vêm de mudanças silenciosas que você não rastreou.
