// models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theater",
      required: true,
    },
    seats: [{ type: String, required: true }],
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    bookingDate: { type: String, required: true },
    bookingTime: { type: String, required: true },
    theaterName: { type: String, required: true}
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

exports.Booking = Booking;
