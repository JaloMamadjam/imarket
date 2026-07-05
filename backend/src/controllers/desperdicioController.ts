import { Request, Response } from "express";
import { db } from "../database/db";

export const listarDesperdicios = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await db.query(`
      SELECT
        pm.id_prod_motivo,
        pm.quantidade,
        pm.data_desp,
        p.nome AS produto,
        m.descricao AS motivo,
        pm.id_produto,
        pm.id_desperdicio
      FROM prod_motivo pm
      JOIN produto p
        ON p.id_produto = pm.id_produto
      JOIN motivo_desperd m
        ON m.id_desperdicio = pm.id_desperdicio
      ORDER BY pm.id_prod_motivo
    `);

    res.json(result.rows);
  } catch {
    res.status(500).json({
      mensagem: "Erro ao listar desperdícios"
    });
  }
};

export const buscarDesperdicio = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  const result = await db.query(
    `
    SELECT *
    FROM prod_motivo
    WHERE id_prod_motivo = $1
    `,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      mensagem: "Desperdício não encontrado"
    });
  }

  res.json(result.rows[0]);
};

export const criarDesperdicio = async (
  req: Request,
  res: Response
) => {
  const {
    quantidade,
    data_desp,
    id_produto,
    id_desperdicio
  } = req.body;

  const result = await db.query(
    `
    INSERT INTO prod_motivo (
      quantidade,
      data_desp,
      id_produto,
      id_desperdicio
    )
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `,
    [
      quantidade,
      data_desp,
      id_produto,
      id_desperdicio
    ]
  );

  res.status(201).json(result.rows[0]);
};

export const atualizarDesperdicio = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  const {
    quantidade,
    data_desp,
    id_produto,
    id_desperdicio
  } = req.body;

  const result = await db.query(
    `
    UPDATE prod_motivo
    SET
      quantidade = $1,
      data_desp = $2,
      id_produto = $3,
      id_desperdicio = $4
    WHERE id_prod_motivo = $5
    RETURNING *
    `,
    [
      quantidade,
      data_desp,
      id_produto,
      id_desperdicio,
      id
    ]
  );

  res.json(result.rows[0]);
};

export const deletarDesperdicio = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  await db.query(
    `
    DELETE FROM prod_motivo
    WHERE id_prod_motivo = $1
    `,
    [id]
  );

  res.json({
    mensagem: "Desperdício removido"
  });
};