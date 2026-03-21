const Tarefa = require("../models/tarefa");
const Disciplina = require("../models/disciplina");
const errorResponse = require("../utils/errorResponse");

const criarTarefa = async (req, res) => {
  try {
    const { titulo, alunoId, disciplinasIds } = req.body;

    if (!titulo || !alunoId) {
      return errorResponse(res, "Título e alunoId são obrigatórios", 400);
    }

    const novaTarefa = new Tarefa({
      titulo,
      aluno: alunoId,
      concluida: false,
      disciplinas: Array.isArray(disciplinasIds) ? disciplinasIds : [],
    });

    await novaTarefa.save();

    return res.status(201).json({
      message: "Tarefa criada com sucesso!",
      tarefa: novaTarefa,
    });
  } catch (error) {
    return errorResponse(res);
  }
};

const obterTodasTarefas = async (req, res) => {
  try {
    const tarefas = await Tarefa.find().populate("aluno").populate("disciplinas");
    return res.status(200).json(tarefas);
  } catch (error) {
    return errorResponse(res);
  }
};

const deletarTarefa = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await Tarefa.deleteOne({ _id: id });

    if (resultado.deletedCount === 0) {
      return errorResponse(res, "Tarefa não encontrada", 404);
    }

    await Disciplina.updateMany(
      { tarefas: id },
      { $pull: { tarefas: id } }
    );

    return res.status(200).json({ message: "Tarefa removida com sucesso!" });
  } catch (error) {
    return errorResponse(res);
  }
};

const editarTarefa = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, concluida } = req.body;

    if (!titulo) {
      return errorResponse(res, "Título é obrigatório", 400);
    }

    const tarefa = await Tarefa.findByIdAndUpdate(id, { titulo, concluida }, { new: true });

    if (!tarefa) {
      return errorResponse(res, "Tarefa não encontrada", 404);
    }

    return res.status(200).json({
      message: "Tarefa atualizada com sucesso!",
      tarefa,
    });
  } catch (error) {
    return errorResponse(res);
  }
};

module.exports = { criarTarefa, deletarTarefa, editarTarefa, obterTodasTarefas }