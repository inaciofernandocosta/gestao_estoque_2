import pandas as pd
import os
from datetime import datetime

def try_read_csv(file_path):
    """
    Tenta ler o arquivo CSV com diferentes encodings
    """
    encodings = ['utf-8', 'latin1', 'iso-8859-1', 'cp1252']
    
    for encoding in encodings:
        try:
            # Lê o arquivo sem cabeçalho primeiro para verificar a estrutura
            df = pd.read_csv(file_path, encoding=encoding, header=None, low_memory=False)
            
            # Pega os nomes das colunas da primeira linha
            headers = df.iloc[0].str.strip().tolist()
            
            # Lê o arquivo novamente com os headers corretos e configurações específicas
            df = pd.read_csv(file_path, 
                           encoding=encoding, 
                           skiprows=1, 
                           names=headers, 
                           low_memory=False,
                           thousands='.',
                           decimal=',')
            
            return df
            
        except UnicodeDecodeError:
            continue
        except Exception as e:
            print(f"Erro ao tentar ler com {encoding}: {str(e)}")
    
    raise ValueError("Não foi possível ler o arquivo com nenhum dos encodings tentados")

def format_number(value):
    """
    Formata número com duas casas decimais e vírgula, sem separador de milhar
    """
    try:
        # Se o valor já é um número, apenas formata
        if isinstance(value, (int, float)):
            return f"{float(value):.2f}".replace('.', ',')
        
        # Se é string, limpa e converte
        if isinstance(value, str):
            value = ''.join(c for c in value if c.isdigit() or c in '.,')
            if ',' in value:
                value = value.replace('.', '').replace(',', '.')
            return f"{float(value):.2f}".replace('.', ',')
        
        return '0,00'
    except:
        return '0,00'

def format_custo_unit(value):
    """
    Formata o custo unitário com quatro casas decimais e vírgula
    """
    try:
        # Se o valor já é um número, apenas formata
        if isinstance(value, (int, float)):
            return f"{float(value):.4f}".replace('.', ',')
        
        # Se é string, limpa e converte
        if isinstance(value, str):
            value = ''.join(c for c in value if c.isdigit() or c in '.,')
            if ',' in value:
                value = value.replace('.', '').replace(',', '.')
            return f"{float(value):.4f}".replace('.', ',')
        
        return '0,0000'
    except:
        return '0,0000'

def process_stock_data(input_file):
    """
    Processa o arquivo de estoque e retorna um DataFrame com as colunas relevantes
    """
    try:
        # Lê o arquivo CSV
        df = try_read_csv(input_file)
        
        # Mostra as colunas disponíveis
        print("\nColunas encontradas no arquivo:")
        for i, col in enumerate(df.columns):
            print(f"{i+1}. {col}")
        
        # Mapeamento das colunas do arquivo para os nomes que queremos
        mapeamento_colunas = {
            'Código Produto': 'Código Pr-Y',
            'Produto : Empresa': 'Produto : Empresa',
            'Código Empresa': 'Código Ei',
            'Quantidade em Estoque': 'Quantidade em Estoque',
            'Valor Custo Líquido': 'Valor Custo Líquido',
            'Custo Liq. Unitário': 'Custo Líq. Unit-rio',
            'Qtd. Pend. Ped.Compra': 'Qtd. Pend. Ped.Compra',
            'Dias Ult. Entrada': 'Dias Ult. Entrada'
        }
        
        # Seleciona e renomeia as colunas
        df_tratado = df[list(mapeamento_colunas.keys())].copy()
        df_tratado = df_tratado.rename(columns=mapeamento_colunas)
        
        # Adiciona a coluna de data de processamento
        df_tratado['Data Processamen'] = datetime.now().strftime('%d/%m/%Y')
        
        # Converte o código do produto para inteiro
        df_tratado['Código Pr-Y'] = pd.to_numeric(df_tratado['Código Pr-Y'], errors='coerce').fillna(0).astype(int)
        
        # Formata as colunas numéricas
        df_tratado['Quantidade em Estoque'] = df_tratado['Quantidade em Estoque'].apply(format_number)
        df_tratado['Valor Custo Líquido'] = df_tratado['Valor Custo Líquido'].apply(format_number)
        df_tratado['Qtd. Pend. Ped.Compra'] = df_tratado['Qtd. Pend. Ped.Compra'].apply(format_number)
        df_tratado['Custo Líq. Unit-rio'] = df_tratado['Custo Líq. Unit-rio'].apply(format_custo_unit)
        
        # Converte Dias Ult. Entrada para inteiro
        df_tratado['Dias Ult. Entrada'] = pd.to_numeric(df_tratado['Dias Ult. Entrada'], errors='coerce').fillna(0).astype(int)
        
        # Trata valores nulos
        df_tratado = df_tratado.fillna({
            'Quantidade em Estoque': '0,00',
            'Valor Custo Líquido': '0,00',
            'Custo Líq. Unit-rio': '0,0000',
            'Qtd. Pend. Ped.Compra': '0,00',
            'Dias Ult. Entrada': 0
        })
        
        # Remove a última linha se for um total
        if df_tratado.iloc[-1]['Produto : Empresa'].startswith('TOTAL:'):
            df_tratado = df_tratado.iloc[:-1]
        
        # Gera o nome do arquivo de saída
        output_dir = os.path.join(os.path.dirname(input_file), 'processed')
        os.makedirs(output_dir, exist_ok=True)
        
        output_file = os.path.join(output_dir, 'estoque_atual_tratado.xlsx')
        
        # Salva o arquivo tratado
        df_tratado.to_excel(output_file, index=False)
        
        print(f"\nArquivo processado com sucesso: {output_file}")
        print(f"Total de registros processados: {len(df_tratado)}")
        
        # Mostra alguns registros para verificação
        print("\nPrimeiros registros do item 112007:")
        filtro = df_tratado['Código Pr-Y'] == 112007
        registros = df_tratado[filtro][['Código Pr-Y', 'Quantidade em Estoque', 'Valor Custo Líquido', 'Custo Líq. Unit-rio', 'Qtd. Pend. Ped.Compra', 'Dias Ult. Entrada', 'Data Processamen']]
        pd.set_option('display.max_columns', None)
        pd.set_option('display.expand_frame_repr', False)
        print(registros.head())
        
        return df_tratado, output_file
        
    except Exception as e:
        print(f"Erro ao processar arquivo: {str(e)}")
        return None, None

if __name__ == "__main__":
    # Caminho do arquivo de estoque
    input_file = "/Users/fernandocosta/Documents/2025/Gestao de estoque/Gestao de estoque.v01/bd/estoque atual.csv"
    
    if os.path.exists(input_file):
        df_tratado, output_file = process_stock_data(input_file)
    else:
        print("Arquivo não encontrado!")
