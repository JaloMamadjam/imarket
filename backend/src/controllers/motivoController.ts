import { Request, Response } from "express";
import { db } from "../database/db";

// GET /motivos
export const listarMotivos = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await db.query(
      "SELECT * FROM motivo_desperd ORDER BY descricao"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao listar motivos"
    });
  }
};

// GET /motivos/:id
export const buscarMotivo = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      SELECT *
      FROM motivo_desperd
      WHERE id_desperdicio = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Motivo não encontrado"
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao buscar motivo"
    });
  }
};

// POST /motivos
export const criarMotivo = async (
  req: Request,
  res: Response
) => {
  try {
    const { descricao } = req.body;

    const result = await db.query(
      `
      INSERT INTO motivo_desperd (descricao)
      VALUES ($1)
      RETURNING *
      `,
      [descricao]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao criar motivo"
    });
  }
};

// PUT /motivos/:id
export const atualizarMotivo = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { descricao } = req.body;

    const result = await db.query(
      `
      UPDATE motivo_desperd
      SET descricao = $1
      WHERE id_desperdicio = $2
      RETURNING *
      `,
      [descricao, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Motivo não encontrado"
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao atualizar motivo"
    });
  }
};

// DELETE /motivos/:id
export const deletarMotivo = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      DELETE FROM motivo_desperd
      WHERE id_desperdicio = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Motivo não encontrado"
      });
    }

    res.status(200).json({
      mensagem: "Motivo removido com sucesso"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao remover motivo"
    });
  }
};

 
// GET /motivos/com-desperdicios
// Retorna cada motivo com seus registros de desperdício aninhados
export const listarMotivosComDesperdicios = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await db.query(`
      SELECT
        m.id_desperdicio,
        m.descricao AS motivo,
        COALESCE(
          json_agg(
            json_build_object(
              'id_prod_motivo', pm.id_prod_motivo,
              'data_desp',      pm.data_desp,
              'quantidade',     pm.quantidade,
              'id_produto',     pm.id_produto,
              'produto',        p.nome
            )
          ) FILTER (WHERE pm.id_prod_motivo IS NOT NULL),
          '[]'
        ) AS desperdicios
      FROM motivo_desperd m
      LEFT JOIN prod_motivo pm ON pm.id_desperdicio = m.id_desperdicio
      LEFT JOIN produto      p  ON p.id_produto     = pm.id_produto
      GROUP BY m.id_desperdicio, m.descricao
      ORDER BY m.descricao
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao listar motivos com desperdícios" });
  }
};
 
