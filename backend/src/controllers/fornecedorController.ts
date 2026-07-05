import { Request, Response } from "express";
import { db } from "../database/db";

// GET /fornecedores
export const listarFornecedores = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await db.query(
      "SELECT * FROM fornecedor ORDER BY nome"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao listar fornecedores"
    });
  }
};

// GET /fornecedores/:id
export const buscarFornecedor = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      "SELECT * FROM fornecedor WHERE id_fornecedor = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Fornecedor não encontrado"
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao buscar fornecedor"
    });
  }
};

// POST /fornecedores
export const criarFornecedor = async (
  req: Request,
  res: Response
) => {
  try {
    const { nome, email, telefone } = req.body;

    const result = await db.query(
      `
      INSERT INTO fornecedor (
        nome,
        email,
        telefone
      )
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [nome, email, telefone]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao criar fornecedor"
    });
  }
};

// PUT /fornecedores/:id
export const atualizarFornecedor = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone } = req.body;

    const result = await db.query(
      `
      UPDATE fornecedor
      SET
        nome = $1,
        email = $2,
        telefone = $3
      WHERE id_fornecedor = $4
      RETURNING *
      `,
      [nome, email, telefone, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Fornecedor não encontrado"
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao atualizar fornecedor"
    });
  }
};

// DELETE /fornecedores/:id
export const deletarFornecedor = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      DELETE FROM fornecedor
      WHERE id_fornecedor = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Fornecedor não encontrado"
      });
    }

    res.status(200).json({
      mensagem: "Fornecedor removido com sucesso"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao remover fornecedor"
    });
  }
};