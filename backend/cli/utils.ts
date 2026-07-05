// cli/utils.ts
import { input } from '@inquirer/prompts';

export function clearScreen() {
    console.clear();
}

export async function pressEnterToContinue() {
    await input({ message: 'Pressione Enter para continuar...' });
}

export function handleError(error: any) {
    console.error('\n❌ Ocorreu um erro na operação:');
    console.error(error instanceof Error ? error.message : error);
}