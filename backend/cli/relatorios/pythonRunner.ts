import { spawn } from 'child_process';
import path from 'path';

export function gerarGraficoPython(tipo: string, dados: any): Promise<void> {
    return new Promise((resolve, reject) => {
        const scriptPath = path.resolve(__dirname, `../python/grafico.py`);
        const dadosJson = JSON.stringify(dados);
        
        const pyProcess = spawn('python3', [scriptPath, tipo, dadosJson]);

        pyProcess.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Erro ao gerar gráfico`));
        });
    });
}