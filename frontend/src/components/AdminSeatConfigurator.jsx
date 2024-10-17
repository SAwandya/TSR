import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  Grid,
} from "@mui/material";
import axios from "axios"; // For making API requests
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast, Bounce } from "react-toastify";


const AdminSeatConfigurator = () => {
  const [theater, setTheater] = useState("");
  const [location, setLocation] = useState("");
  const [sections, setSections] = useState([]);
  const [sectionName, setSectionName] = useState("");
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);

  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const buttonSize = isSmallScreen ? 30 : 50; // Button size adjustment

  // Add a new section
  const handleAddSection = () => {
    if (sectionName && rows > 0 && cols > 0) {
      const newSection = {
        id: uuidv4(),
        name: sectionName,
        rows,
        cols,
        layout: Array(rows)
          .fill(null)
          .map(() => Array(cols).fill(true)), // Initialize seats as available
      };
      setSections([...sections, newSection]);
      setSectionName("");
      setRows(0);
      setCols(0);
    }
  };

  // Handle seat toggle (to delete a seat)
  const handleSeatToggle = (sectionId, row, col) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        const updatedLayout = [...section.layout];
        updatedLayout[row][col] = !updatedLayout[row][col]; // Toggle availability
        return { ...section, layout: updatedLayout };
      }
      return section;
    });
    setSections(updatedSections);
  };

  // Handle the "Confirm Configuration" button
  const handleConfigure = async () => {
    try {
      const requestBody = {
        location, // Theater location
        theater, // Theater ID or name
        sections, // Sections with seat layouts
      };
      console.log(requestBody);
      const response = await axios.post(
        "http://localhost:3000/api/seats/create",
        requestBody
      );
       toast.success("Theater added successfully!", {
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
      console.log(response); // Log success message
    } catch (error) {
      console.error("Error uploading seats:", error);
    }
  };

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#E5D9F2",
        borderRadius: 2,
        marginRight: "70px",
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
        Theater Seat Configurator
      </Typography>
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Theater Name"
          value={theater}
          onChange={(e) => setTheater(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Theater Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Section Name"
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Number of Rows"
              type="number"
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Number of Columns"
              type="number"
              value={cols}
              onChange={(e) => setCols(Number(e.target.value))}
              fullWidth
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          onClick={handleAddSection}
          sx={{ mb: 4, backgroundColor: "#5C2FC2", color: "white" }}
        >
          Add Section
        </Button>
      </Box>
      {/* Display Sections */}
      {sections.map((section) => (
        <Box
          key={section.id}
          sx={{
            mb: 4,
            padding: 2,
            backgroundColor: "#E5D9F2",
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            {section.name} Section
          </Typography>
          <Grid container justifyContent="center">
            {section.layout.map((row, rowIndex) => (
              <Grid
                container
                key={rowIndex}
                justifyContent="center"
                sx={{ mb: 1 }}
              >
                {row.map((isAvailable, colIndex) => (
                  <Box
                    key={colIndex}
                    onClick={() =>
                      handleSeatToggle(section.id, rowIndex, colIndex)
                    }
                    sx={{
                      width: buttonSize,
                      height: buttonSize,
                      margin: 0.5,
                      backgroundColor: isAvailable ? "#80C4E9" : "gray",
                      "&:hover": {
                        backgroundColor: isAvailable ? "#5C2FC2" : "",
                      },
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
      <Button
        variant="contained"
        sx={{ backgroundColor: "#5C2FC2", color: "white" }}
        onClick={handleConfigure}
      >
        Confirm Configuration
      </Button>
    </Box>
  );
};

export default AdminSeatConfigurator;
