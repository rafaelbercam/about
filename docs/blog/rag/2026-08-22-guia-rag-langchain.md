---
slug: guia-rag-langchain
title: "Guia Prático: Implementar RAG com LangChain"
authors: [rafael]
tags: [ia, rag, langchain, tutorial, implementacao]
date: 2026-09-28
---

# Guia Prático: Implementar RAG com LangChain em 30 Minutos

*Escrito por Rafael Berçam Medeiros em 22 de Agosto de 2026*

Quer implementar um sistema RAG profissional? Neste guia, vamos construir um chatbot que responde perguntas sobre documentação usando LangChain e vetores.

## Pré-requisitos

```bash
pip install langchain openai faiss-cpu python-dotenv
```

## Passo 1: Setup Básico

```python
from langchain.document_loaders import TextLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI

import os
os.environ['OPENAI_API_KEY'] = 'sua-chave-aqui'
```

## Passo 2: Carregar Documentos

```python
# Carregar seus documentos
loader = TextLoader('seu_documento.txt')
documents = loader.load()

# Dividir em chunks
text_splitter = CharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)
docs = text_splitter.split_documents(documents)

print(f"Documentos carregados: {len(docs)} chunks")
```

**Dica:** Use `chunk_overlap=200` para não perder contexto entre chunks.

## Passo 3: Criar Vector Store

```python
# Gerar embeddings
embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

# Armazenar em FAISS
vector_store = FAISS.from_documents(docs, embeddings)

# Salvar para reusar
vector_store.save_local("rag_vectorstore")
```

**Alternativas:** Pinecone, Weaviate, Chroma

## Passo 4: Criar Chain RAG

```python
# Carregar vector store
vector_store = FAISS.load_local("rag_vectorstore", embeddings)

# Criar retriever
retriever = vector_store.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 3}  # Top 3 documentos
)

# LLM
llm = OpenAI(temperature=0, model="gpt-3.5-turbo")

# RAG Chain
qa = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=True
)
```

## Passo 5: Testar

```python
query = "Como funciona RAG?"

result = qa({"query": query})

print("Resposta:", result['result'])
print("\nFontes:")
for doc in result['source_documents']:
    print(f"- {doc.metadata}")
```

## Resultado Esperado

```
Resposta: RAG combina busca com geração. Primeiro busca documentos 
relevantes, depois passa ao LLM que gera resposta contextualizada...

Fontes:
- {'source': 'documento_1.txt'}
- {'source': 'documento_2.txt'}
```

## Próximos Passos (Melhorias)

### 1. Reranking (Melhora Qualidade)

```python
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import CohereReranker

compressor = CohereReranker()
compression_retriever = ContextualCompressionRetriever(
    base_compressor=compressor, 
    base_retriever=retriever
)
```

### 2. Query Reformulation (Melhora Recuperação)

```python
from langchain.chains import MultiQueryRetriever

retriever_multi = MultiQueryRetriever.from_llm(
    retriever=vector_store.as_retriever(),
    llm=llm
)
```

### 3. Conversational Memory

```python
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True
)

qa = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=retriever,
    memory=memory
)
```

## Troubleshooting Comum

**Problema:** Respostas irrelevantes
- **Solução:** Aumentar `chunk_overlap`, usar reranking, melhorar prompt

**Problema:** Muita latência
- **Solução:** Usar SLM (Mistral), cache de embeddings, batch processing

**Problema:** Alucinações
- **Solução:** Adicionar constraint "responda apenas baseado no contexto"

## Custo Estimado

| Operação | Custo |
|----------|-------|
| 1000 embeddings (text-embedding-3-large) | ~$0.02 |
| 1000 queries (gpt-3.5-turbo) | ~$0.20 |
| **Total mensal (10K queries)** | **~$20-30** |

## Recursos

- [LangChain Docs](https://python.langchain.com/)
- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [FAISS Vector DB](https://github.com/facebookresearch/faiss)
- [RAG Paper Original](https://arxiv.org/abs/2005.11401)
