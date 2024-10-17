const express = require("express");
const router = express.Router();
const {Movie, validate} = require("../models/movies"); // Adjust the path as needed
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dh8aemmkc",
  api_key: 175951413584161,
  api_secret: "H_NzmnwTakj9zjYOhY_672-KmRo",
});

// Create a new movie
 router.post("/", async (req, res) => {
   try {
     const { error } = validate(req.body); 
     if (error) return res.status(400).send(error.details[0].message);

     const result = await cloudinary.uploader.upload(req.body.image, {
       folder: "movies", 
     });

     const movie = new Movie({
       ...req.body,
       imageUrl: result.secure_url, 
     });

     await movie.save();
     res.status(201).json(movie);
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
 });


// Get all movies
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a movie by ID
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a movie by ID
router.put("/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a movie by ID
router.delete("/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
