import { Request, Response } from "express";
import { db } from "../database/db";

// GET /clientes
export const listarClientes = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await db.query(
      "SELECT * FROM cliente ORDER BY nome"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao listar clientes"
    });
  }
};

// GET /clientes/:id
export const buscarCliente = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      "SELECT * FROM cliente WHERE id_cliente = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Cliente não encontrado"
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao buscar cliente"
    });
  }
};

// POST /clientes
export const criarCliente = async (
  req: Request,
  res: Response
) => {
  try {
    const { cpf, nome, email, telefone } = req.body;

    const result = await db.query(
      `
      INSERT INTO cliente (
        cpf,
        nome,
        email,
        telefone
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [cpf, nome, email, telefone]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao criar cliente"
    });
  }
};

// PUT /clientes/:id
export const atualizarCliente = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { cpf, nome, email, telefone } = req.body;

    const result = await db.query(
      `
      UPDATE cliente
      SET
        cpf = $1,
        nome = $2,
        email = $3,
        telefone = $4
      WHERE id_cliente = $5
      RETURNING *
      `,
      [cpf, nome, email, telefone, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Cliente não encontrado"
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao atualizar cliente"
    });
  }
};

// DELETE /clientes/:id
export const deletarCliente = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      DELETE FROM cliente
      WHERE id_cliente = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Cliente não encontrado"
      });
    }

    res.status(200).json({
      mensagem: "Cliente removido com sucesso"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao remover cliente"
    });
  }
};