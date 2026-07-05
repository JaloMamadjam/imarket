import { select, input } from '@inquirer/prompts';
import { apiClient } from '../apiClient';
import { clearScreen, pressEnterToContinue, handleError } from '../utils';

const ENDPOINT = '/desperdicios';

export async function menuDesperdicio() {
    let sair = false;
    while (!sair) {
        clearScreen();
        const opcao = await select({
            message: 'Gerenciamento de Desperdícios:',
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
                    const idBusca = await input({ message: 'Digite o ID (id_prod_motivo):' });
                    const item = await apiClient.get(`${ENDPOINT}/${idBusca}`);
                    console.table([item]);
                    await pressEnterToContinue();
                    break;
                case '3':
                    const quantidade = await input({ message: 'Quantidade desperdiçada:' });
                    const data_desp = await input({ message: 'Data (YYYY-MM-DD):' });
                    const id_produto = await input({ message: 'ID Produto:' });
                    const id_desperdicio = await input({ message: 'ID Motivo (Desperdício):' });
                    
                    await apiClient.post(ENDPOINT, { 
                        quantidade: parseInt(quantidade), 
                        data_desp, 
                        id_produto, 
                        id_desperdicio 
                    });
                    console.log('\n✅ Cadastrado com sucesso!');
                    await pressEnterToContinue();
                    break;
                case '4':
                    const idAtualizar = await input({ message: 'Digite o ID a atualizar:' });
                    const atual = await apiClient.get(`${ENDPOINT}/${idAtualizar}`);
                    
                    const dataLimpa = atual.data_desp ? atual.data_desp.split('T')[0] : '';

                    const nQtd = await input({ message: 'Quantidade:', default: String(atual.quantidade) });
                    const nData = await input({ message: 'Data:', default: dataLimpa });
                    const nProd = await input({ message: 'ID Produto:', default: String(atual.id_produto) });
                    const nMot = await input({ message: 'ID Motivo:', default: String(atual.id_desperdicio) });

                    await apiClient.put(`${ENDPOINT}/${idAtualizar}`, { 
                        quantidade: parseInt(nQtd), 
                        data_desp: nData, 
                        id_produto: parseInt(nProd), 
                        id_desperdicio: parseInt(nMot) 
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