import { Router } from "express";
import {
  recomendarDoacoes,
  analisarEstoque
} from "../controllers/iaController";

const router = Router();

// Rota para recomendação focada em vencimentos e doações
router.get("/recomendar-doacoes", recomendarDoacoes);

// Rota para análise geral da saúde do estoque e perdas
router.get("/analisar-estoque", analisarEstoque);

export default router;