import { select, input } from '@inquirer/prompts';
import { apiClient } from '../apiClient';
import { clearScreen, pressEnterToContinue, handleError } from '../utils';

const ENDPOINT = '/pedidos';

export async function menuPedido() {
    let sair = false;
    while (!sair) {
        clearScreen();
        const opcao = await select({
            message: 'Gerenciamento de Pedidos:',
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
                    const valor_total = await input({ message: 'Valor Total:' });
                    const id_cliente = await input({ message: 'ID Cliente:' });
                    await apiClient.post(ENDPOINT, { valor_total: parseFloat(valor_total), id_cliente });
                    console.log('\n✅ Cadastrado com sucesso!');
                    await pressEnterToContinue();
                    break;
                case '4':
                    const idAtualizar = await input({ message: 'Digite o ID a atualizar:' });
                    const atual = await apiClient.get(`${ENDPOINT}/${idAtualizar}`);
                    
                    const nValor = await input({ message: 'Valor Total:', default: String(atual.valor_total) });
                    const nCli = await input({ message: 'ID Cliente:', default: String(atual.id_cliente) });

                    await apiClient.put(`${ENDPOINT}/${idAtualizar}`, { 
                        valor_total: parseFloat(nValor), 
                        id_cliente: parseInt(nCli) 
                    });
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