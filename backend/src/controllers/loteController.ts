import { Request, Response } from "express";
import { db } from "../database/db";

// GET /lotes
export const listarLotes = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await db.query(`
      SELECT
        l.id_lote,
        l.quantidade,
        l.data_validade,
        p.id_produto,
        p.nome AS produto
      FROM lote l
      JOIN produto p
        ON l.id_produto = p.id_produto
      ORDER BY l.data_validade
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao listar lotes"
    });
  }
};

// GET /lotes/:id
export const buscarLote = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      SELECT
        l.id_lote,
        l.quantidade,
        l.data_validade,
        p.id_produto,
        p.nome AS produto
      FROM lote l
      JOIN produto p
        ON l.id_produto = p.id_produto
      WHERE l.id_lote = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Lote não encontrado"
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao buscar lote"
    });
  }
};

// POST /lotes
export const criarLote = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      quantidade,
      data_validade,
      id_produto
    } = req.body;

    const result = await db.query(`
      INSERT INTO lote (
        quantidade,
        data_validade,
        id_produto
      )
      VALUES ($1, $2, $3)
      RETURNING *
    `, [
      quantidade,
      data_validade,
      id_produto
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao criar lote"
    });
  }
};

// PUT /lotes/:id
export const atualizarLote = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      quantidade,
      data_validade,
      id_produto
    } = req.body;

    const result = await db.query(`
      UPDATE lote
      SET
        quantidade = $1,
        data_validade = $2,
        id_produto = $3
      WHERE id_lote = $4
      RETURNING *
    `, [
      quantidade,
      data_validade,
      id_produto,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Lote não encontrado"
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao atualizar lote"
    });
  }
};

// DELETE /lotes/:id
export const deletarLote = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      DELETE FROM lote
      WHERE id_lote = $1
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Lote não encontrado"
      });
    }

    res.status(200).json({
      mensagem: "Lote removido com sucesso"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao remover lote"
    });
  }
};