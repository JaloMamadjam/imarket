import { select, input } from '@inquirer/prompts';
import { apiClient } from '../apiClient';
import { clearScreen, pressEnterToContinue, handleError } from '../utils';

const ENDPOINT = '/produtos';

export async function menuProduto() {
    let sair = false;
    while (!sair) {
        clearScreen();
        const opcao = await select({
            message: 'Gerenciamento de Produtos:',
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
                    const nome = await input({ message: 'Nome do produto:' });
                    const preco = await input({ message: 'Preço:' });
                    const id_categoria = await input({ message: 'ID da Categoria:' });
                    await apiClient.post(ENDPOINT, { nome, preco: parseFloat(preco), id_categoria });
                    console.log('\n✅ Cadastrado com sucesso!');
                    await pressEnterToContinue();
                    break;
                case '4':
                    const idAtualizar = await input({ message: 'Digite o ID a atualizar:' });
                    const atual = await apiClient.get(`${ENDPOINT}/${idAtualizar}`);
                    
                    const nNome = await input({ message: 'Nome:', default: atual.nome });
                    const nPreco = await input({ message: 'Preço:', default: String(atual.preco) });
                    const nCat = await input({ message: 'ID Categoria:', default: String(atual.id_categoria) });

                    await apiClient.put(`${ENDPOINT}/${idAtualizar}`, { 
                        nome: nNome, 
                        preco: parseFloat(nPreco), 
                        id_categoria: parseInt(nCat) 
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