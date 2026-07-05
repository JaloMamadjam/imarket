import { Router } from "express";

import {
  listarArmazens,
  buscarArmazem,
  criarArmazem,
  atualizarArmazem,
  deletarArmazem,
} from "../controllers/armazemController";

const router = Router();

router.get("/", listarArmazens);
router.get("/:id", buscarArmazem);
router.post("/", criarArmazem);
router.put("/:id", atualizarArmazem);
router.delete("/:id", deletarArmazem);

export default router;