const Aluno = require("../models/aluno");
const errorResponse = require("../utils/errorResponse");

const criarAluno = async (req, res) => {
  try {
    const { nome, idade } = req.body;

    if (!nome || idade === undefined) {
      return errorResponse(res, "Nome e idade são obrigatórios", 400);
    }

    if (idade <= 0 || typeof idade !== "number") {
      return errorResponse(res, "Idade inválida", 400);
    }

    const novoAluno = new Aluno({ nome, idade });
    await novoAluno.save();

    return res.status(201).json({
      message: "Aluno criado com sucesso!",
      aluno: novoAluno,
    });
  } catch (error) {
    return errorResponse(res);
  }
};

const obterTodosAlunos = async (req, res) => {
  try {
    const alunos = await Aluno.find().populate("perfil");
    return res.status(200).json(alunos);
  } catch (error) {
    return errorResponse(res);
  }
};

const deletarAluno = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await Aluno.deleteOne({ _id: id });

    if (resultado.deletedCount === 0) {
      return errorResponse(res, "Aluno não encontrado", 404);
    }

    return res.status(200).json({
      message: "Aluno removido com sucesso!",
    });
  } catch (error) {
    return errorResponse(res);
  }
};

const editarAluno = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, idade } = req.body;

    if (!nome || idade === undefined) {
      return errorResponse(res, "Nome e idade são obrigatórios", 400);
    }

    if (idade <= 0 || typeof idade !== "number") {
      return errorResponse(res, "Idade inválida", 400);
    }

    const aluno = await Aluno.findByIdAndUpdate(
      id,
      { nome, idade },
      { new: true }
    );

    if (!aluno) {
      return errorResponse(res, "Aluno não encontrado", 404);
    }

    return res.status(200).json({
      message: "Aluno atualizado com sucesso!",
      aluno,
    });
  } catch (error) {
    return errorResponse(res);
  }
};

module.exports = { criarAluno, deletarAluno, editarAluno, obterTodosAlunos };