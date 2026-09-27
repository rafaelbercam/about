#!/bin/bash

# BMAD Spec Generator usando Claude CLI
# Uso: ./generate-bmad-spec.sh "nome do projeto" "descrição breve"

if [ $# -lt 2 ]; then
    echo "Uso: ./generate-bmad-spec.sh \"Nome do Projeto\" \"Descrição\""
    echo "Exemplo: ./generate-bmad-spec.sh \"Diet Planner\" \"Agente que gera planos de dieta personalizados\""
    exit 1
fi

PROJECT_NAME="$1"
DESCRIPTION="$2"
OUTPUT_FILE="spec-${PROJECT_NAME// /-}.md"

echo "🚀 Gerando BMAD Spec para: $PROJECT_NAME"
echo "📝 Descrição: $DESCRIPTION"
echo ""

# Usar Claude CLI para gerar spec estruturada
claude "Crie uma especificação BMAD completa para o seguinte projeto:

**Nome do Projeto:** $PROJECT_NAME
**Descrição:** $DESCRIPTION

Use a estrutura:

# $PROJECT_NAME - Especificação BMAD

## Objetivo
[Defina o objetivo claro]

## Inputs
[Listar inputs estruturados]

## Behavior - Story Files

### Story 1: [Case de Uso 1]
Input: [exemplo de entrada]
Expected Output: [exemplo de saída esperada em JSON]

### Story 2: [Case de Uso 2]
Input: [exemplo de entrada]
Expected Output: [exemplo de saída esperada em JSON]

## Constraints
[Listar restrições e validações]

## Success Criteria
[Como validar que funcionou corretamente]

Seja específico, técnico e prático. Inclua exemplos JSON reais." > "$OUTPUT_FILE"

echo "✅ Especificação salva em: $OUTPUT_FILE"
echo ""
echo "Próximos passos:"
echo "1. Revisar e editar: cat $OUTPUT_FILE"
echo "2. Usar para implementação"
echo "3. Gerar testes baseados nas stories"
