// cli/relatorios/relatorios.ts
import { select } from '@inquirer/prompts';
import { apiClient } from '../apiClient';
import { clearScreen, pressEnterToContinue, handleError } from '../utils';
import { gerarGraficoPython } from './pythonRunner';

export async function menuRelatorios() {
    let sair = false;
    while (!sair) {
        clearScreen();
        const opcao = await select({
            message: 'Relatórios e Consultas:',
            choices: [
                { name: '[1] Produtos Mais Vendidos', value: 'produtos' },
                { name: '[2] Doações por Instituição', value: 'doacoes' },
                { name: '[3] Desperdícios por Motivo', value: 'desperdicios' },
                { name: '[0] Voltar', value: '0' },
            ],
        });

        if (opcao === '0') { 
            sair = true; 
            continue; 
        }

        try {
            const endpointMap: Record<string, string> = {
                'produtos': '/relatorios/produtos-mais-vendidos',
                'doacoes': '/relatorios/doacoes-por-instituicao',
                'desperdicios': '/relatorios/desperdicios-por-motivo'
            };

            console.log('\n⏳ A carregar dados do servidor...');
            const dados = await apiClient.get(endpointMap[opcao]);
            
            if (!dados || dados.length === 0) {
                console.log('⚠️ Nenhum dado encontrado para este relatório.');
            } else {
                // Exibe a tabela no terminal
                console.log('\n--- Dados do Relatório ---');
                console.table(dados);
                
                // Gera o gráfico
                console.log('⏳ A gerar ficheiro de imagem do gráfico...');
                await gerarGraficoPython(opcao, dados);
                console.log('✅ Gráfico gerado com sucesso: "grafico_temp.png"');
            }
            
            await pressEnterToContinue();
        } catch (error) {
            handleError(error);
            await pressEnterToContinue();
        }
    }
}