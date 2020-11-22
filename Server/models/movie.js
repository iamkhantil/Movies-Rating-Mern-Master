const Joi = require("joi");
const mongoose = require("mongoose");

const Movie = mongoose.model(
  "movies",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    genres: {
      type: Array,
      required: true,
    },
    id: {
      type: Number,
      required: true,
      min: 0,
    },
    overview: {
      type: String,
      required: true,
      min: 0,
    },
    popularity: {
      type: Number,
      required: true,
      min: 0,
    },
    release_date: {
      type: Date,
      required: true,
    },
    runtime: {
      type: Number,
      required: true,
      min: 30,
    },
    tagline: {
      type: String,
    },
  })
);

function validateMovie(movie) {
  const schema = {
    title: Joi.string().min(5).max(60).required(),
    id: Joi.number().min(1).required(),
    overview: Joi.string().min(5).required(),
    popularity: Joi.number().min(0).required(),
    release_date: Joi.date().required(),
    runtime: Joi.number().required(),
    tagline: Joi.string().required(),
  };

  return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;
