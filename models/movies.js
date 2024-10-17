// models/Movie.js
const mongoose = require("mongoose");
const Joi = require("joi");


const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    duration: { type: Number, required: true }, // in minutes
    director: { type: String, required: true },
    cast: [{ type: String }],
    genre: [{ type: String }],
    rating: {
      type: String,
      enum: ["G", "PG", "PG-13", "R", "NC-17"],
      required: true,
    },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    releaseDate: Joi.date().required(),
    duration: Joi.number().required().min(1),
    director: Joi.string().required(),
    cast: Joi.array().items(Joi.string()),
    genre: Joi.array().items(Joi.string()),
    rating: Joi.string().valid("G", "PG", "PG-13", "R", "NC-17"),
    image: Joi.string(),
  });

  var result = schema.validate(movie);

  return result;
}

exports.Movie = Movie;
exports.validate = validateMovie;