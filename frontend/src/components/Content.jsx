import React from "react";
import { Box, Typography } from "@mui/material";
import { useRenderContent } from "../Context/RenderContentContext";
import { useAuth } from "../Context/AuthContext";

const Content = () => {
  const renderContent = useRenderContent();

  const { getCurrentUser } = useAuth();

  console.log(getCurrentUser());

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, p: 0, marginLeft: '7px' }}>
        <Box sx={{ display: "flex" }}>
          {" "}
          <Typography
            sx={{
              textAlign: "left",
              marginBottom: "20px",
              marginRight: "10px",
              color: "#8072b3",
              fontSize: "27px",
              fontWeight: "500",
              marginTop: "36px",
            }}
          >
            Welcome {getCurrentUser()?.name}!
          </Typography>
          <Box sx={{ marginTop: "-7px" }}>
            <Box
              sx={{
                backgroundImage: "url(../src/assets/wave.png)",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                width: "43px",
                height: "43px",
              }}
            ></Box>
          </Box>
        </Box>

       
        {renderContent()}
      </Box>
    </>
  );
};

export default Content;
