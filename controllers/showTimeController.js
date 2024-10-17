const { Showtime } = require("../models/showtime");

exports.getAllShowTimesEvent = async (req, res) => {
  try {
    // Fetch all showtimes
    const showtimes = await Showtime.find({}, "date -_id");
    res.status(200).json(showtimes);
  } catch (error) {
    console.error("Error fetching showtimes:", error);
    res.status(500).json("Server error");
  }
};

exports.createShowTimeEvent = async (req, res) => {
  const { theater, date, times } = req.body;

  // Validate the input
  if (!theater || !date || !Array.isArray(times) || times.length === 0) {
    return res
      .status(400)
      .json({ message: "Theater, date, and showtimes are required." });
  }

  try {
    // Create a new Showtime document
    const newShowtime = new Showtime({
      theater,
      date,
      times,
    });

    // Save the document to the database
    const savedNewShowtime = await newShowtime.save();

    // Respond with the created showtime
    res.status(201).json(savedNewShowtime);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

exports.getShowTimeByTheaterAndDateEvent = async (req, res) => {
  const { theater, date } = req.query;

  // Validate the input
  if (!theater || !date) {
    return res.status(400).json({ message: "Theater and date are required." });
  }

  try {
    // Parse the date string to a Date object
    const parsedDate = new Date(date);

    // Ensure the date is valid
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    // Query to find showtimes for the specified theater and date
    const showtimes = await Showtime.find({
      theater: theater,
      date: {
        $gte: parsedDate.setHours(0, 0, 0, 0), // Start of the day
        $lt: parsedDate.setHours(23, 59, 59, 999), // End of the day
      },
    });

    // Respond with the found showtimes
    res.status(200).json(showtimes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

exports.getShowTimeByIdEvent = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id);
    if (!showtime) return res.status(404).json({ error: "Showtime not found" });
    res.json(showtime);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateShowTimeByIdEvent = async (req, res) => {
  try {
    const showtime = await Showtime.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!showtime) return res.status(404).json({ error: "Showtime not found" });
    res.json(showtime);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteShowTimeByIdEvent = async (req, res) => {
  try {
    const showtime = await Showtime.findByIdAndDelete(req.params.id);
    if (!showtime) return res.status(404).json({ error: "Showtime not found" });
    res.json({ message: "Showtime deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
