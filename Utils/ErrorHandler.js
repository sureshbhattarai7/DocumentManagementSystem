const AppError = require("./appError");

function handleDuplicateFields(err) {
  console.log("Duplicate fields");
  const value = err.message;
  return new AppError(`Duplicate Field Value: ${value}`, 404);
}

function handleValidationErrorDB(err) {
  const errors = Object.values(err.errors).map((cl) => cl.message);
  const message = `Invalid Input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
}

function handleCastErrorDB(err) {
  const message = `Invalid ${err.path}: value: ${err.value}.`;
  return new AppError(message, 404);
}

function handleDevelomentError(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
  });
}

function handleProductionError(err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "fail",
      message: "OOPS! something went wrong",
    });
  }
}

exports.ErrorHandler = function () {
  return (err, req, res, next) => {
    err.status = err.status || "error";
    err.statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV === "development") {
      handleDevelomentError(err, res);
    } else if (process.env.NODE_ENV === "production") {
      if (err.code === 11000) err = handleDuplicateFields(err, res);
      if (err.name === "ValidationError") err = handleValidationErrorDB(err);
      if (err.name === "CastError") err = handleCastErrorDB(err);
      handleProductionError(err, res);
    }
  };
};
