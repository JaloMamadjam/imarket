import { select, input } from '@inquirer/prompts';
import { apiClient } from '../apiClient';
import { clearScreen, pressEnterToContinue, handleError } from '../utils';

export async function menuMovimentacao() {
    let sair = false;
    while (!sair) {
        clearScreen();
        const opcao = await select({
            message: 'Movimentação de Estoque:',
            choices: [
                { name: '[1] Entrada (Registrar novo lote)', value: 'entrada' },
                { name: '[2] Saída (Doação ou Descarte)', value: 'saida' },
                { name: '[3] Ajuste (Corrigir quantidade de um lote)', value: 'ajuste' },
                { name: '[0] Voltar', value: '0' },
            ],
        });

        try {
            switch (opcao) {
                case 'entrada':
                    console.log('\n--- ENTRADA DE ESTOQUE ---');
                    const idProdEntrada = await input({ message: 'ID do Produto:' });
                    const qtdEntrada = await input({ message: 'Quantidade recebida:' });
                    const validade = await input({ message: 'Data de Validade (YYYY-MM-DD):' });
                    
                    // Entrada de estoque = Criar um Lote
                    await apiClient.post('/lotes', { 
                        quantidade: parseInt(qtdEntrada), 
                        data_validade: validade, 
                        id_produto: parseInt(idProdEntrada) 
                    });
                    console.log('\n✅ Entrada registrada (Lote criado)!');
                    await pressEnterToContinue();
                    break;

                case 'saida':
                    console.log('\n--- SAÍDA DE ESTOQUE ---');
                    const tipoSaida = await select({
                        message: 'Qual é o destino desta saída?',
                        choices: [
                            { name: 'Doação', value: 'doacao' },
                            { name: 'Desperdício / Descarte', value: 'desperdicio' },
                        ]
                    });

                    if (tipoSaida === 'doacao') {
                        const instId = await input({ message: 'ID da Instituição recebedora:' });
                        const prodId = await input({ message: 'ID do Produto:' });
                        const qtdDoada = await input({ message: 'Quantidade:' });
                        const dataDoacao = new Date().toISOString().split('T')[0]; // Data de hoje

                        await apiClient.post('/doacoes', {
                            data_doacao: dataDoacao,
                            quantidade: parseInt(qtdDoada),
                            id_instituicao: parseInt(instId),
                            id_produto: parseInt(prodId)
                        });
                        console.log('\n✅ Saída registrada como Doação!');
                    } else {
                        const loteId = await input({ message: 'ID do Lote perdido:' });
                        const prodId = await input({ message: 'ID do Produto:' });
                        const motivoId = await input({ message: 'ID do Motivo do desperdício:' });
                        const qtdDesp = await input({ message: 'Quantidade:' });
                        const dataDesp = new Date().toISOString().split('T')[0];

                        await apiClient.post('/desperdicios', {
                            quantidade: parseInt(qtdDesp),
                            data_desp: dataDesp,
                            id_produto: parseInt(prodId),
                            id_desperdicio: parseInt(motivoId) // Motivo
                        });
                        console.log('\n✅ Saída registrada como Desperdício!');
                    }
                    await pressEnterToContinue();
                    break;

                case 'ajuste':
                    console.log('\n--- AJUSTE DE ESTOQUE ---');
                    const idLoteAjuste = await input({ message: 'ID do Lote a ser ajustado:' });
                    
                    // Pega os dados atuais para não sobrescrever
                    const loteAtual = await apiClient.get(`/lotes/${idLoteAjuste}`);
                    const novaQtd = await input({ message: `Quantidade (Atual: ${loteAtual.quantidade}):`, default: String(loteAtual.quantidade) });
                    const dataLimpa = loteAtual.data_validade ? loteAtual.data_validade.split('T')[0] : '';
                    
                    await apiClient.put(`/lotes/${idLoteAjuste}`, {
                        quantidade: parseInt(novaQtd),
                        data_validade: dataLimpa,
                        id_produto: loteAtual.id_produto
                    });
                    console.log('\n✅ Estoque ajustado com sucesso!');
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