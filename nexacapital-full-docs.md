# NexaCapital - Documentação Completa do Projeto
Versão 1.1

## 1. Visão Geral do Sistema

### 1.1 Objetivo
Sistema de gestão de capital focado em análise de estoque e capital de giro, com atualizações diárias e assistente virtual para suporte à decisão.

### 1.2 Principais Funcionalidades
- Gestão de estoque com visão financeira
- Controle de capital de giro
- Análise de performance por comprador
- Assistente virtual para suporte

## 2. Regras de Negócio

### 2.1 Cálculos Principais
- **Estoque Base:** Histórico de 3 meses (30 dias)
- **Estoque Ideal:** (Meta Mensal ÷ 30) × Dias de Estoque
- **Valor Aceitável:** R$ 233 milhões
- **Gap Máximo:** R$ 40 milhões

### 2.2 Capital de Giro
- **Base de Cálculo:** (Saldo em Estoque - Recebido) - Caixa Empresa (20%)
- **Horizonte de Análise:** 90 dias
- **Atualização:** Diária às 8h
- **Dias de Estoque:** Definido mensalmente conforme meta

### 2.3 Categorias do Sistema
1. Alimentos
2. Limpeza
3. Bebidas
4. Perfumaria
5. Higiene Pessoal
6. Bazar

## 3. Estrutura de Dados

### 3.1 Dados Atuais (Dia 0)
- Estoque atual
- Títulos a vencer
- Recebimentos previstos
- Capital de giro disponível
- Produtos sem giro (5+ dias)
- Meta mensal
- Dias de estoque definidos

### 3.2 Histórico (90 dias)
- Movimentações consolidadas
- Posições de estoque
- Resultados de capital de giro
- Margens realizadas
- Apenas totalizadores após dia 1

### 3.3 Cálculos de Projeção
- Base: Dias úteis reais
- Consideração: Feriados nacionais e regionais
- Sem pontes de feriados
- Atualização diária às 8h

## 4. Métricas e Indicadores

### 4.1 Métricas por Comprador
- Projeção vs meta
- Estoque por fornecedor
- Margem por produto/fornecedor
- Giro financeiro da linha
- Consumo de caixa/financiamento

### 4.2 Indicadores de Performance
- % Ocupação do Gap
- Dias de Estoque
- Saúde Financeira
- Tendência de Atingimento

## 5. Interface do Sistema

### 5.1 Layout Principal
- Header fixo (56px)
- Sidebar colapsável
- Área de conteúdo adaptável
- Status bar com métricas principais

### 5.2 Responsividade
- Desktop: Menu lateral expansível
- Mobile: Menu overlay
- Adaptação automática de conteúdo
- Reorganização de elementos conforme dispositivo

### 5.3 Componentes Principais
- Dashboard de métricas
- Área do comprador
- Consulta ao assistente
- Análise histórica
- Gestão de capital de giro

## 6. Processamento e Atualizações

### 6.1 Rotina Diária
- Horário: 8h
- Processamento de movimentações
- Atualização de indicadores
- Recálculo de projeções

### 6.2 Histórico
- Manutenção: 90 dias
- Consolidação diária
- Base no último inventário
- Sem detalhamento após dia 1

## 7. Controle de Acesso
- Perfil Gestor
- Perfil Comprador
- Visões específicas por perfil
- Restrições por categoria

## 8. Assistente Virtual

### 8.1 Funcionalidades
- Consultas sob demanda
- Análises baseadas no histórico
- Suporte à decisão
- Sem alertas automáticos

### 8.2 Tipos de Consulta
- Status atual
- Análises comparativas
- Tendências
- Recomendações

## 9. Próximas Etapas
1. Validação de mockups
2. Desenvolvimento de componentes
3. Implementação de regras de negócio
4. Desenvolvimento do assistente
5. Testes integrados
6. Homologação
7. Implantação

## 10. Considerações Técnicas
- Framework: React
- Estilização: Tailwind CSS
- Responsividade: Mobile First
- Acessibilidade: Padrões WCAG
- Performance: Otimização de renderização

## 11. Observações Importantes
- Sem tratamento de pontes de feriados
- Cálculos baseados em dias úteis reais
- Foco em visão financeira
- Prioridade para controle de capital de giro
- Atualização única diária
