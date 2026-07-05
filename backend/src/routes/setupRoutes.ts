import { Router } from "express";

import {
  inicializarBanco,
  resetarBanco
} from "../controllers/setupController";

const router = Router();

router.post(
  "/init",
  inicializarBanco
);

router.post(
  "/reset",
  resetarBanco
);

export default router;