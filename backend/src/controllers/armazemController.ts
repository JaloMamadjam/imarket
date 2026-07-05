import { Request, Response } from "express";
import { db } from "../database/db";

export const listarArmazens = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await db.query(
      "SELECT * FROM armazem ORDER BY local_armazem"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensagem: "Erro ao listar armazéns",
    });
  }
};

export const buscarArmazem = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      "SELECT * FROM armazem WHERE id_armazem = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Armazém não encontrado",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensagem: "Erro ao buscar armazém",
    });
  }
};

export const criarArmazem = async (
  req: Request,
  res: Response
) => {
  try {
    const { local_armazem } = req.body;

    const result = await db.query(
      `
      INSERT INTO armazem(local_armazem)
      VALUES($1)
      RETURNING *
      `,
      [local_armazem]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensagem: "Erro ao criar armazém",
    });
  }
};

export const atualizarArmazem = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { local_armazem } = req.body;

    const result = await db.query(
      `
      UPDATE armazem
      SET local_armazem = $1
      WHERE id_armazem = $2
      RETURNING *
      `,
      [local_armazem, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Armazém não encontrado",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensagem: "Erro ao atualizar armazém",
    });
  }
};

export const deletarArmazem = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      DELETE FROM armazem
      WHERE id_armazem = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Armazém não encontrado",
      });
    }

    res.status(200).json({
      mensagem: "Armazém removido com sucesso",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensagem: "Erro ao remover armazém",
    });
  }
};