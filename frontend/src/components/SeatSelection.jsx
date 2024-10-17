import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Button,
  Typography,
  Snackbar,
  useMediaQuery,
} from "@mui/material";
import useSeats from "../hooks/useSeats"; // Adjust the import path based on your structure
import seatService from "../services/seatService";
import useGameQueryStore from "../store";
import LivingIcon from "@mui/icons-material/Living";
import dayjs from "dayjs";
import { useAuth } from "../Context/AuthContext";
import Joi from "joi"; // Import Joi
import { useNavigate } from "react-router-dom";

const sectionPrices = {
  VIP: 15,
  Standard: 10,
};

const getFormattedDate = (dayjsObject) => {
  return dayjs(dayjsObject).format("YYYY-MM-DD"); // Customize format as needed
};

// Joi schema for booking validation
const bookingSchema = Joi.object({
  theater: Joi.string().required(),
  seats: Joi.array().items(Joi.string()).required(),
  customerName: Joi.string().min(1).required(),
  customerEmail: Joi.string()
    .pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/) // Custom regex for email validation
    .required(),
  totalAmount: Joi.number().greater(0).required(),
  bookingDate: Joi.string().isoDate().required(),
  bookingTime: Joi.string().required(),
});

const SeatSelection = () => {
  const theaterId = useGameQueryStore((s) => s.selectedTheater);
  const { data, isLoading, isError } = useSeats(theaterId);
  const [seatLayout, setSeatLayout] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  console.log("seat array: ", data);

  // Media query to detect screen size
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isMediumScreen = useMediaQuery("(max-width:960px)");
  const selectedDate = useGameQueryStore((s) => s.selectedDate);
  const selectedTime = useGameQueryStore((s) => s.selectedTime);

  // Effect to handle seat layout when data changes
  useEffect(() => {
    if (data) {
      const layout = {};
      data.forEach((seat) => {
        const { section, row, number, isAvailable } = seat;

        if (!layout[section]) {
          layout[section] = [];
        }

        const rowIndex = row;
        if (!layout[section][rowIndex]) {
          layout[section][rowIndex] = [];
        }

        layout[section][rowIndex][number] = isAvailable;
      });
      setSeatLayout(layout);
    }
  }, [data]);

  // Handle seat selection
  const handleSeatClick = (section, row, col) => {
    const seatId = `${section}-${row}-${col}`;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatId));
      updateTotalPrice(seatId, "remove");
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
      updateTotalPrice(seatId, "add");
    }
  };

  // Update total price based on selected seats
  const updateTotalPrice = (seatId, action) => {
    const [section] = seatId.split("-");
    const price = sectionPrices[section];
    setTotalPrice(action === "add" ? totalPrice + price : totalPrice - price);
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const { getCurrentUser } = useAuth();
  const { _id, name, email } = getCurrentUser();

  const navigate = useNavigate();

  const handleConfirm = async () => {
    if (selectedSeats.length > 0) {
      const formattedDate = getFormattedDate(selectedDate);

      // Prepare booking data
      const bookingData = {
        theater: theaterId,
        seats: selectedSeats,
        customerName: name,
        customerEmail: email,
        totalAmount: totalPrice,
        bookingDate: formattedDate,
        bookingTime: selectedTime,
      };

      // Validate booking data
      const { error } = bookingSchema.validate(bookingData);
      if (error) {
        console.error("Validation Error:", error.details);
        return; // Exit if validation fails
      }

      // Save valid booking data to local storage
      localStorage.setItem("bookingData", JSON.stringify(bookingData));
      
      navigate("/bookingdetails");
      setSnackbarOpen(true);

      // seatService
      //   .CreateSeat({ theaterId, selectedSeats })
      //   .then((response) => {
      //     console.log(response.data);
      //   })
      //   .catch((error) => {
      //     console.error("Error booking seats:", error);
      //   });
    }
  };

  // Render loading or error states
  if (isLoading) return <Typography>Loading seats...</Typography>;
  if (isError) return <Typography>Error loading seats!</Typography>;

  // Determine button size based on screen size
  const buttonSize = isSmallScreen ? 18 : isMediumScreen ? 25 : 30;

  // Render seats
  const renderSeats = () => {
    return Object.keys(seatLayout).map((section) => (
      <Box
        key={section}
        sx={{
          mb: 4,
          borderRadius: "10px",
          padding: "10px",
          backgroundColor: "#E5D9F2",
        }}
      >
        <Typography sx={{ mb: 2, fontSize: "15px" }}>
          {section} Seats - ${sectionPrices[section]}
        </Typography>
        <Grid container justifyContent="center" sx={{ mb: 2 }}>
          {Object.keys(seatLayout[section]).map((rowKey) => {
            const row = seatLayout[section][rowKey];
            const rowIndex = rowKey;

            return (
              <Grid
                container
                key={rowKey}
                justifyContent="center"
                sx={{ mb: 1, flexWrap: "nowrap" }} // Prevent row from breaking
              >
                <Grid item sx={{ mr: 1, alignSelf: "center" }}>
                  <Typography variant="h6">{rowIndex}</Typography>
                </Grid>
                {row.map((isAvailable, colIndex) => {
                  const seatId = `${section}-${rowIndex}-${colIndex}`;
                  const isSelected = selectedSeats.includes(seatId);

                  return (
                    <Box
                      key={colIndex}
                      onClick={() => handleSeatClick(section, rowKey, colIndex)}
                      disabled={!isAvailable}
                      sx={{
                        width: buttonSize, // Dynamically set the button width
                        height: buttonSize, // Dynamically set the button height
                        margin: 0.3,
                        backgroundColor: !isAvailable
                          ? "gray"
                          : isSelected
                          ? "green"
                          : "#80C4E9",
                        "&:hover": {
                          backgroundColor:
                            isAvailable && !isSelected ? "#5C2FC2" : "",
                        },
                        borderRadius: "10px",
                      }}
                    />
                  );
                })}
              </Grid>
            );
          })}
        </Grid>
      </Box>
    ));
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        padding: 2,
        backgroundColor: "#A594F9",
        borderRadius: "20px",
        margin: "20px",
      }}
    >
      <Typography variant="h4" sx={{ mb: 4 }}>
        Select Your Seats
      </Typography>
      {renderSeats()}
      <Typography variant="h6" sx={{ mt: 4 }}>
        Total Price: ${totalPrice}
      </Typography>
      <Button
        variant="contained"
        onClick={handleConfirm}
        disabled={selectedSeats.length === 0}
        sx={{ backgroundColor: "#5C2FC2", color: "white", mt: 4 }}
      >
        Confirm Selection
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={`Seats selected: ${selectedSeats.join(
          ", "
        )}, Total Price: $${totalPrice}`}
      />
    </Box>
  );
};

export default SeatSelection;
