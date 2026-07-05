import { Request, Response } from "express";
import { db } from "../database/db";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!
});

export const recomendarDoacoes = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await db.query(`
      SELECT
          p.nome,
          l.quantidade,
          l.data_validade
      FROM lote l
      JOIN produto p
          ON l.id_produto = p.id_produto
      WHERE l.data_validade <= CURRENT_DATE + INTERVAL '30 days'
      ORDER BY l.data_validade
    `);

    const lotes = result.rows;

    if (lotes.length === 0) {
      return res.json({
        recomendacao:
          "Nenhum produto próximo ao vencimento."
      });
    }

    const prompt = `
Você é um especialista em ESG e redução de desperdício alimentar.

Analise os produtos abaixo:

${JSON.stringify(lotes, null, 2)}

Gere uma recomendação de doação.

Considere:
- urgência do vencimento
- quantidade disponível
- redução de desperdício

Responda em português.
Formate a resposta de forma EXTREMAMENTE concisa, ideal para ser lida em um terminal de linha de comando.
Use tópicos curtos.
Use emojis para destacar categorias (ex: 🔴 Crítico, 🟡 Atenção, 🟢 Bom, 💡 Recomendação).
Evite parágrafos longos.
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });

    res.status(200).json({
      lotes,
      recomendacao: response.text
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensagem: "Erro ao gerar recomendação"
    });
  }
};

export const analisarEstoque = async (
  req: Request,
  res: Response
) => {
  try {
    // 1. Busca um resumo do estoque atual agrupado por categoria
    const stockResult = await db.query(`
      SELECT 
        c.nome AS categoria, 
        SUM(l.quantidade) AS quantidade_total
      FROM lote l
      JOIN produto p ON l.id_produto = p.id_produto
      JOIN categoria c ON p.id_categoria = c.id_categoria
      GROUP BY c.nome
      ORDER BY quantidade_total DESC
    `);

    // 2. Busca um resumo dos desperdícios dos últimos 30 dias
    const wasteResult = await db.query(`
      SELECT 
        md.descricao AS motivo, 
        SUM(pm.quantidade) AS total_desperdicio
      FROM prod_motivo pm
      JOIN motivo_desperd md ON pm.id_desperdicio = md.id_desperdicio
      WHERE pm.data_desp >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY md.descricao
    `);

    const estoque = stockResult.rows;
    const desperdicios = wasteResult.rows;

    const prompt = `
Você é um especialista em Supply Chain, Logística e Gestão de Estoque.

Analise os dados reais do estoque e dos desperdícios recentes (últimos 30 dias) desta organização:

ESTOQUE ATUAL POR CATEGORIA:
${JSON.stringify(estoque, null, 2)}

DESPERDÍCIOS RECENTES:
${JSON.stringify(desperdicios, null, 2)}

Forneça uma análise concisa sobre a saúde do estoque. 
Destaque pontos de atenção (ex: muito desperdício por um motivo específico, desbalanceamento de categorias) e dê 3 recomendações práticas e diretas de melhoria.

Responda em português.
Formate a resposta de forma EXTREMAMENTE concisa, ideal para ser lida em um terminal de linha de comando.
Use tópicos curtos.
Use emojis para destacar categorias (ex: 🔴 Crítico, 🟡 Atenção, 🟢 Bom, 💡 Recomendação).
Evite parágrafos longos.
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });

    res.status(200).json({
      analise: response.text
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensagem: "Erro ao gerar análise de estoque"
    });
  }
};