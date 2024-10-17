// models/Seat.js
const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
  {
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theater",
      required: true,
    },
    row: { type: String, required: true }, 
    number: { type: Number, required: true }, 
    isAvailable: { type: Boolean, default: true },
    section: { type: String, required: true }, 
  },
  { timestamps: true }
);

const Seat = mongoose.model("Seat", seatSchema);

exports.Seat = Seat;
