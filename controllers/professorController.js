const Professor = require("../models/professor");
const errorResponse = require("../utils/errorResponse");

const criarProfessor = async (req, res) => {
  try {
    const { nome, idade, disciplinasIds } = req.body;

    if (!nome || idade === undefined) {
      return errorResponse(res, "Nome e idade são obrigatórios", 400);
    }

    if (typeof idade !== "number" || idade <= 0) {
      return errorResponse(res, "Idade inválida", 400);
    }

    const novoProfessor = new Professor({
      nome,
      idade,
      disciplinas: Array.isArray(disciplinasIds) ? disciplinasIds : [],
    });

    await novoProfessor.save();

    return res.status(201).json({
      message: "Professor criado com sucesso!",
      professor: novoProfessor,
    });
  } catch (error) {
    return errorResponse(res);
  }
};

const obterTodosProfessores = async (req, res) => {
  try {
    const professores = await Professor.find().populate("disciplinas");
    return res.status(200).json(professores);
  } catch (error) {
    return errorResponse(res);
  }
};

const deletarProfessor = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await Professor.deleteOne({ _id: id });

    if (resultado.deletedCount === 0) {
      return errorResponse(res, "Professor não encontrado", 404);
    }

    return res.status(200).json({ message: "Professor removido com sucesso!" });
  } catch (error) {
    return errorResponse(res);
  }
};

const editarProfessor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, idade, disciplinasIds } = req.body;

    if (!nome || idade === undefined) {
      return errorResponse(res, "Nome e idade são obrigatórios", 400);
    }

    if (typeof idade !== "number" || idade <= 0) {
      return errorResponse(res, "Idade inválida", 400);
    }

    const professor = await Professor.findByIdAndUpdate(
      id,
      { nome, idade, disciplinas: Array.isArray(disciplinasIds) ? disciplinasIds : [] },
      { new: true }
    );

    if (!professor) {
      return errorResponse(res, "Professor não encontrado", 404);
    }

    return res.status(200).json({
      message: "Professor atualizado com sucesso!",
      professor,
    });
  } catch (error) {
    return errorResponse(res);
  }
};

module.exports = { criarProfessor, deletarProfessor, editarProfessor, obterTodosProfessores };
