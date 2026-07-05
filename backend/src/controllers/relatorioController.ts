import { Request, Response } from "express";
import { db } from "../database/db";

// ==========================================
// CONSULTA 1 (Item 6 do relatório)
// Objetivo: identificar os produtos com maior volume de vendas,
// considerando apenas pedidos que já possuem pagamento registrado.
// Tabelas envolvidas: pedido_produto, produto, pedido, pagamento (4 tabelas)
// ==========================================
export const produtosMaisVendidos = async (
  req: Request,
  res: Response
) => {
  try {

    const result = await db.query(`
      SELECT
          p.nome AS nome,
          COUNT(DISTINCT ped.id_pedido) AS total_pedidos,
          SUM(pp.quantidade) AS total_vendido
      FROM pedido_produto pp
      JOIN produto p
          ON pp.id_produto = p.id_produto
      JOIN pedido ped
          ON pp.id_pedido = ped.id_pedido
      JOIN pagamento pag
          ON pag.id_pedido = ped.id_pedido
      GROUP BY p.id_produto, p.nome
      ORDER BY total_vendido DESC
    `);

    res.status(200).json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao gerar relatório"
    });

  }
};

// ==========================================
// CONSULTA 2 (Item 6 do relatório)
// Objetivo: identificar quais instituições mais recebem doações,
// incluindo a diversidade de produtos doados a cada uma.
// Tabelas envolvidas: doacao, instituicao, produto (3 tabelas)
// ==========================================
export const doacoesPorInstituicao = async (
  req: Request,
  res: Response
) => {

  try {

    const result = await db.query(`
      SELECT
          i.nome AS nome,
          COUNT(DISTINCT p.id_produto) AS produtos_diferentes,
          SUM(d.quantidade) AS total_doado
      FROM doacao d
      JOIN instituicao i
          ON d.id_instituicao = i.id_instituicao
      JOIN produto p
          ON d.id_produto = p.id_produto
      GROUP BY i.id_instituicao, i.nome
      ORDER BY total_doado DESC
    `);

    res.status(200).json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao gerar relatório"
    });

  }

};

// ==========================================
// CONSULTA 3 (Item 6 do relatório)
// Objetivo: identificar os principais motivos de desperdício e
// quantos produtos distintos são afetados por cada motivo.
// Tabelas envolvidas: prod_motivo, motivo_desperd, produto (3 tabelas)
// ==========================================
export const desperdiciosPorMotivo = async (
  req: Request,
  res: Response
) => {

  try {

    const result = await db.query(`
      SELECT
          md.descricao AS descricao,
          COUNT(DISTINCT p.id_produto) AS produtos_afetados,
          SUM(pm.quantidade) AS total_desperdicio
      FROM prod_motivo pm
      JOIN motivo_desperd md
          ON pm.id_desperdicio = md.id_desperdicio
      JOIN produto p
          ON pm.id_produto = p.id_produto
      GROUP BY md.id_desperdicio, md.descricao
      ORDER BY total_desperdicio DESC
    `);

    res.status(200).json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao gerar relatório"
    });

  }

};