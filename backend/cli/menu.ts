// cli/menu.ts
import { select } from '@inquirer/prompts';
import { clearScreen, pressEnterToContinue } from './utils';

// Importações dos submódulos de cadastros (CRUDs)
import { menuCategoria } from './cadastros/categoria';
import { menuCliente } from './cadastros/cliente';
import { menuProduto } from './cadastros/produto';
import { menuLote } from './cadastros/lote';
import { menuFornecedor } from './cadastros/fornecedor';
import { menuInstituicao } from './cadastros/instituicao';
import { menuArmazem } from './cadastros/armazem';
import { menuPedido } from './cadastros/pedido';
import { menuPagamento } from './cadastros/pagamento';
import { menuDoacao } from './cadastros/doacao';
import { menuDesperdicio } from './cadastros/desperdicio';
import { menuMotivo } from './cadastros/motivo';
import { menuOperacoes } from './operacoes/operacoes';

// Importações dos demais módulos do sistema
import { menuSetup } from './setup/setup';
import { menuIa } from './ia/ia';
import { menuRelatorios } from './relatorios/relatorios';


async function menuCadastros() {
    let sair = false;
    while (!sair) {
        clearScreen();
        const opcao = await select({
            message: 'Selecione o módulo de Cadastro:',
            choices: [
                { name: '[1] Categoria', value: 'categoria' },
                { name: '[2] Cliente', value: 'cliente' },
                { name: '[3] Produto', value: 'produto' },
                { name: '[4] Lote', value: 'lote' },
                { name: '[5] Fornecedor', value: 'fornecedor' },
                { name: '[6] Instituição', value: 'instituicao' },
                { name: '[7] Armazém', value: 'armazem' },
                { name: '[8] Pedido', value: 'pedido' },
                { name: '[9] Pagamento', value: 'pagamento' },
                { name: '[10] Doação', value: 'doacao' },
                { name: '[11] Desperdício', value: 'desperdicio' },
                { name: '[12] Motivo de Desperdício', value: 'motivo' },
                { name: '[0] Voltar', value: 'voltar' },
            ],
        });

        switch (opcao) {
            case 'categoria': await menuCategoria(); break;
            case 'cliente': await menuCliente(); break;
            case 'produto': await menuProduto(); break;
            case 'lote': await menuLote(); break;
            case 'fornecedor': await menuFornecedor(); break;
            case 'instituicao': await menuInstituicao(); break;
            case 'armazem': await menuArmazem(); break;
            case 'pedido': await menuPedido(); break;
            case 'pagamento': await menuPagamento(); break;
            case 'doacao': await menuDoacao(); break;
            case 'desperdicio': await menuDesperdicio(); break;
            case 'motivo': await menuMotivo(); break;
            case 'voltar': sair = true; break;
        }
    }
}

export async function mainMenu() {
    let sair = false;
    while (!sair) {
        clearScreen();
        const opcao = await select({
            message: 'MENU PRINCIPAL:',
            choices: [
                { name: '[1] Gerenciar cadastros', value: 'cadastros' },
                { name: '[2] Operações do sistema', value: 'operacoes' },
                { name: '[3] Relatórios / consultas', value: 'relatorios' },
                { name: '[4] IA generativa', value: 'ia' },
                { name: '[5] Setup do banco', value: 'setup' },
                { name: '[0] Sair', value: 'sair' },
            ],
        });

        switch (opcao) {
            case 'cadastros': 
                await menuCadastros(); 
                break;
            case 'operacoes':
                await menuOperacoes();
                break;
            case 'relatorios': 
                await menuRelatorios(); 
                break;
            case 'ia': 
                await menuIa(); 
                break;
            case 'setup': 
                await menuSetup(); 
                break;
            case 'sair':
                console.log('\nSaindo do sistema... Até logo!');
                sair = true;
                break;
        }
    }
}

// Inicialização automática do menu principal ao executar o arquivo
mainMenu();