import { Router } from "express";

import {
  listarProdutos,
  buscarProduto,
  criarProduto,
  atualizarProduto,
  deletarProduto,
    listarFornecedoresProduto,
    adicionarFornecedorProduto,
    consultarEstoqueProduto
} from "../controllers/produtoController";

const router = Router();

router.get("/", listarProdutos);

router.get("/:id", buscarProduto);

router.post("/", criarProduto);

router.put("/:id", atualizarProduto);

router.delete("/:id", deletarProduto);

router.get("/:id/fornecedores", listarFornecedoresProduto);

router.post("/:id/fornecedores", adicionarFornecedorProduto);

router.get("/:id/estoque", consultarEstoqueProduto);

export default router;