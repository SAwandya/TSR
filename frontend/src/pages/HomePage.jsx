import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import SeatSelection from "../components/SeatSelection";
import Calender from "../components/Calender";
import DateScroller from "../components/DateScroller";
import ImageSlider from "../components/ImageSlider";
import TheaterForm from "../components/TheaterForm";

const HomePage = () => {

  return (
    <Box>
      <ImageSlider />
      <Grid container spacing={2} justifyContent="center">
        <Grid
          item
          xs={12}
          sm={6}
          md={5}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginTop: { xs: "20px", sm: "40px", md: "60px" },
              marginBottom: { xs: "20px", sm: "40px", md: "60px" },
              backgroundColor: "#A594F9",
              borderRadius: "20px",
              padding: { xs: "10px", sm: "15px", md: "20px" },
              width: { xs: "100%", sm: "80%", md: "60%" },
            }}
          >
            <TheaterForm />
            <Calender />
            <DateScroller />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={7}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <SeatSelection />
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
