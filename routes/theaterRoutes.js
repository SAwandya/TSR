const express = require("express");
const {
  createTheaterEvent,
  getAllTheatersEvent,
  getTheaterByIdEvent,
  updateTheaterByIdEvent,
  deleteTheaterByIdEvent,
} = require("../controllers/theaterController");

const router = express.Router();

router.post("/", createTheaterEvent);

router.get("/", getAllTheatersEvent);

router.get("/:id", getTheaterByIdEvent);

router.put("/:id", updateTheaterByIdEvent);

router.delete("/:id", deleteTheaterByIdEvent);

module.exports = router;
