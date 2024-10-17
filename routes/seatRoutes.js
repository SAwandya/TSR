const express = require("express");

const {
  getByTheaterIdEvent,
  createSeatEvent,
  createMultipleSeatsEvent,
  getSeatByIdEvent,
  deleteSeatEvent,
} = require("../controllers/seatController");

const router = express.Router();

router.get("/:theaterId", getByTheaterIdEvent);

router.post("/", createSeatEvent);

router.post("/create", createMultipleSeatsEvent);

router.get("/:id", getSeatByIdEvent);

router.delete("/:id", deleteSeatEvent);

module.exports = router;
