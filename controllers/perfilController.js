const Perfil = require("../models/perfil")
const Aluno = require("../models/aluno");
const errorResponse = require("../utils/errorResponse");

const criarPerfil = async (req, res) => {
  try {
    const { matricula, telefone, endereco, alunoId } = req.body;

    if (!matricula || !alunoId) {
      return errorResponse(res, "Matrícula e alunoId são obrigatórios", 400);
    }

    const aluno = await Aluno.findById(alunoId);
    if (!aluno) {
      return errorResponse(res, "Aluno não encontrado", 404);
    }

    const novoPerfil = new Perfil({
      matricula,
      telefone,
      endereco,
      aluno: alunoId,
    });

    await novoPerfil.save();

    await Aluno.updateOne(
      { _id: alunoId },
      { $set: { perfil: novoPerfil._id } }
    );

    return res.status(201).json({
      message: "Perfil criado com sucesso!",
      perfil: novoPerfil,
    });
  } catch (error) {
    return errorResponse(res);
  }
};

const obterTodosPerfis = async (req, res) => {
  try {
    const perfis = await Perfil.find().populate("aluno");
    return res.status(200).json(perfis);
  } catch (error) {
    return errorResponse(res);
  }
};

const deletarPerfil = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await Perfil.deleteOne({ _id: id });

    if (resultado.deletedCount === 0) {
      return errorResponse(res, "Perfil não encontrado", 404);
    }

    await Aluno.updateOne({ perfil: id }, { $unset: { perfil: "" } });

    return res.status(200).json({ message: "Perfil removido com sucesso!" });
  } catch (error) {
    return errorResponse(res);
  }
};

const editarPerfil = async (req, res) => {
  try {
    const { id } = req.params;
    const { matricula, telefone, endereco, alunoId } = req.body;

    if (!matricula || !alunoId) {
      return errorResponse(res, "Matrícula e alunoId são obrigatórios", 400);
    }

    const perfilAntigo = await Perfil.findById(id);
    if (!perfilAntigo) {
      return errorResponse(res, "Perfil não encontrado", 404);
    }

    const alunoAntigoId = perfilAntigo.aluno?.toString();
    if (alunoAntigoId && alunoAntigoId !== alunoId) {
      await Aluno.updateOne({ _id: alunoAntigoId }, { $unset: { perfil: "" } });
      await Aluno.updateOne({ _id: alunoId }, { $set: { perfil: id } });
    }

    const perfil = await Perfil.findByIdAndUpdate(
      id,
      { matricula, telefone, endereco, aluno: alunoId },
      { new: true }
    );

    return res.status(200).json({
      message: "Perfil atualizado com sucesso!",
      perfil,
    });
  } catch (error) {
    return errorResponse(res);
  }
};

module.exports = { criarPerfil, deletarPerfil, editarPerfil, obterTodosPerfis }