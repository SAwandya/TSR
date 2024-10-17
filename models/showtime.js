// models/Showtime.js
const mongoose = require("mongoose");

const showtimeSchema = new mongoose.Schema(
  {
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theater",
      required: true,
    },
    date: { type: Date, required: true },
    times: {
      type: [String], 
      required: true,
    },
  },
  { timestamps: true }
);

const Showtime = mongoose.model("Showtime", showtimeSchema);

exports.Showtime = Showtime;