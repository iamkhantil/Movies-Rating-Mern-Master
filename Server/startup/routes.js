const express = require("express");
const genres = require("../routes/genres");
const movies = require("../routes/movies");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");
const customers = require("../routes/Extra/customers");
const rentals = require("../routes/Extra/rentals");
const returns = require("../routes/Extra/returns");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/auth", auth);
  app.use("/api/users", users);
  app.use("/api/movies", movies);
  app.use("/api/genres", genres);
  // app.use('/api/customers', customers);
  // app.use('/api/rentals', rentals);
  // app.use('/api/returns', returns);
  app.use(error);
};
