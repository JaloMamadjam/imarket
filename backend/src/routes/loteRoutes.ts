import { Router } from "express";

import {
  listarLotes,
  buscarLote,
  criarLote,
  atualizarLote,
  deletarLote
} from "../controllers/loteController";

const router = Router();

router.get("/", listarLotes);

router.get("/:id", buscarLote);

router.post("/", criarLote);

router.put("/:id", atualizarLote);

router.delete("/:id", deletarLote);

export default router;