require('dotenv').config()
require("./database/db.js")
const express = require("express");

const app = express();

const cors = require('cors');
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

const path = require('path');
app.use(express.static(path.join(__dirname, '.')));
const bodyParser = require("body-parser")

app.use(express.json())

const alunoRoutes = require("./routes/alunoRoutes.js")
const disciplinaRoutes = require("./routes/disciplinaRoutes.js")
const perfilRoutes = require("./routes/perfilRoutes.js")
const professorRoutes = require("./routes/professorRoutes.js")
const tarefaRoutes = require("./routes/tarefaRoutes.js")
const turmaRoutes = require("./routes/turmaRoutes.js")
const authRoutes = require("./routes/authRoutes.js")

app.use(bodyParser.json())
app.use("/alunos", alunoRoutes);
app.use("/disciplinas", disciplinaRoutes);
app.use("/perfis", perfilRoutes);
app.use("/professores", professorRoutes);
app.use("/tarefas", tarefaRoutes);
app.use("/turmas", turmaRoutes);
app.use("/auth", authRoutes);

// Ping para não dormir no Render
const https = require('https');
setInterval(() => {
  https.get('https://avaliacao-1-samara.onrender.com');
}, 14 * 60 * 1000);

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});