import React from "react";
import { Box, Typography, Paper, Button, Grid } from "@mui/material";
import Swal from "sweetalert2";
import seatService from "../services/seatService";
import bookingService from "../services/bookingService";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";


const bookSeat = async (bookingDataStr, userId, accessToken) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/create-calendar-event",
      {
        userId: userId,
        bookingDate: bookingDataStr.bookingDate,
        bookingTime: bookingDataStr.bookingTime,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("Calendar event created:", response.data);
  } catch (error) {
    console.error("Error booking seat and creating event:", error);
  }
};

const BookingDetails = () => {
  const bookingData = localStorage.getItem("bookingData");
  const bookingDataStr = JSON.parse(bookingData);
  const theaterId = bookingDataStr.theater;
  const selectedSeats = bookingDataStr.seats;
  const { getCurrentUser } = useAuth();
  const userId = getCurrentUser()._id;
  const accessToken = getCurrentUser().accessToken;

  const navigate = useNavigate();

  const handleConfirm = () => {
    Swal.fire({
      title: "Confirm Booking?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
    }).then((result) => {
      if (result.isConfirmed) {
        bookSeat(bookingDataStr, userId, accessToken);

        Swal.fire({
          title: "Success!",
          text: "Booking process completed.",
          icon: "success",
        });

        seatService
          .CreateSeat({ theaterId, selectedSeats })
          .then((response) => {
            console.log(response.data);
            bookingService
              .Create(bookingDataStr)
              .then((response) => {
                 toast.success("Set reminder to the Google calender", {
                   position: "top-right",
                   autoClose: 5000,
                   hideProgressBar: false,
                   closeOnClick: true,
                   pauseOnHover: true,
                   draggable: true,
                   progress: undefined,
                   theme: "colored",
                   transition: Bounce,
                 });
                navigate("/");
                console.log(response.data);
              })
              .catch((error) => {
                console.error("Error booking seats:", error);
              });
          })
          .catch((error) => {
            console.error("Error booking seats:", error);
          });
      }
    });
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: "auto", marginTop: "100px" }}>
      {" "}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition:Bounce
      />
      <Paper
        elevation={4}
        sx={{ padding: 4, borderRadius: "20px", backgroundColor: "#E5D9F2" }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ color: "#5C2FC2" }}
        >
          Booking Details
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Event Name:</Typography>
            <Typography
              variant="body1"
              sx={{ marginBottom: 2, fontWeight: "bold" }}
            >
              {bookingDataStr.theaterName}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h6">Date:</Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              {bookingDataStr.bookingDate}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h6">Time:</Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              {bookingDataStr.bookingTime}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h6">Total Price:</Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              ${bookingDataStr.totalAmount}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h6">Seats:</Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              {bookingDataStr.seats.join(", ")}
            </Typography>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          onClick={handleConfirm}
          sx={{ backgroundColor: "#5C2FC2", color: "white", mt: 4 }}
          fullWidth
        >
          Confirm Booking
        </Button>
      </Paper>
    </Box>
  );
};

export default BookingDetails;
