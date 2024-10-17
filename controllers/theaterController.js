const { Theater } = require("../models/theater");

exports.createTheaterEvent = async (req, res) => {
  try {
    const theater = new Theater(req.body);
    const savedTheater = await theater.save();
    res.status(201).json(savedTheater);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllTheatersEvent = async (req, res) => {
  try {
    const theaters = await Theater.find();
    res.json(theaters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTheaterByIdEvent = async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id);
    if (!theater) return res.status(404).json({ error: "Theater not found" });
    res.json(theater);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTheaterByIdEvent = async (req, res) => {
  try {
    const theater = await Theater.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!theater) return res.status(404).json({ error: "Theater not found" });
    res.json(theater);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTheaterByIdEvent = async (req, res) => {
  try {
    const theater = await Theater.findByIdAndDelete(req.params.id);
    if (!theater) return res.status(404).json({ error: "Theater not found" });
    res.json({ message: "Theater deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
