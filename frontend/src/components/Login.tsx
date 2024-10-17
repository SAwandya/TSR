import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Paper, Button } from "@mui/material";
// import GoogleIcon from "@mui/icons-material/Google";
import googleIcon from "../assets/googleIcon.png";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/");
    }
  }, [location, navigate]);

  const handleLogin = () => {
    window.location.href = `http://localhost:3000/api/auth/google`;
  };

  return (
    <Box sx={{ display: "flex", marginTop: "20px" }}>
      <Button
        variant="outlined"
        startIcon={
          <Box
            component="img"
            sx={{ marginRight: "20px" }}
            src={googleIcon}
            alt="Google logo"
            sx={{ width: "20px", height: "20px" }} // Customize size as needed
          />
        }
        onClick={handleLogin}
        sx={{
          textTransform: "none", // Ensure the button text is not all uppercase
          backgroundColor: "#fff", // Google button white background
          color: "#000", // Google button black text
          borderColor: "#dcdcdc", // Light grey border
          "&:hover": {
            backgroundColor: "#f5f5f5",
            borderColor: "#c2c2c2",
          },
          padding: "8px 16px",
          fontWeight: 500,
          fontSize: "14px",
        }}
      >
        Sign in with Google
      </Button>
    </Box>
  );
};

export default Login;
