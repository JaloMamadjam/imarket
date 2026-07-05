import { Router } from "express";

import {
  listarInstituicoes,
  buscarInstituicao,
  criarInstituicao,
  atualizarInstituicao,
  deletarInstituicao,
} from "../controllers/instituicaoController";

const router = Router();

router.get("/", listarInstituicoes);
router.get("/:id", buscarInstituicao);
router.post("/", criarInstituicao);
router.put("/:id", atualizarInstituicao);
router.delete("/:id", deletarInstituicao);

export default router;