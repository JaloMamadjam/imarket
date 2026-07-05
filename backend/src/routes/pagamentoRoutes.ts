import { Router } from "express";

import {
  listarPagamentos,
  buscarPagamento,
  criarPagamento,
  atualizarPagamento,
  deletarPagamento
} from "../controllers/pagamentoController";

const router = Router();

router.get("/", listarPagamentos);

router.get("/:id", buscarPagamento);

router.post("/", criarPagamento);

router.put("/:id", atualizarPagamento);

router.delete("/:id", deletarPagamento);

export default router;