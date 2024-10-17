import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  TextField,
  Button,
  MenuItem,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import useTheaters from "../hooks/useTheaters";
import showTimeService from "../services/showTimeService";
import { ToastContainer, toast, Bounce } from "react-toastify";


const AdminShowTimeForm = () => {
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      theater: "",
      date: "",
      times: [{ time: "" }],
    },
  });

  const { data } = useTheaters();

  // Manage dynamic times array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "times",
  });

  // Submit handler
  const onSubmit = async (formData) => {
    const formattedData = {
      ...formData,
      times: formData.times.map((item) => item.time), // Convert array of objects to array of times
    };

    try {
      const response = await showTimeService.Create(formattedData); // Replace with your API call
      console.log("Showtime created successfully:", response.data);
       toast.success("Times added successfully!", {
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
      reset();
    } catch (error) {
      console.error("Error creating showtime:", error);
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Get current time in HH:MM format
  const currentTime = new Date().toTimeString().split(" ")[0].substring(0, 5);

  // Watch the selected date
  const selectedDate = watch("date");

  // Determine minimum time based on selected date
  const minTime = selectedDate === today ? currentTime : "00:00"; // Set to midnight if not today

  return (
    <Box
      component="form" // Add form attribute
      onSubmit={handleSubmit(onSubmit)} // Bind onSubmit to handleSubmit
      sx={{
        padding: 2,
        backgroundColor: "#E5D9F2",
        borderRadius: "10px",
        marginTop: "20px",
        marginRight: "70px",
        marginBottom: "40px",
      }}
    >
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
      <Typography
        variant="h4"
        sx={{ mb: 4, color: "#5C2FC2", fontWeight: "bold" }}
      >
        Create Showtimes
      </Typography>
      {/* Theater Dropdown */}
      <Controller
        name="theater"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            select
            label="Select Theater"
            fullWidth
            margin="normal"
            required
            sx={{ backgroundColor: "white", borderRadius: "5px" }}
          >
            {data?.map((theater) => (
              <MenuItem key={theater._id} value={theater._id}>
                {theater.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      {/* Date Input */}
      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type="date"
            label="Date"
            fullWidth
            margin="normal"
            required
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: today, // Prevent selecting past dates
            }}
            sx={{ backgroundColor: "white", borderRadius: "5px" }}
          />
        )}
      />
      {/* Times Input (Dynamic Array) */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Times:</Typography>
        {fields.map((item, index) => (
          <Box
            key={item.id}
            sx={{ display: "flex", alignItems: "center", mb: 2 }}
          >
            <Controller
              name={`times[${index}].time`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={`Time ${index + 1}`}
                  fullWidth
                  margin="normal"
                  type="time"
                  required
                  inputProps={{
                    min: minTime, // Set the minimum time based on selected date
                  }}
                  sx={{ backgroundColor: "white", borderRadius: "5px" }}
                />
              )}
            />
            <IconButton
              onClick={() => remove(index)}
              aria-label="remove time"
              color="secondary"
              sx={{ ml: 1 }}
            >
              <RemoveIcon />
            </IconButton>
          </Box>
        ))}
        <Button
          type="button"
          variant="outlined"
          onClick={() => append({ time: "" })}
          startIcon={<AddIcon />}
          sx={{ mb: 2 }}
        >
          Add Time
        </Button>
      </Box>
      <Button
        type="submit" // Make the button submit the form
        variant="contained"
        color="primary"
        sx={{ backgroundColor: "#5C2FC2", color: "white" }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default AdminShowTimeForm;
