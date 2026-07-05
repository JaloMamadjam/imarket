import { Router } from "express";

import {
  listarClientes,
  buscarCliente,
  criarCliente,
  atualizarCliente,
  deletarCliente
} from "../controllers/clienteController";

const router = Router();

router.get("/", listarClientes);

router.get("/:id", buscarCliente);

router.post("/", criarCliente);

router.put("/:id", atualizarCliente);

router.delete("/:id", deletarCliente);

export default router;