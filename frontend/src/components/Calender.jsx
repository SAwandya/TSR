import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import useGameQueryStore from "../store";
import dayjs from "dayjs"; // Import dayjs to handle dates

const CustomCalendar = styled(StaticDatePicker)(({ theme }) => ({
  "& .MuiPickersDay-root": {
    width: 45,
    height: 45,
    fontSize: "1.25rem",
    backgroundColor: "#f5f5f5",
    "&.Mui-selected": {
      backgroundColor: "#1976d2",
      color: "#fff",
    },
    "&:hover": {
      backgroundColor: "#e0e0e0",
    },
    // Responsive styles
    [theme.breakpoints.down("sm")]: {
      width: 40, // Smaller width for small screens
      height: 40, // Smaller height for small screens
      fontSize: "1rem", // Smaller font size for small screens
    },
    [theme.breakpoints.down("xs")]: {
      width: 35, // Even smaller width for extra small screens
      height: 35, // Even smaller height for extra small screens
      fontSize: "0.875rem", // Even smaller font size for extra small screens
    },
  },
}));

const Calendar = () => {
  const SetSelectedDate = useGameQueryStore((s) => s.SetSelectedDate);
  const selectedDate = useGameQueryStore((s) => s.selectedDate);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 3, sm: 2, md: 3 }, // Adjust the gap between elements
          width: { xs: "70%", sm: "80%", md: "60%", lg: "70%" }, // Responsive width
          boxShadow: 1,
          padding: { xs: 6, sm: 4, md: 6 }, // Responsive padding
          borderRadius: 6,
          backgroundColor: "#E5D9F2",
          margin: "auto", // Center it horizontally
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
        >
          Select a Date
        </Typography>
        <CustomCalendar
          displayStaticWrapperAs="desktop"
          value={selectedDate}
          onChange={(newDate) => SetSelectedDate(newDate)}
          minDate={dayjs()} // Disable dates before today
          sx={{
            "& .MuiPickerStaticWrapper-root": {
              transform: { xs: "scale(1)", sm: "scale(1.1)", md: "scale(1.2)" }, // Adjust scale based on screen size
            },
            backgroundColor: "#E5D9F2",
          }}
        />
        {selectedDate && (
          <Typography
            variant="body1"
            sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}
          >
            Selected Date: {selectedDate.format("DD-MM-YYYY")}
          </Typography>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default Calendar;
