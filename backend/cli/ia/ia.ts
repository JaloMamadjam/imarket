// cli/ia/ia.ts
import { select, input } from '@inquirer/prompts';
import { apiClient } from '../apiClient';
import { clearScreen, pressEnterToContinue, handleError } from '../utils';

export async function menuIa() {
    let sair = false;
    while (!sair) {
        clearScreen();
        const opcao = await select({
            message: '🤖 Módulo de Inteligência Artificial:',
            choices: [
                { name: '[1] Recomendar Doações (Análise de Vencimentos)', value: '1' },
                { name: '[2] Analisar Saúde do Estoque', value: '2' },
                { name: '[0] Voltar', value: '0' },
            ],
        });

        try {
            switch (opcao) {
                case '1':
                    console.log('\n⏳ A IA está analisando o banco de dados (Lotes próximos ao vencimento)...');
                    const respostaDoacao = await apiClient.get('/ia/recomendar-doacoes');
                    
                    console.log('\n--- Recomendação da IA ---\n');
                    console.log(respostaDoacao.recomendacao);
                    console.log('\n--------------------------\n');
                    await pressEnterToContinue();
                    break;

                case '2':
                    console.log('\n⏳ A IA está processando o panorama geral do seu estoque...');
                    const respostaEstoque = await apiClient.get('/ia/analisar-estoque');
                    
                    console.log('\n--- Análise de Estoque ---\n');
                    console.log(respostaEstoque.analise);
                    console.log('\n--------------------------\n');
                    await pressEnterToContinue();
                    break;

                case '0':
                    sair = true;
                    break;
            }
        } catch (error) {
            handleError(error);
            await pressEnterToContinue();
        }
    }
}