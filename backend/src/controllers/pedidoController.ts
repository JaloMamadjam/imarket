import { Request, Response } from "express";
import { db } from "../database/db";

// GET /pedidos
export const listarPedidos = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await db.query(`
      SELECT
        p.id_pedido,
        p.valor_total,
        p.data_pedido,
        c.id_cliente,
        c.nome AS cliente
      FROM pedido p
      JOIN cliente c
        ON p.id_cliente = c.id_cliente
      ORDER BY p.data_pedido DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao listar pedidos"
    });
  }
};

// GET /pedidos/:id
export const buscarPedido = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      SELECT
        p.id_pedido,
        p.valor_total,
        p.data_pedido,
        c.id_cliente,
        c.nome AS cliente
      FROM pedido p
      JOIN cliente c
        ON p.id_cliente = c.id_cliente
      WHERE p.id_pedido = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Pedido não encontrado"
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao buscar pedido"
    });
  }
};

// POST /pedidos
export const criarPedido = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      valor_total,
      id_cliente
    } = req.body;

    const result = await db.query(`
      INSERT INTO pedido (
        valor_total,
        id_cliente
      )
      VALUES ($1, $2)
      RETURNING *
    `, [
      valor_total,
      id_cliente
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao criar pedido"
    });
  }
};

// PUT /pedidos/:id
export const atualizarPedido = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      valor_total,
      id_cliente
    } = req.body;

    const result = await db.query(`
      UPDATE pedido
      SET
        valor_total = $1,
        id_cliente = $2
      WHERE id_pedido = $3
      RETURNING *
    `, [
      valor_total,
      id_cliente,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Pedido não encontrado"
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao atualizar pedido"
    });
  }
};

// DELETE /pedidos/:id
export const deletarPedido = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      DELETE FROM pedido
      WHERE id_pedido = $1
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Pedido não encontrado"
      });
    }

    res.status(200).json({
      mensagem: "Pedido removido com sucesso"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao remover pedido"
    });
  }
};

// GET /pedidos/:id/itens
export const listarItensPedido = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  const result = await db.query(`
    SELECT
      pp.id_produto,
      p.nome,
      pp.quantidade,
      pp.preco_unitario
    FROM pedido_produto pp
    JOIN produto p
      ON pp.id_produto = p.id_produto
    WHERE pp.id_pedido = $1
  `, [id]);

  res.json(result.rows);
};


// POST /pedidos/:id/itens
export const adicionarItemPedido = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  const {
    id_produto,
    quantidade,
    preco_unitario
  } = req.body;

  const result = await db.query(`
    INSERT INTO pedido_produto
    (
      id_pedido,
      id_produto,
      quantidade,
      preco_unitario
    )
    VALUES
    (
      $1,$2,$3,$4
    )
    RETURNING *
  `, [
    id,
    id_produto,
    quantidade,
    preco_unitario
  ]);

  res.status(201).json(result.rows[0]);
};

// DELETE /pedidos/:id/itens/:produto
export const removerItemPedido = async (
  req: Request,
  res: Response
) => {
  const { id, produto } = req.params;

  await db.query(`
    DELETE FROM pedido_produto
    WHERE id_pedido = $1
    AND id_produto = $2
  `, [id, produto]);

  res.json({
    mensagem: "Item removido"
  });
};