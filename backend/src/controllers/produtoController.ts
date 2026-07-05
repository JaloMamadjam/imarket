import { Request, Response } from "express";
import { db } from "../database/db";

// GET /produtos
export const listarProdutos = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await db.query(
      `
      SELECT
        p.id_produto,
        p.nome,
        p.preco,
        c.id_categoria,
        c.nome AS categoria
      FROM produto p
      JOIN categoria c
      ON p.id_categoria = c.id_categoria
      ORDER BY p.nome
      `
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao listar produtos"
    });
  }
};

// GET /produtos/:id
export const buscarProduto = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      SELECT
        p.id_produto,
        p.nome,
        p.preco,
        c.id_categoria,
        c.nome AS categoria
      FROM produto p
      JOIN categoria c
      ON p.id_categoria = c.id_categoria
      WHERE p.id_produto = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Produto não encontrado"
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao buscar produto"
    });
  }
};

// POST /produtos
export const criarProduto = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      nome,
      preco,
      id_categoria
    } = req.body;

    const result = await db.query(
      `
      INSERT INTO produto
      (
        nome,
        preco,
        id_categoria
      )
      VALUES
      (
        $1,
        $2,
        $3
      )
      RETURNING *
      `,
      [nome, preco, id_categoria]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao criar produto"
    });
  }
};

// PUT /produtos/:id
export const atualizarProduto = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      nome,
      preco,
      id_categoria
    } = req.body;

    const result = await db.query(
      `
      UPDATE produto
      SET
        nome = $1,
        preco = $2,
        id_categoria = $3
      WHERE id_produto = $4
      RETURNING *
      `,
      [
        nome,
        preco,
        id_categoria,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Produto não encontrado"
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao atualizar produto"
    });
  }
};

// DELETE /produtos/:id
export const deletarProduto = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      DELETE FROM produto
      WHERE id_produto = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Produto não encontrado"
      });
    }

    res.status(200).json({
      mensagem: "Produto removido com sucesso"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao remover produto"
    });
  }
};

// GET /produtos/:id/fornecedores
export const listarFornecedoresProduto =
async (
  req: Request,
  res: Response
) => {

  const { id } = req.params;

  const result = await db.query(`
    SELECT
      f.*
    FROM fornecedor_prod fp
    JOIN fornecedor f
      ON fp.id_fornecedor =
         f.id_fornecedor
    WHERE fp.id_produto = $1
  `, [id]);
  res.json(result.rows);
};



// POST /produtos/:id/fornecedores
export const adicionarFornecedorProduto =
async (
  req: Request,
  res: Response
) => {

  const { id } = req.params;

  const { id_fornecedor } =
    req.body;

  const result = await db.query(`
    INSERT INTO fornecedor_prod
    (
      id_fornecedor,
      id_produto
    )
    VALUES
    (
      $1,
      $2
    )
    RETURNING *
  `, [
    id_fornecedor,
    id
  ]);

  res.status(201).json(
    result.rows[0]
  );
};


// GET /produtos/:id/estoque
export const consultarEstoqueProduto =
async (
  req: Request,
  res: Response
) => {

  const { id } = req.params;

  const result = await db.query(`
    SELECT
      a.local_armazem,
      pa.quantidade,
      pa.localproduto
    FROM prod_armazem pa
    JOIN armazem a
      ON pa.id_armazem =
         a.id_armazem
    WHERE pa.id_produto = $1
  `, [id]);

  res.json(result.rows);
};