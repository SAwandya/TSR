const express = require("express");
const { default: mongoose } = require("mongoose");
const {
  getAllShowTimesEvent,
  createShowTimeEvent,
  getShowTimeByTheaterAndDateEvent,
  getShowTimeByIdEvent,
  deleteShowTimeByIdEvent,
  updateShowTimeByIdEvent,
} = require("../controllers/showTimeController");

const router = express.Router();

router.get("/available", getAllShowTimesEvent);

router.post("/", createShowTimeEvent);

router.get("/", getShowTimeByTheaterAndDateEvent);

router.get("/:id", getShowTimeByIdEvent);

router.put("/:id", updateShowTimeByIdEvent);

router.delete("/:id", deleteShowTimeByIdEvent);

module.exports = router;
