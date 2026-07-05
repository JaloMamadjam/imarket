// cli/setup/setup.ts
import { select } from '@inquirer/prompts';
import { apiClient } from '../apiClient';
import { clearScreen, pressEnterToContinue, handleError } from '../utils';

export async function menuSetup() {
    let sair = false;
    while (!sair) {
        clearScreen();
        const opcao = await select({
            message: 'Setup do Banco de Dados:',
            choices: [
                { name: '[1] Popular banco de dados (Seed)', value: 'seed' },
                { name: '[2] Limpar banco de dados (Reset)', value: 'reset' },
                { name: '[0] Voltar', value: 'voltar' },
            ],
        });

        try {
            switch (opcao) {
                case 'seed':
                    console.log('⏳ Populando o banco de dados com dados iniciais...');
                    await apiClient.post('/setup/init', {});
                    console.log('✅ Banco populado com sucesso!');
                    await pressEnterToContinue();
                    break;
                case 'reset':
                    console.log('⏳ Apagando todos os dados do banco...');
                    await apiClient.post('/setup/reset', {});
                    console.log('✅ Banco de dados resetado!');
                    await pressEnterToContinue();
                    break;
                case 'voltar':
                    sair = true;
                    break;
            }
        } catch (error) {
            handleError(error);
            await pressEnterToContinue();
        }
    }
}