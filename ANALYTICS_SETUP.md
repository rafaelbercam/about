# Setup de Analytics e Busca

## 🔍 Google Analytics 4

### 1. Criar conta GA4
- Acesse [Google Analytics](https://analytics.google.com/)
- Crie uma nova propriedade (ou use existente)
- Configure para seu site: `https://rafaelbercam.github.io/about/`

### 2. Pegar o Tracking ID
- Vá para **Admin** → **Properties** → **Data Streams**
- Clique no seu data stream
- Copie o **Measurement ID** (começa com `G-`)

### 3. Adicionar ao config
```javascript
plugins: [
  [
    '@docusaurus/plugin-google-gtag',
    {
      trackingID: 'G-XXXXXXXXXX', // Cole aqui
      anonymizeIP: true,
    },
  ],
],
```

### 4. Verificar
- Deploy o site
- Acesse seu site
- Vá a Google Analytics > Real time
- Você deve ver uma sessão ativa

---

## 🔎 DocSearch (Busca)

### 1. Registrar seu site
- Acesse [DocSearch](https://docsearch.algolia.com/)
- Clique em "Apply"
- Preencha o formulário (leva ~48h para aprovação)

**Alternativa:** Use `@docusaurus/search-local` se não quiser DocSearch

### 2. Receber credenciais
- Você receberá um email com:
  - `appId`
  - `apiKey` (search-only key)
  - `indexName`

### 3. Adicionar ao config
```javascript
algolia: {
  appId: 'XXXXXXXXXX',
  apiKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
  indexName: 'rafaelbercam',
  contextualSearch: true,
  searchParameters: {},
},
```

### 4. Verificar
- Deploy o site
- Procure pela **barra de busca** (aparece na navbar quando DocSearch está ativo)
- Teste uma busca

---

## 📊 Visualizar Dados

### Google Analytics
- Acesse seu painel GA4
- Vá em **Reports** → **Engagement** → **Pages and screens**
- Veja qual conteúdo é mais lido

### DocSearch
- Acesse [Algolia Dashboard](https://dashboard.algolia.com/)
- Veja estatísticas de busca do seu index

---

## ⏱️ Próximos Passos

1. ✅ Copiar IDs de GA4 e DocSearch
2. ✅ Fazer push das mudanças
3. ✅ Deploy
4. ✅ Aguardar ~48h para DocSearch (se pedido)
5. ✅ Verificar dados após 24h

**Nota:** Analytics levam ~24h para começar a mostrar dados reais.
