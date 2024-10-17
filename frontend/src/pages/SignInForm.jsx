import React, { useState } from "react";
import Joi from "joi";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import Alert from "@mui/material/Alert";

import { Box, Button, TextField, Typography } from "@mui/material";
import { Link, Navigate, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { useAuth } from "../Context/AuthContext";

// Joi schema for validation
const schema = Joi.object({
  email: Joi.string().required().label("Email"),
  password: Joi.string().required().label("Password"),
});

const SignInForm = () => {
  // State for form fields and errors
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  // Validate a single field based on Joi schema
  const validateField = (name, value) => {
    const fieldSchema = Joi.object({ [name]: schema.extract(name) });
    const { error } = fieldSchema.validate({ [name]: value });
    return error ? error.details[0].message : null;
  };

  // Handle changes dynamically based on the field name
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validate the field and update errors
    const errorMessage = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  // Validate the entire form before submission
  const validateForm = () => {
    const { error } = schema.validate(formData, { abortEarly: false });
    if (!error) return null;

    const newErrors = {};
    error.details.forEach((detail) => {
      newErrors[detail.path[0]] = detail.message;
    });
    return newErrors;
  };

  const { authToken, login } = useAuth();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("auth Data: ", formData);

    // Validate form before submission
    const formErrors = validateForm();
    setErrors(formErrors || {});

    if (formErrors) {
      console.log("Form contains errors.");
    } else {
      console.log("Form Data: ", formData);

      authService
        .AuthenticateUser(formData)
        .then((res) => {
          console.log("Signin successfully: ", res);
          toast.success("Signin successfully!", {
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
          login(res)
          navigate("/");
        })
        .catch((err) => {
          console.log("Error Signin: ", err.response.data);
          setErrors(err.response.data);
        });
    }
  };


  return (
    <>
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
      {authToken && <Navigate to="/" replace={true} />}{" "}
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#F5F4FA",
          borderRadius: "20px",
          padding: "60px",
          alignItems: "center",
          marginTop: "30px",
          maxWidth: "50%",
          marginLeft: "25%",
        }}
      >
        {" "}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <Box
            sx={{
              backgroundImage: "url(../src/assets/login.png)",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              width: "50px",
              height: "50px",
            }}
          ></Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <Typography variant="h5" sx={{ textAlign: "left" }} gutterBottom>
            Sign In
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            type="password"
            name="password"
            value={formData.password || ""}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <Typography
              variant="subtitle2"
              sx={{ textAlign: "left", marginTop: "10px" }}
            >
              Don't have an account? Sign Up
            </Typography>
          </Link>
          {errors && errors.length > 0 && (
            <Alert severity="error">{errors}</Alert>
          )}
          {/* Add Button */}
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              sx={{
                marginRight: "40px",
                borderRadius: "8px",
                backgroundColor: "#7350F5",
                height: "50px",
                marginTop: "2px",
              }}
            >
              Signin
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
};

export default SignInForm;
