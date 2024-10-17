import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout"; // Importing Logout icon
import { useAuth } from "../Context/AuthContext";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const NavBar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const isMenuOpen = Boolean(anchorEl);
  const isDropdownOpen = Boolean(dropdownOpen);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownOpen = (event) => {
    setDropdownOpen(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setDropdownOpen(false);
  };

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          // Implement your logout logic
        }}
      >
        <IconButton onClick={() => handleLogout()} color="inherit" sx={{ mr: 1 }}>
          <LogoutIcon />
        </IconButton>
        Logout
      </MenuItem>
    </Menu>
  );

  const dropdownId = "primary-search-dropdown-menu";
  const renderDropdownMenu = (
    <Menu
      anchorEl={dropdownOpen}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      id={dropdownId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isDropdownOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <Link to="/">HOME</Link>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Link to="/mybookings">MY BOOKINGS</Link>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Link to="/salescarts"></Link>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "rgb(228, 177, 240, 0.6)",
          marginTop: "20px",
          borderRadius: "10px",
          color: "#1E5128",
          mx: "auto", // Center horizontally
          px: 4, // Add padding to the left and right
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Reservation System
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>

          <Box sx={{ flexGrow: 1 }} />

          {/* Responsive Dropdown Button with Margins */}
          <Box sx={{ display: { xs: "block", md: "none" }, mx: 2 }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={dropdownId}
              aria-haspopup="true"
              onClick={handleDropdownOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {/* Adding some horizontal space between buttons */}
            <Link to="/">
              <Button sx={buttonStyles}>HOME</Button>
            </Link>
            <Link to="/mybookings">
              <Button sx={buttonStyles}>MY BOOKINGS</Button>
            </Link>
            {/* <Link to="/salescarts">
              <Button sx={buttonStyles}></Button>
            </Link> */}
            <IconButton
              size="large"
              aria-label="show notifications"
              color="inherit"
            >
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
      {renderDropdownMenu}
    </Box>
  );
};

// Button styles for links
const buttonStyles = {
  backgroundColor: "rgba(155, 207, 83, 0.8)",
  fontSize: "17px",
  fontWeight: "bold",
  color: "#191919",
  borderRadius: "10px",
  mx: 2, // Add margin between buttons
};

export default NavBar;
