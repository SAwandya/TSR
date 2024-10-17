const express = require("express");
const {
  createBookingEvent,
  getAllBookingsEvent,
  getBookingByCustomerIdEvent,
  getBookingByIdEvent,
  updateBookingEvent,
  deleteBookingEvent,
} = require("../controllers/bookingController");

const router = express.Router();

router.post("/", createBookingEvent);

router.get("/", getAllBookingsEvent);

router.post("/customer", getBookingByCustomerIdEvent);

router.get("/:id", getBookingByIdEvent);

router.put("/:id", updateBookingEvent);

router.delete("/:id", deleteBookingEvent);

module.exports = router;
