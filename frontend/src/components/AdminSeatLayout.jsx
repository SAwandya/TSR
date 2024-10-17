import React from "react";
import { Box, Grid } from "@mui/material";

const SeatLayout = ({ section, handleSeatToggle, buttonSize }) => {

  return (
    <Box>
      {section.layout.map((row, rowIndex) => (
        <Grid container key={rowIndex} justifyContent="center" sx={{ mb: 1 }}>
          {row.map((isAvailable, colIndex) => (
            <Box
              key={colIndex}
              onClick={() => handleSeatToggle(section.id, rowIndex, colIndex)}
              sx={{
                width: buttonSize,
                height: buttonSize,
                margin: 0.3,
                backgroundColor: isAvailable ? "#80C4E9" : "gray", // Toggle seat color based on availability
                "&:hover": {
                  backgroundColor: isAvailable ? "#5C2FC2" : "",
                },
                borderRadius: "10px",
              }}
            />
          ))}
        </Grid>
      ))}
    </Box>
  );
};

export default SeatLayout;
