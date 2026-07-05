import { Router } from "express";
import {
  listarDesperdicios,
  buscarDesperdicio,
  criarDesperdicio,
  atualizarDesperdicio,
  deletarDesperdicio
} from "../controllers/desperdicioController";

const router = Router();

router.get("/", listarDesperdicios);
router.get("/:id", buscarDesperdicio);
router.post("/", criarDesperdicio);
router.put("/:id", atualizarDesperdicio);
router.delete("/:id", deletarDesperdicio);

export default router;