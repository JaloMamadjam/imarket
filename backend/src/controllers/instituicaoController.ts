import { Request, Response } from "express";
import { db } from "../database/db";

export const listarInstituicoes = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await db.query(
      "SELECT * FROM instituicao ORDER BY nome"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensagem: "Erro ao listar instituições",
    });
  }
};

export const buscarInstituicao = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      "SELECT * FROM instituicao WHERE id_instituicao = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Instituição não encontrada",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensagem: "Erro ao buscar instituição",
    });
  }
};

export const criarInstituicao = async (
  req: Request,
  res: Response
) => {
  try {
    const { nome, endereco, telefone } = req.body;

    const result = await db.query(
      `
      INSERT INTO instituicao
      (nome, endereco, telefone)
      VALUES ($1,$2,$3)
      RETURNING *
      `,
      [nome, endereco, telefone]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensagem: "Erro ao criar instituição",
    });
  }
};

export const atualizarInstituicao = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { nome, endereco, telefone } = req.body;

    const result = await db.query(
      `
      UPDATE instituicao
      SET nome=$1,
          endereco=$2,
          telefone=$3
      WHERE id_instituicao=$4
      RETURNING *
      `,
      [nome, endereco, telefone, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Instituição não encontrada",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensagem: "Erro ao atualizar instituição",
    });
  }
};

export const deletarInstituicao = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      DELETE FROM instituicao
      WHERE id_instituicao=$1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Instituição não encontrada",
      });
    }

    res.status(200).json({
      mensagem: "Instituição removida com sucesso",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensagem: "Erro ao remover instituição",
    });
  }
};