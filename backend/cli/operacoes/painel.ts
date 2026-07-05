import { apiClient } from '../apiClient';
import { clearScreen, pressEnterToContinue, handleError } from '../utils';

export async function exibirPainel() {
    clearScreen();
    console.log('⏳ Carregando Painel Operacional...');

    try {
        // Dispara todas as requisições em paralelo para ser muito mais rápido!
        const [produtos, pedidos, doacoes, lotes, desperdicios] = await Promise.all([
            apiClient.get('/produtos').catch(() => []),
            apiClient.get('/pedidos').catch(() => []),
            apiClient.get('/doacoes').catch(() => []),
            apiClient.get('/lotes').catch(() => []),
            apiClient.get('/desperdicios').catch(() => [])
        ]);

        // Lógica para itens próximos ao vencimento (vencem em até 30 dias)
        const hoje = new Date();
        const trintaDias = new Date();
        trintaDias.setDate(hoje.getDate() + 30);

        const itensProximosVencimento = lotes.filter((lote: any) => {
            if (!lote.data_validade) return false;
            const validade = new Date(lote.data_validade);
            return validade >= hoje && validade <= trintaDias;
        }).length;

        // Lógica para desperdício do mês atual
        const mesAtual = hoje.getMonth();
        const anoAtual = hoje.getFullYear();
        const desperdicioMes = desperdicios.filter((desp: any) => {
            if (!desp.data_desp) return false;
            const dataDesp = new Date(desp.data_desp);
            return dataDesp.getMonth() === mesAtual && dataDesp.getFullYear() === anoAtual;
        }).length;

        clearScreen();
        console.log('========================================');
        console.log('         PAINEL OPERACIONAL             ');
        console.log('========================================\n');
        
        console.log(`📦 Produtos cadastrados:          ${produtos.length}`);
        console.log(`📋 Pedidos registrados:           ${pedidos.length}`);
        console.log(`🤝 Doações realizadas:            ${doacoes.length}`);
        console.log(`⚠️  Itens próximos do vencimento:  ${itensProximosVencimento}`);
        console.log(`🗑️  Desperdícios (neste mês):      ${desperdicioMes}\n`);
        
        console.log('========================================');

    } catch (error) {
        handleError(error);
    }

    await pressEnterToContinue();
}