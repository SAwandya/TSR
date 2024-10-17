import { Button } from "@mui/material";

const SideBarButton = ({ activeContent, setActiveContent, title }) => {

  return (
    <Button
      variant={activeContent == title ? "contained" : "outlined"}
      sx={{
        backgroundColor: activeContent == title ? "#5932EA" : "#EFEAFF",
        width: "252px",
        height: "52px",
        marginTop: "20px",
        borderRadius: "10px",
      }}
      onClick={() => setActiveContent(title)}
      fullWidth
    >
      {title}
    </Button>
  );
};

export default SideBarButton;
