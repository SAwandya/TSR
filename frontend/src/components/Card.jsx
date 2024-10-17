import { Box, Typography } from "@mui/material";
import BadgeTwoToneIcon from "@mui/icons-material/BadgeTwoTone";
import useEmployees from "../hooks/useEmployees";


const Card = ({children, title, number}) => {

  const { data } = useEmployees();

  return (
    <Box
      sx={{
        height: "17vh",
        width: "60vh",
        backgroundColor: "#F0EEFA",
        borderRadius: "30px",
        display: "flex",
      }}
    >
      {children}
      <Box sx={{ marginTop: "25px" }}>
        <Typography
          sx={{
            fontWeight: "550",
            fontSize: "20px",
            marginLeft: "5px",
            color: "#7f8c9b",
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            marginTop: "-5px",
            color: "#335887",
            fontWeight: "100",
            fontSize: "36px",
          }}
        >
          {number}
        </Typography>
      </Box>
    </Box>
  );
}

export default Card