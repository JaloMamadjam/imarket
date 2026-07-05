import { select, input } from '@inquirer/prompts';
import { apiClient } from '../apiClient';
import { clearScreen, pressEnterToContinue, handleError } from '../utils';

const ENDPOINT = '/armazens';

export async function menuArmazem() {
    let sair = false;
    while (!sair) {
        clearScreen();
        const opcao = await select({
            message: 'Gerenciamento de Armazéns:',
            choices: [
                { name: '[1] Listar', value: '1' },
                { name: '[2] Buscar por ID', value: '2' },
                { name: '[3] Cadastrar', value: '3' },
                { name: '[4] Atualizar', value: '4' },
                { name: '[5] Excluir', value: '5' },
                { name: '[0] Voltar', value: '0' },
            ],
        });

        try {
            switch (opcao) {
                case '1':
                    console.log('⏳ Buscando...');
                    const lista = await apiClient.get(ENDPOINT);
                    console.table(lista);
                    await pressEnterToContinue();
                    break;
                case '2':
                    const idBusca = await input({ message: 'Digite o ID:' });
                    const item = await apiClient.get(`${ENDPOINT}/${idBusca}`);
                    console.table([item]);
                    await pressEnterToContinue();
                    break;
                case '3':
                    const local_armazem = await input({ message: 'Local/Nome do Armazém:' });
                    await apiClient.post(ENDPOINT, { local_armazem });
                    console.log('\n✅ Cadastrado com sucesso!');
                    await pressEnterToContinue();
                    break;
                case '4':
                    const idAtualizar = await input({ message: 'Digite o ID a atualizar:' });
                    const atual = await apiClient.get(`${ENDPOINT}/${idAtualizar}`);
                    
                    const nLocal = await input({ message: 'Local:', default: atual.local_armazem });

                    await apiClient.put(`${ENDPOINT}/${idAtualizar}`, { local_armazem: nLocal });
                    console.log('\n✅ Atualizado com sucesso!');
                    await pressEnterToContinue();
                    break;
                case '5':
                    const idExcluir = await input({ message: 'Digite o ID a excluir:' });
                    await apiClient.del(`${ENDPOINT}/${idExcluir}`);
                    console.log('\n✅ Excluído com sucesso!');
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