#!/bin/bash

# BMAD Project Setup Script
# Instala dependências BMAD e gera spec inicial

PROJECT_NAME="${1:-dietPlan}"

echo "🏗️  Configurando projeto BMAD: $PROJECT_NAME"
echo ""

# 1. Criar diretório do projeto
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

# 2. Inicializar npm
npm init -y > /dev/null

echo "📦 Instalando dependências BMAD..."

# 3. Instalar libs BMAD (escolha uma ou mais)
# Opção 1: Lib leve para inicialização
npm install --save-dev bmad-agent-init 2>/dev/null && echo "✅ bmad-agent-init instalado"

# Opção 2: Multi-LLM BMAD (mais robusto)
npm install --save-dev @papuman/bmad-buff 2>/dev/null && echo "✅ @papuman/bmad-buff instalado"

# Opção 3: MCP Server para BMAD
npm install --save-dev bmad-mcp-server 2>/dev/null && echo "✅ bmad-mcp-server instalado"

# 4. Instalar outras dependências úteis
echo "📦 Instalando dependências de desenvolvimento..."
npm install --save-dev typescript @types/node jest ts-jest 2>/dev/null

# 5. Criar estrutura de pastas
mkdir -p {src,tests,specs,docs}

# 6. Criar arquivo de configuração TypeScript
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
EOF

echo "✅ tsconfig.json criado"

# 7. Criar arquivo de configuração Jest
cat > jest.config.js << 'EOF'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts'],
};
EOF

echo "✅ jest.config.js criado"

# 8. Atualizar package.json com scripts
npx json -I -f package.json -e "this.scripts={
  'build': 'tsc',
  'test': 'jest',
  'spec': '../scripts/generate-bmad-spec.sh',
  'dev': 'ts-node src/index.ts'
}" 2>/dev/null

echo ""
echo "🎉 Projeto BMAD criado: $PROJECT_NAME"
echo ""
echo "📝 Próximos passos:"
echo "1. cd $PROJECT_NAME"
echo "2. Gerar spec: ../scripts/generate-bmad-spec.sh \"Meu Projeto\" \"Descrição\""
echo "3. Implementar agent em src/"
echo "4. Escrever testes em tests/"
echo "5. npm test"
echo ""
echo "📚 Docs:"
echo "- https://github.com/papuman/BMAD-BUFF"
echo "- https://github.com/snahrup/bmad-agent-windsurf"
