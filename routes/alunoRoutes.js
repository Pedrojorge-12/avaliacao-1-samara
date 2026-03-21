const express = require("express");
const router = express.Router();
const alunoController = require("../controllers/alunoController");

router.get("/aluno", alunoController.obterTodosAlunos);
router.post("/aluno", alunoController.criarAluno);
router.delete("/aluno/:id", alunoController.deletarAluno);
router.put("/aluno/:id", alunoController.editarAluno);

module.exports = router;