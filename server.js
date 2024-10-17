const { default: mongoose } = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const movieRoutes = require("./routes/movieRoutes");
const theaterRoutes = require("./routes/theaterRoutes");
const seatRoutes = require("./routes/seatRoutes");
const showtimeRoutes = require("./routes/showTimeRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const user = require("./routes/user");
const auth = require("./routes/auth");
require("./config/passport"); // Import your passport configuration
const passport = require("./config/passport");
require("dotenv").config(); // Load environment variables
const session = require("express-session"); // Import express-session
const calenderRoutes = require("./routes/calenderRoutes"); // Add this line
const path = require("path");

const mongo_url = process.env.MONGO_URL;

mongoose
  .connect(mongo_url)
  .then(() => console.log("Connect to MongoDB"))
  .catch((err) => console.log("Could not connect to MongoDB", err));

app.use(cors()); // Enable CORS for all routes

// Increase payload size for JSON and URL-encoded form data
app.use(express.json({ limit: "10mb" })); // Set the limit (e.g., 10MB)
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(
  session({
    secret: "Awandya2000#", // Use a strong secret key for production
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if you're using HTTPS
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/movies", movieRoutes);
app.use("/api/theaters", theaterRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/user", user);
app.use("/api/auth", auth);
app.use("/api", calenderRoutes);

// Serve static files from the React frontend app
app.use(express.static("./frontend/dist"));

// Catch-all route that serves the React frontend's index.html file for any route that isn't an API call
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
