const { Seat } = require("../models/seat");
const { Theater } = require("../models/theater");

exports.getByTheaterIdEvent = async (req, res) => {
  const { theaterId } = req.params;

  try {
    const seats = await Seat.find({ theater: theaterId })
    return res.json(seats);
  } catch (error) {
    console.error("Error fetching seats:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.createSeatEvent = async (req, res) => {
  try {
    const { theaterId, selectedSeats } = req.body;

    // Loop through selectedSeats and update the availability
    for (const seat of selectedSeats) {
      const [section, row, col] = seat.split("-");

      const result = await Seat.findOneAndUpdate(
        {
          theater: theaterId,
          row: row,
          number: col,
          section: section,
        },
        { isAvailable: false }
      );
    }

    return res.send("Seats booked successfully");
  } catch (error) {
    console.error("Error booking seats:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createMultipleSeatsEvent = async (req, res) => {
  try {
    const { theater, sections, location } = req.body;

    let newtheater = await Theater.findOne({ name: theater, location });
    if (newtheater) return res.status(404).json({ error: "Theater Already exist" });

    // Create a new theater
    newTheater = new Theater({ name: theater, location });
    await newTheater.save();

    if (!newTheater) res.status(404).json({ error: "Theater not created" });

    // Iterate through each section and row to create seats
    const seatsToCreate = [];
    sections.forEach((section) => {
      section.layout.forEach((row, rowIndex) => {
        row.forEach((isAvailable, colIndex) => {
          const newSeat = {
            theater: newTheater._id, // Theater ID from the body
            row: rowIndex, // Row index
            number: colIndex, // Column index
            isAvailable, // Availability of the seat
            section: section.name, // Section name
          };
          seatsToCreate.push(newSeat);
        });
      });
    });

    // Bulk insert seats into the database
    await Seat.insertMany(seatsToCreate);

    return res.status(201).json({ message: "Seats created successfully" });
  } catch (error) {
    console.error("Error creating seats:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getSeatByIdEvent = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);
    if (!seat) return res.status(404).json({ error: "Seat not found" });
    res.json(seat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSeatEvent = async (req, res) => {
  try {
    const seat = await Seat.findByIdAndDelete(req.params.id);
    if (!seat) return res.status(404).json({ error: "Seat not found" });
    res.json({ message: "Seat deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};