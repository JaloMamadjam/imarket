import { Router } from "express";

import {
  produtosMaisVendidos,
  doacoesPorInstituicao,
  desperdiciosPorMotivo
} from "../controllers/relatorioController";

const router = Router();

router.get(
  "/produtos-mais-vendidos",
  produtosMaisVendidos
);

router.get(
  "/doacoes-por-instituicao",
  doacoesPorInstituicao
);

router.get(
  "/desperdicios-por-motivo",
  desperdiciosPorMotivo
);

export default router;