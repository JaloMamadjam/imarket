import { Router } from "express";

import {
  listarPedidos,
  buscarPedido,
  criarPedido,
  atualizarPedido,
  deletarPedido,
    listarItensPedido,
    adicionarItemPedido,
    removerItemPedido
} from "../controllers/pedidoController";

const router = Router();

router.get("/", listarPedidos);

router.get("/:id", buscarPedido);

router.post("/", criarPedido);

router.put("/:id", atualizarPedido);

router.delete("/:id", deletarPedido);

router.get("/:id/itens", listarItensPedido);

router.post("/:id/itens", adicionarItemPedido);

router.delete("/:id/itens/:produto", removerItemPedido);

export default router;