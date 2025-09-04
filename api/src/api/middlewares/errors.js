const mongoose = require("mongoose");
const createError = require("http-errors");
const { deleteFile } = require("../../lib/storage");

module.exports.routeNotFound = (req, res, next) => {
  next(createError(400, "Route not found"));
}

module.exports.globalErrorHandler = (error, req, res, next) => {
  console.error(error);

  if (req.file) {
    console.log("remove uploaded file");
    deleteFile(req.file.filename);
  }

  if (
    error instanceof mongoose.Error.CastError &&
    error.message.includes("_id")
  ) {
    error = createError(404, "Resource not found");
  }
  if (error instanceof mongoose.Error.ValidationError)
    error = createError(400, error);
  if (!error.status) error = createError(500, error.message);

  const errorResponse = { message: error.message };
  if (error.errors) {
    errorResponse.errors = Object.keys(error.errors).reduce(
      (responseErrors, errorKey) => {
        responseErrors[errorKey] =
          error.errors[errorKey].message || error.errors[errorKey];
        return responseErrors;
      },
      {}
    );
  }
  res.status(error.status).json(errorResponse);
}
