const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const AppError = require("./Utils/appError");
const userRoute = require("./Route/userRoute");

const ErrorHandler = require("./Utils/ErrorHandler");

const app = express();

app.use(express.json());

console.log(process.env.NODE_ENV);

app.use("/api/v1/users", userRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} at this server`, 404));
});

app.use(ErrorHandler.ErrorHandler());

module.exports = app;
