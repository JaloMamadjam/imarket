import { Request, Response } from "express";
import { db } from "../database/db";

// GET /doacoes
export const listarDoacoes = async (req: Request, res: Response) => {
  try {
    const result = await db.query(`
      SELECT
        d.id_doacao,
        d.data_doacao,
        d.quantidade,
        d.id_produto,
        d.id_instituicao,
        p.nome AS produto,
        i.nome AS instituicao
      FROM doacao d
      JOIN produto p
        ON d.id_produto = p.id_produto
      JOIN instituicao i
        ON d.id_instituicao = i.id_instituicao
      ORDER BY d.data_doacao DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao listar doações" });
  }
};

// GET /doacoes/:id
export const buscarDoacao = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT
        d.id_doacao,
        d.data_doacao,
        d.quantidade,
        d.id_produto,
        d.id_instituicao,
        p.nome AS produto,
        i.nome AS instituicao
      FROM doacao d
      JOIN produto p
        ON d.id_produto = p.id_produto
      JOIN instituicao i
        ON d.id_instituicao = i.id_instituicao
      WHERE d.id_doacao = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: "Doação não encontrada" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao buscar doação" });
  }
};

// POST /doacoes
export const criarDoacao = async (req: Request, res: Response) => {
  try {
    const { data_doacao, quantidade, id_instituicao, id_produto } = req.body;
    const result = await db.query(`
      INSERT INTO doacao (data_doacao, quantidade, id_instituicao, id_produto)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [data_doacao, quantidade, id_instituicao, id_produto]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao criar doação" });
  }
};

// PUT /doacoes/:id
export const atualizarDoacao = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data_doacao, quantidade, id_instituicao, id_produto } = req.body;

    const result = await db.query(`
      UPDATE doacao
      SET 
        data_doacao = $1, 
        quantidade = $2, 
        id_instituicao = $3, 
        id_produto = $4
      WHERE id_doacao = $5
      RETURNING *
    `, [data_doacao, quantidade, id_instituicao, id_produto, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: "Doação não encontrada" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao atualizar doação" });
  }
};

// DELETE /doacoes/:id
export const deletarDoacao = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      DELETE FROM doacao
      WHERE id_doacao = $1
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: "Doação não encontrada" });
    }
    res.status(200).json({ mensagem: "Doação removida com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao remover doação" });
  }
};