import { Request, Response } from "express";
import { db } from "../database/db";

import fs from "fs";
import path from "path";

export const inicializarBanco = async (
  req: Request,
  res: Response
) => {

  try {

    const schemaPath = path.join(
      __dirname,
      "../../src/database/ddl.sql"
    );

    const seedPath = path.join(
      __dirname,
      "../../src/database/inserts.sql"
    );

    const schema =
      fs.readFileSync(
        schemaPath,
        "utf8"
      );

    const seed =
      fs.readFileSync(
        seedPath,
        "utf8"
      );

    await db.query(schema);

    await db.query(seed);

    res.status(200).json({
      mensagem:
        "Banco criado e populado com sucesso"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensagem:
        "Erro ao inicializar banco"
    });

  }
};

export const resetarBanco = async (
  req: Request,
  res: Response
) => {

  try {

    await db.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
    `);

    res.status(200).json({
      mensagem:
        "Banco resetado com sucesso"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensagem:
        "Erro ao resetar banco"
    });

  }
};