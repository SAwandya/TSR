import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import useTheaters from "../hooks/useTheaters";
import showTimeService from "../services/showTimeService";

const ShowtimeForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "times",
  });

  const { data: theaters } = useTheaters(); 

  // Sample fetch function to get theaters
  useEffect(() => {
    const fetchTheaters = async () => {
      const theaterData = await fetch("/api/theaters"); 
      const data = await theaterData.json();
      setTheaters(data); 
    };

    fetchTheaters();
  }, []);

  const onSubmit = (data) => {

    const times = data.times.map((time) => time.value);

    const showtimeData = {
      theater: data.theater,
      date: data.date,
      times, 
    };

    console.log(showtimeData);

    showTimeService
      .Create(showtimeData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Add Showtime
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.theater}>
            <InputLabel>Theater</InputLabel>
            <Select
              {...register("theater", { required: "Theater is required" })}
              defaultValue=""
            >
              <MenuItem value="" disabled>
                Select a theater
              </MenuItem>
              {theaters?.map((theater) => (
                <MenuItem key={theater._id} value={theater._id}>
                  {theater.name}{" "}
                  {/* Adjust the field name as per your theater object structure */}
                </MenuItem>
              ))}
            </Select>
            {errors.theater && <span>{errors.theater.message}</span>}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="date"
            label="Date"
            InputLabelProps={{ shrink: true }}
            {...register("date", { required: "Date is required" })}
            error={!!errors.date}
            helperText={errors.date?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Showtimes</Typography>
          {fields.map((field, index) => (
            <Grid container spacing={1} alignItems="center" key={field.id}>
              <Grid item xs={10}>
                <TextField
                  type="time"
                  fullWidth
                  label={`Showtime ${index + 1}`}
                  {...register(`times.${index}.value`, {
                    required: "Showtime is required",
                  })}
                  error={!!errors.times?.[index]?.value}
                  helperText={errors.times?.[index]?.value?.message}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton onClick={() => remove(index)} aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button
            type="button"
            variant="outlined"
            onClick={() => append({ value: "" })} // Add an empty showtime input
            style={{ marginTop: "10px" }}
          >
            Add Showtime
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ShowtimeForm;
