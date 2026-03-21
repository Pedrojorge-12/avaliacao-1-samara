require('dotenv').config()
require("./database/db.js")
const express = require("express");

const app = express();

const alunoRoutes = require("./routes/alunoRoutes.js")
const disciplinaRoutes = require("./routes/disciplinaRoutes.js")
const perfilRoutes = require("./routes/perfilRoutes.js")
const professorRoutes = require("./routes/professorRoutes.js")
const tarefaRoutes = require("./routes/tarefaRoutes.js")
const turmaRoutes = require("./routes/turmaRoutes.js")

app.use("/alunos", alunoRoutes);
app.use("/disciplinas", disciplinaRoutes);
app.use("/perfis", perfilRoutes);
app.use("/professores", professorRoutes);
app.use("/tarefas", tarefaRoutes);
app.use("/turmas", turmaRoutes);

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});