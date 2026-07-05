import { select, input } from '@inquirer/prompts';
import { apiClient } from '../apiClient';
import { clearScreen, pressEnterToContinue, handleError } from '../utils';
import { menuMovimentacao } from './movimentacao';
import { exibirPainel } from './painel';

export async function menuOperacoes() {
    let sair = false;
    while (!sair) {
        clearScreen();
        const opcao = await select({
            message: 'Operações do Sistema:',
            choices: [
                { name: '[1] Movimentação de Estoque', value: '1' },
                { name: '[2] Adicionar Item a um Pedido', value: '2' },
                { name: '[3] Consultar Stock de um Produto', value: '3' },
                { name: '[4] Vincular Fornecedor a um Produto', value: '4' },
                { name: '[5] Painel Operacional', value: '5' },
                { name: '[0] Voltar', value: '0' },
            ],
        });

        try {
            switch (opcao) {
                case '1':
                    await menuMovimentacao();
                    break;

                case '2':
                    console.log('\n--- Adicionar Item ao Pedido ---');
                    const idPedido = await input({ message: 'ID do Pedido:' });
                    const idProduto = await input({ message: 'ID do Produto:' });
                    const quantidade = await input({ message: 'Quantidade do item:' });
                    const preco = await input({ message: 'Preço Unitário:' });

                    await apiClient.post(`/pedidos/${idPedido}/itens`, {
                        id_produto: parseInt(idProduto),
                        quantidade: parseInt(quantidade),
                        preco_unitario: parseFloat(preco)
                    });
                    
                    console.log('\n✅ Item adicionado ao pedido com sucesso!');
                    await pressEnterToContinue();
                    break;

                case '3':
                    console.log('\n--- Consultar Estoque ---');
                    const idProdEstoque = await input({ message: 'ID do Produto:' });
                    console.log('⏳ Consultando os armazéns...');
                    
                    const estoque = await apiClient.get(`/produtos/${idProdEstoque}/estoque`);
                    
                    if (estoque.length === 0) {
                        console.log('\nℹ️ Este produto não possui estoque registrado em nenhum armazém.');
                    } else {
                        console.log(`\n📦 Estoque atual para o Produto [ID: ${idProdEstoque}]:`);
                        console.table(estoque);
                    }
                    await pressEnterToContinue();
                    break;

                case '4':
                    console.log('\n--- Vincular Fornecedor ---');
                    const idProdForn = await input({ message: 'ID do Produto:' });
                    const idForn = await input({ message: 'ID do Fornecedor:' });

                    await apiClient.post(`/produtos/${idProdForn}/fornecedores`, {
                        id_fornecedor: parseInt(idForn)
                    });
                    
                    console.log('\n✅ Fornecedor vinculado ao produto com sucesso!');
                    await pressEnterToContinue();
                    break;

                case '5':
                    await exibirPainel();
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