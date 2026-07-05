import { Request, Response } from "express";
import { db } from "../database/db";

// GET /pagamentos
export const listarPagamentos = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await db.query(`
      SELECT
        pg.id_pagamento,
        pg.tipo_pagamento,
        pg.valor,
        pg.data_pagamento,
        p.id_pedido
      FROM pagamento pg
      JOIN pedido p
        ON pg.id_pedido = p.id_pedido
      ORDER BY pg.data_pagamento DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao listar pagamentos"
    });
  }
};

// GET /pagamentos/:id
export const buscarPagamento = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      SELECT
        pg.id_pagamento,
        pg.tipo_pagamento,
        pg.valor,
        pg.data_pagamento,
        p.id_pedido
      FROM pagamento pg
      JOIN pedido p
        ON pg.id_pedido = p.id_pedido
      WHERE pg.id_pagamento = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Pagamento não encontrado"
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao buscar pagamento"
    });
  }
};

// POST /pagamentos
export const criarPagamento = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      tipo_pagamento,
      valor,
      data_pagamento,
      id_pedido
    } = req.body;

    const result = await db.query(`
      INSERT INTO pagamento (
        tipo_pagamento,
        valor,
        data_pagamento,
        id_pedido
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [
      tipo_pagamento,
      valor,
      data_pagamento,
      id_pedido
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao criar pagamento"
    });
  }
};

// PUT /pagamentos/:id
export const atualizarPagamento = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      tipo_pagamento,
      valor,
      data_pagamento,
      id_pedido
    } = req.body;

    const result = await db.query(`
      UPDATE pagamento
      SET
        tipo_pagamento = $1,
        valor = $2,
        data_pagamento = $3,
        id_pedido = $4
      WHERE id_pagamento = $5
      RETURNING *
    `, [
      tipo_pagamento,
      valor,
      data_pagamento,
      id_pedido,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Pagamento não encontrado"
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao atualizar pagamento"
    });
  }
};

// DELETE /pagamentos/:id
export const deletarPagamento = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      DELETE FROM pagamento
      WHERE id_pagamento = $1
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Pagamento não encontrado"
      });
    }

    res.status(200).json({
      mensagem: "Pagamento removido com sucesso"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao remover pagamento"
    });
  }
}; 