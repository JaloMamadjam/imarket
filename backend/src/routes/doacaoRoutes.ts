import { Router } from "express";
import {
  listarDoacoes,
  buscarDoacao,
  criarDoacao,
  atualizarDoacao,
  deletarDoacao
} from "../controllers/doacaoController";

const router = Router();

router.get("/", listarDoacoes);
router.get("/:id", buscarDoacao);
router.post("/", criarDoacao);
router.put("/:id", atualizarDoacao);
router.delete("/:id", deletarDoacao);

export default router;