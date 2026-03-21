const Disciplina = require("../models/disciplina")
const Tarefa = require("../models/tarefa")

const criarDisciplina = async (req, res) => {
  try {
    const { nome, descricao, dataInicio, dataFim, tarefasIds } = req.body;

    if (!nome || !dataInicio || !dataFim) {
      return errorResponse(res, "Nome, dataInicio e dataFim são obrigatórios", 400);
    }

    const novaDisciplina = new Disciplina({
      nome,
      descricao,
      dataInicio,
      dataFim,
      tarefas: Array.isArray(tarefasIds) ? tarefasIds : [],
    });

    await novaDisciplina.save();

    if (Array.isArray(tarefasIds) && tarefasIds.length > 0) {
      await Tarefa.updateMany(
        { _id: { $in: tarefasIds } },
        { $push: { disciplinas: novaDisciplina._id } }
      );
    }

    return res.status(201).json({
      message: "Disciplina criada com sucesso!",
      disciplina: novaDisciplina,
    });
  } catch (error) {
    return errorResponse(res);
  }
};

const obterTodasDisciplinas = async (req, res) => {
  try {
    const disciplinas = await Disciplina.find().populate("tarefas");
    return res.status(200).json(disciplinas);
  } catch (error) {
    return errorResponse(res);
  }
};

const deletarDisciplina = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await Disciplina.deleteOne({ _id: id });

    if (resultado.deletedCount === 0) {
      return errorResponse(res, "Disciplina não encontrada", 404);
    }

    return res.status(200).json({
      message: "Disciplina removida com sucesso!",
    });
  } catch (error) {
    return errorResponse(res);
  }
};

const editarDisciplina = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, dataInicio, dataFim, tarefasIds } = req.body;

    if (!nome || !dataInicio || !dataFim) {
      return errorResponse(res, "Nome, dataInicio e dataFim são obrigatórios", 400);
    }

    const disciplina = await Disciplina.findByIdAndUpdate(
      id,
      { nome, descricao, dataInicio, dataFim, tarefas: Array.isArray(tarefasIds) ? tarefasIds : [] },
      { new: true }
    );


    if (!disciplina) {
      return errorResponse(res, "Disciplina não encontrada", 404);
    }

    if (Array.isArray(tarefasIds) && tarefasIds.length > 0) {
      await Tarefa.updateMany(
        { _id: { $in: tarefasIds } },
        { $push: { disciplinas: disciplina._id } }
      );
    }

    return res.status(200).json({
      message: "Disciplina atualizada com sucesso!",
      disciplina,
    });
  } catch (error) {
    return errorResponse(res);
  }
};

module.exports = { criarDisciplina, deletarDisciplina, editarDisciplina, obterTodasDisciplinas }