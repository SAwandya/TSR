import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import axios from "axios";
import useGameQueryStore from "../store";

function formatToCustomISO(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}T00:00:00.000+00:00`;
  return formattedDate;
}

const DateScroller = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theaterId = useGameQueryStore((s) => s.selectedTheater);
  const date = useGameQueryStore((s) => s.selectedDate);
  const SetSelectedTime = useGameQueryStore((s) => s.SetSelectedTime);
  const convertedDate = formatToCustomISO(date);

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/showtimes",
          {
            params: {
              theater: theaterId,
              date: convertedDate,
            },
          }
        );
        setShowtimes(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (theaterId) {
      fetchShowtimes();
    }
  }, [theaterId, date]);

  const handleTimeClick = (time) => {
    setSelectedDate(time);
    SetSelectedTime(time);
  };

  const scrollLeft = () => {
    setScrollIndex((prev) => Math.max(prev - 1, 0));
  };

  const scrollRight = () => {
    setScrollIndex((prev) =>
      Math.min(
        prev + 1,
        showtimes.flatMap((showtime) => showtime.times).length - 1
      )
    ); // Adjusted to the total number of times
  };

  if (loading) return <CircularProgress />;
  if (error)
    return <Typography color="error">Error fetching showtimes</Typography>;

  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        width: { xs: "90%", sm: "80%", md: "80%" }, // Responsive width
        margin: "20px auto", // Centering and margin
        backgroundColor: "#E5D9F2",
        borderRadius: "10px",
        padding: { xs: 2, sm: 3 }, // Responsive padding
      }}
    >
      {/* Left Scroll Button */}
      <Button onClick={scrollLeft} disabled={scrollIndex === 0}>
        <ArrowBack />
      </Button>

      {/* Time Scroller */}
      <Box
        display="flex"
        sx={{
          overflowX: "auto",
          scrollBehavior: "smooth",
          width: "85%", // Increased width for better visibility
          padding: "10px",
          "::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {showtimes.length > 0 ? (
          showtimes
            .flatMap((showtime) => showtime.times) // Flatten the showtimes
            .slice(scrollIndex, scrollIndex + 5) // Show 5 buttons based on scroll index
            .map((time, timeIndex) => (
              <Button
                key={`${time}-${timeIndex}`} // Unique keys
                onClick={() => handleTimeClick(time)}
                variant={selectedDate === time ? "contained" : "outlined"}
                sx={{
                  minWidth: { xs: "80px", sm: "100px" }, // Responsive button width
                  marginRight: "10px",
                  whiteSpace: "nowrap",
                  fontSize: { xs: "12px", sm: "14px" }, // Responsive font size
                }}
              >
                {time}
              </Button>
            ))
        ) : (
          <Typography>Choose date for relevant times</Typography>
        )}
      </Box>

      {/* Right Scroll Button */}
      <Button
        onClick={scrollRight}
        disabled={
          scrollIndex >=
          showtimes.flatMap((showtime) => showtime.times).length - 5
        }
      >
        <ArrowForward />
      </Button>
    </Box>
  );
};

export default DateScroller;
