import sys
import matplotlib.pyplot as plt
import json

def gerar_grafico(tipo, dados):
    plt.figure(figsize=(10, 7))
    
    # Inverter a ordem para coincidir com a tabela
    dados_ordenados = dados[::-1] 
    
    try:
        if tipo == "produtos":
            nomes = [d['nome'] for d in dados_ordenados]
            valores = [float(d['total_vendido']) for d in dados_ordenados]
            plt.bar(nomes, valores, color='skyblue')
            plt.title('Top Produtos Mais Vendidos')
            plt.xticks(rotation=45, ha='right')
        
        elif tipo == "doacoes":
            nomes = [d['nome'] for d in dados_ordenados]
            valores = [float(d['total_doado']) for d in dados_ordenados]
            plt.bar(nomes, valores, color='lightgreen')
            plt.title('Doações por Instituição')
            plt.xticks(rotation=45, ha='right')
            
        elif tipo == "desperdicios":
            nomes = [d['descricao'] for d in dados_ordenados]
            # O erro estava aqui: forçamos a conversão para float
            valores = [float(d['total_desperdicio']) for d in dados_ordenados]
            plt.pie(valores, labels=nomes, autopct='%1.1f%%', startangle=140)
            plt.title('Desperdícios por Motivo')

        plt.subplots_adjust(bottom=0.25) 
        plt.savefig('grafico_temp.png')
        print("Sucesso: Gráfico salvo como 'grafico_temp.png'")
        
    except Exception as e:
        print(f"Erro detalhado no Python: {e}")
        sys.exit(1) # Força um erro para o TS capturar

if __name__ == "__main__":
    tipo = sys.argv[1]
    dados = json.loads(sys.argv[2])
    gerar_grafico(tipo, dados)