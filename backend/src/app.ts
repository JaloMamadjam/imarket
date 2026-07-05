import express from "express";
import cors from "cors";
import categoriaRoutes from "./routes/categoriaRoutes";
import clienteRoutes from "./routes/clienteRoutes";
import fornecedorRoutes from "./routes/fornecedorRoutes";
import instituicaoRoutes from "./routes/instituicaoRoutes";
import armazemRoutes from "./routes/armazemRoutes";
import motivoRoutes from "./routes/motivoRoutes";
import produtoRoutes from "./routes/produtoRoutes";
import loteRoutes from "./routes/loteRoutes";
import pedidoRoutes from "./routes/pedidoRoutes";
import pagamentoRoutes from "./routes/pagamentoRoutes";
import doacaoRoutes from "./routes/doacaoRoutes";
import setupRoutes from "./routes/setupRoutes";
import iaRoutes from "./routes/iaRoutes";
import relatorioRoutes from "./routes/relatorioRoutes";
import desperdicioRoutes from "./routes/desperdicioRoutes";



const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/categorias", categoriaRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/fornecedores", fornecedorRoutes);
app.use("/api/instituicoes", instituicaoRoutes);
app.use("/api/armazens", armazemRoutes);
app.use("/api/motivos", motivoRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/lotes", loteRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/pagamentos", pagamentoRoutes);
app.use("/api/doacoes", doacaoRoutes);
app.use("/api/setup", setupRoutes);
app.use("/api/ia", iaRoutes);
app.use("/api/relatorios", relatorioRoutes);
app.use("/api/desperdicios", desperdicioRoutes);

export default app;