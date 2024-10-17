const express = require("express");
const router = express.Router();
const { createCallendarEvent } = require("../controllers/calendarController");

router.post("/create-calendar-event", createCallendarEvent);

module.exports = router;