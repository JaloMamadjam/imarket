import { Router } from "express";

import {
  listarMotivos,
  buscarMotivo,
  criarMotivo,
  atualizarMotivo,
  deletarMotivo,
  listarMotivosComDesperdicios
} from "../controllers/motivoController";

const router = Router();

router.get("/", listarMotivos);

router.get("/com_desperdicios", listarMotivosComDesperdicios);


router.get("/:id", buscarMotivo);



router.post("/", criarMotivo);

router.put("/:id", atualizarMotivo);

router.delete("/:id", deletarMotivo);


export default router;