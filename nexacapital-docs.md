# NexaCapital - Documentação do Sistema
Versão 1.0

## 1. Visão Geral do Sistema
Sistema de gestão de capital com foco em análise de estoque e capital de giro.

### 1.1 Objetivos Principais
- Gestão de estoque com visão financeira
- Controle de capital de giro
- Análise de performance por comprador
- Assistente virtual para suporte à decisão

## 2. Regras de Negócio

### 2.1 Cálculos Base
- **Estoque Base (Histórico):** Média de faturamento últimos 3 meses (30 dias)
- **Estoque Ideal:** (Meta Mensal ÷ 30) × Dias de Estoque Definido
- **Valor Aceitável:** R$ 233 milhões
- **Gap Máximo:** R$ 40 milhões

### 2.2 Capital de Giro
- **Cálculo:** (Saldo em Estoque - Recebido) - Caixa Empresa (20%)
- **Período de Análise:** 90 dias
- **Atualização:** Diária às 8h

### 2.3 Métricas por Categoria
- Distribuição baseada no faturamento médio (últimos 3 meses)
- Alimentos
- Limpeza
- Bebidas
- Perfumaria
- Higiene Pessoal
- Bazar

## 3. Estrutura de Dados

### 3.1 Dados Diários (Dia 0)
- Estoque atual
- Títulos a vencer
- Títulos a receber
- Posição de capital de giro
- Produtos sem giro (5+ dias)

### 3.2 Dados Históricos (90 dias)
- Totalizadores diários de pagamentos
- Totalizadores diários de recebimentos
- Posições de estoque
- Capital de giro utilizado
- Margens realizadas

## 4. Interfaces do Sistema

### 4.1 Dashboard Principal
- Métricas principais
- Visão consolidada
- Atualização diária (8h)

### 4.2 Área do Comprador
- Projeção vs meta
- Estoque por fornecedor
- Análise de margem
- Giro financeiro
- Consumo de caixa/financiamento

### 4.3 Assistente Virtual
- Consultas sob demanda
- Análises baseadas no histórico
- Sem alertas automáticos

## 5. Atualizações e Processamento

### 5.1 Rotina Diária
- Atualização às 8h
- Base no último inventário
- Processamento de movimentações
- Cálculo de indicadores

### 5.2 Histórico
- Manutenção de 90 dias
- Consolidação diária
- Sem detalhamento após dia 1

## 6. Controle de Acesso
- Perfil Gestor
- Perfil Comprador
- Visualizações específicas por perfil
- Restrições por categoria

## 7. Próximos Passos
1. Desenvolvimento de mockups
2. Validação de interfaces
3. Implementação de regras
4. Desenvolvimento do assistente
5. Testes integrados

## 8. Observações Importantes
- Sem tratamento de pontes de feriados
- Dias úteis consideram feriados nacionais e regionais
- Foco em visão financeira do estoque
- Prioridade para controle de capital de giro
