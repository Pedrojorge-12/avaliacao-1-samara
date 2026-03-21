function errorResponse(res, message = "Erro inesperado no servidor", statusCode = 500) {
  return res.status(statusCode).json({
    message,
  });
}

module.exports = errorResponse;