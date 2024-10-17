import { useState } from "react";
import {
  CssBaseline,
  Typography,
  Grid,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { RenderContentProvider } from "../Context/RenderContentContext";
import AdminSeatConfigurator from "../components/AdminSeatConfigurator";
import AdminShowTimeForm from "../components/AdminShowTimeForm";
import { useAuth } from "../Context/AuthContext";
import AllBookings from "../components/AllBookings";
import UsersTable from "./UsersTable";
import SideBar from "../components/SideBar";

const DashboardLayout = () => {
  // State to manage the active content
  const [activeContent, setActiveContent] = useState("Layout");

  const navigate = useNavigate();

  const { authToken } = useAuth();

  if (!authToken) {
    navigate("/signin");
  }

  // Function to render dynamic content based on button click
  const renderContent = () => {
    switch (activeContent) {
      case "Layout":
        return (
          <>
            <AdminSeatConfigurator />
            <AdminShowTimeForm />
          </>
        );
      case "Bookings":
        return <AllBookings />;
      case "Users":
        return <UsersTable/>;
      default:
        return <Typography variant="h4">Welcome to the Home Page</Typography>;
    }
  };

  return (
    <Grid container>
      <CssBaseline />

      {/* Sidebar */}
      <Grid item xs={3}>
        <SideBar
          setActiveContent={setActiveContent}
          activeContent={activeContent}
        />
      </Grid>

      {/* Main Content Area */}
      <Grid item xs={9}>
        <RenderContentProvider renderContent={renderContent}>
          <div style={{ width: "100%" }}>
            {/* Your layout components like header, sidebar, etc. */}
            <Outlet />
          </div>
        </RenderContentProvider>
      </Grid>
    </Grid>
  );
};

export default DashboardLayout;
