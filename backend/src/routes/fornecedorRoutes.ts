import { Router } from "express";

import {
  listarFornecedores,
  buscarFornecedor,
  criarFornecedor,
  atualizarFornecedor,
  deletarFornecedor
} from "../controllers/fornecedorController";

const router = Router();

router.get("/", listarFornecedores);

router.get("/:id", buscarFornecedor);

router.post("/", criarFornecedor);

router.put("/:id", atualizarFornecedor);

router.delete("/:id", deletarFornecedor);

export default router;