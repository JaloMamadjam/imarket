import { Request, Response } from "express";
import { db } from "../database/db";

// GET /categorias
export const listarCategorias = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await db.query(
      "SELECT * FROM categoria ORDER BY nome"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao listar categorias"
    });
  }
};

// GET /categorias/:id
export const buscarCategoria = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      "SELECT * FROM categoria WHERE id_categoria = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Categoria não encontrada"
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao buscar categoria"
    });
  }
};

// POST /categorias
export const criarCategoria = async (
  req: Request,
  res: Response
) => {
  try {
    const { nome } = req.body;

    const result = await db.query(
      `INSERT INTO categoria (nome)
       VALUES ($1)
       RETURNING *`,
      [nome]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

  return res.status(500).json({
    mensagem: "Erro ao criar categoria",
    erro: error
  });
  }
};

// PUT /categorias/:id
export const atualizarCategoria = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    const result = await db.query(
      `UPDATE categoria
       SET nome = $1
       WHERE id_categoria = $2
       RETURNING *`,
      [nome, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Categoria não encontrada"
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao atualizar categoria"
    });
  }
};

// DELETE /categorias/:id
export const deletarCategoria = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      "DELETE FROM categoria WHERE id_categoria = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Categoria não encontrada"
      });
    }

    res.status(200).json({
      mensagem: "Categoria removida com sucesso"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao remover categoria"
    });
  }
};