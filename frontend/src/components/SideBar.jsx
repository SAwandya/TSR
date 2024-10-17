import React from "react";
import { Box, Button, Drawer, Typography } from "@mui/material";
import SideBarButton from "./SideBarButton";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const SideBar = ({ setActiveContent, activeContent }) => {
  const drawerWidth = 240;

  const {logout} = useAuth();

  const navigate = useNavigate()

  const handleLogout = () => {
    logout();
    navigate("/signin");
  }

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: "300px",
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Typography
        sx={{
          marginTop: "29px",
          fontSize: "30px",
          fontWeight: "bold",
          color: "#381aa3",
          textAlign: "center", // Center text alignment
        }}
      >
        Dashboard
      </Typography>
      <Box
        sx={{
          p: 2,
          marginTop: "20px",
          display: "flex", // Use flex display
          flexDirection: "column", // Arrange items in a column
          alignItems: "center", // Center align items
        }}
      >
        <SideBarButton
          activeContent={activeContent}
          setActiveContent={setActiveContent}
          title="Layout"
        />

        <SideBarButton
          activeContent={activeContent}
          setActiveContent={setActiveContent}
          title="Bookings"
        />

        <SideBarButton
          activeContent={activeContent}
          setActiveContent={setActiveContent}
          title="Users"
        />

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#8A6BFF",
            width: "252px",
            height: "30px",
            marginTop: "300px", // Push logout button to the bottom
            borderRadius: "5px",
            
          }}
          onClick={handleLogout}
          fullWidth
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
};

export default SideBar;
