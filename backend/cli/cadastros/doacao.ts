import { select, input } from '@inquirer/prompts';
import { apiClient } from '../apiClient';
import { clearScreen, pressEnterToContinue, handleError } from '../utils';

const ENDPOINT = '/doacoes';

export async function menuDoacao() {
    let sair = false;
    while (!sair) {
        clearScreen();
        const opcao = await select({
            message: 'Gerenciamento de Doações:',
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
                    const data_doacao = await input({ message: 'Data Doação (YYYY-MM-DD):' });
                    const quantidade = await input({ message: 'Quantidade:' });
                    const id_instituicao = await input({ message: 'ID Instituição:' });
                    const id_produto = await input({ message: 'ID Produto:' });
                    await apiClient.post(ENDPOINT, { data_doacao, quantidade: parseInt(quantidade), id_instituicao, id_produto });
                    console.log('\n✅ Cadastrado com sucesso!');
                    await pressEnterToContinue();
                    break;
                case '4':
                    const idAtualizar = await input({ message: 'Digite o ID a atualizar:' });
                    const atual = await apiClient.get(`${ENDPOINT}/${idAtualizar}`);
                    
                    const dataLimpa = atual.data_doacao ? atual.data_doacao.split('T')[0] : '';

                    const nData = await input({ message: 'Data:', default: dataLimpa });
                    const nQtd = await input({ message: 'Quantidade:', default: String(atual.quantidade) });
                    const nInst = await input({ message: 'ID Inst.:', default: String(atual.id_instituicao || '') });
                    const nProd = await input({ message: 'ID Produto:', default: String(atual.id_produto || '') });

                    await apiClient.put(`${ENDPOINT}/${idAtualizar}`, { 
                        data_doacao: nData, 
                        quantidade: parseInt(nQtd), 
                        id_instituicao: parseInt(nInst), 
                        id_produto: parseInt(nProd) 
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