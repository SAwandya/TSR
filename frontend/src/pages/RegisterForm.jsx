import React, { useState } from "react";
import Joi from "joi";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Alert } from "@mui/material";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import userService from "../services/userService";
import Login from "../components/Login";

// Joi schema for validation
const schema = Joi.object({
  name: Joi.string().min(2).required().label("Name"),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .label("Email"),
  password: Joi.string()
    .min(8)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    )
    .required()
    .label("Password")
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
});

const RegisterForm = () => {
  // State for form fields and errors
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const { login, authToken } = useAuth();
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form Data: ", formData);

    // Validate form before submission
    const formErrors = validateForm();
    setErrors(formErrors || {});

    if (formErrors) {
      console.log("Form contains errors.");
    } else {
      console.log("Form Data: ", formData);

      userService
        .Create(formData)
        .then((res) => {
          console.log("Register successfully: ", res);
          toast.success("Register successfully!", {
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
          login(res);
          navigate("/");
        })
        .catch((err) => {
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
        transition={Bounce}
      />
      {authToken && <Navigate to="/" replace={true} />}
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#F5F4FA",
          borderRadius: "20px",
          padding: { xs: "30px", sm: "40px", md: "60px" }, // Responsive padding
          marginTop: "30px",
          maxWidth: { xs: "90%", sm: "80%", md: "50%" }, // Responsive width
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <Box
            sx={{
              backgroundImage: "url(../src/assets/Register.png)",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              width: "43px",
              height: "43px",
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
          <Typography variant="h5" sx={{ textAlign: "center" }} gutterBottom>
            Sign Up
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            onKeyPress={(e) => {
              const char = String.fromCharCode(e.keyCode || e.which);
              if (!/^[a-zA-Z\s]*$/.test(char)) {
                e.preventDefault(); // Prevents the user from entering numbers or special characters
              }
            }}
            margin="normal"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            type="email"
            onKeyPress={(e) => {
              const char = String.fromCharCode(e.keyCode || e.which);
              if (!/^[a-zA-Z0-9.@]*$/.test(char)) {
                e.preventDefault(); // Prevents the user from entering numbers or special characters
              }
            }}
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

          <Link to="/signin" style={{ textDecoration: "none" }}>
            <Typography
              variant="subtitle1"
              sx={{ textAlign: "left", marginTop: "10px" }}
            >
              Already have an account? Sign In
            </Typography>
          </Link>

          {errors && Object.keys(errors).length > 0 && (
            <Alert severity="error">{Object.values(errors).join(", ")}</Alert>
          )}

          {/* Add Button */}
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              sx={{
                borderRadius: "8px",
                backgroundColor: "#7350F5",
                height: "50px",
                marginTop: "20px",
              }}
            >
              Register
            </Button>
          </Box>
        </form>
        <Login />
      </Box>
    </>
  );
};

export default RegisterForm;
