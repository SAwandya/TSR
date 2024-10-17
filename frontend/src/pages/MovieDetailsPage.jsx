import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { useParams } from "react-router-dom";
import useMovie from "../hooks/useMovie";
import SeatSelection from "../components/SeatSelection";
import DateScroller from "../components/DateScroller";

const MovieDetailsPage = () => {
  const {id} = useParams();

  const {data} = useMovie(id);

  console.log(data);
  return (
    <>
      <Card sx={{ maxWidth: 900, margin: "20px auto", padding: 2 }}>
        <Grid container spacing={2}>
          {/* Movie Image on the Left */}
          <Grid item xs={12} md={4}>
            <CardMedia
              component="img"
              height="400"
              image={data?.imageUrl} // Replace with the actual movie poster image link
              alt="Deadpool & Wolverine"
              sx={{ objectFit: "cover", borderRadius: 2 }}
            />
          </Grid>

          {/* Movie Details on the Right */}
          <Grid item xs={12} md={8}>
            <CardContent>
              <Typography variant="h4" component="h2" gutterBottom>
                {data?.title}
              </Typography>

              <Typography variant="body1" gutterBottom>
                <strong>Rating: </strong> {data?.rating}
              </Typography>

              <Typography variant="body1" gutterBottom>
                <strong>Description:</strong> {data?.description}
              </Typography>

              <Typography variant="body1" gutterBottom>
                <strong>Release Date:</strong> {data?.releaseDate}
              </Typography>

              <Typography variant="body1" gutterBottom>
                <strong>Running Time:</strong> {data?.duration} minutes
              </Typography>

              <Typography variant="body1" gutterBottom>
                <strong>Director:</strong> {data?.director}
              </Typography>

              <Typography variant="body1" gutterBottom>
                <strong>Cast:</strong> {data?.cast}
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
      <DateScroller/>
      <SeatSelection />
      
    </>
  );
};

export default MovieDetailsPage;
