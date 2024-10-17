import React from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Chip,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/system";
import movieService from "../services/movieService";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { useNavigate } from "react-router-dom";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const MoviePostForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const [image, setImage] = React.useState("");

  const setFileToBase = (e) => {
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setImage(reader.result); // Storing the image as Base64
    };

    reader.onerror = (error) => {
      console.log("Error:", error);
    };
  };

  // Dummy ratings for the dropdown
  const ratings = ["G", "PG", "PG-13", "R", "NC-17"];

  // To capture the cast and genre inputs
  const [cast, setCast] = React.useState([]);
  const [genre, setGenre] = React.useState([]);

  const handleCastChange = (event) => {
    setCast(event.target.value.split(","));
  };

  const handleGenreChange = (event) => {
    setGenre(event.target.value.split(","));
  };

  const navigate = useNavigate();

  const onFormSubmit = async (data) => {
    // Appending all form data and handling the image upload
    const formData = {
      ...data,
      cast,
      genre,
      image, // Attaching the Base64 image
    };

    const response = await movieService
      .CreateMovie(formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        toast.success("Movie added successfully!", {
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
        console.log(response);
      })
      .catch((error) => {});
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
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
      <Box
        component="form"
        onSubmit={handleSubmit(onFormSubmit)}
        noValidate
        sx={{
          mt: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          width: "50%",
          height: "60%",
          paddingBottom: "20px",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Upload Movie
        </Typography>

        <TextField
          label="Movie Title"
          {...register("title", { required: "Title is required" })}
          error={!!errors.title}
          helperText={errors.title ? errors.title.message : ""}
          fullWidth
        />

        <TextField
          label="Description"
          {...register("description", { required: "Description is required" })}
          error={!!errors.description}
          helperText={errors.description ? errors.description.message : ""}
          multiline
          rows={4}
          fullWidth
        />

        <TextField
          label="Release Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          {...register("releaseDate", { required: "Release date is required" })}
          error={!!errors.releaseDate}
          helperText={errors.releaseDate ? errors.releaseDate.message : ""}
          fullWidth
        />

        <TextField
          label="Duration (in minutes)"
          type="number"
          {...register("duration", {
            required: "Duration is required",
            min: 1,
          })}
          error={!!errors.duration}
          helperText={errors.duration ? errors.duration.message : ""}
          fullWidth
        />

        <TextField
          label="Director"
          {...register("director", { required: "Director is required" })}
          error={!!errors.director}
          helperText={errors.director ? errors.director.message : ""}
          fullWidth
        />

        <TextField
          label="Cast (comma separated)"
          value={cast.join(", ")}
          onChange={handleCastChange}
          fullWidth
        />

        <TextField
          label="Genre (comma separated)"
          value={genre.join(", ")}
          onChange={handleGenreChange}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel id="rating-label">Rating</InputLabel>
          <Select
            labelId="rating-label"
            {...register("rating", { required: "Rating is required" })}
            error={!!errors.rating}
            defaultValue=""
          >
            {ratings.map((rating) => (
              <MenuItem key={rating} value={rating}>
                {rating}
              </MenuItem>
            ))}
          </Select>
          {errors.rating && (
            <Typography color="error">{errors.rating.message}</Typography>
          )}
        </FormControl>

        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          Upload file
          <VisuallyHiddenInput
            onChange={setFileToBase}
            type="file"
            accept=".jpg, .jpeg"
            id="avatar"
          />
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default MoviePostForm;
