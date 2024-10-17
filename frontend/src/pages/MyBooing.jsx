import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

const MyBooking = () => {
  const { getCurrentUser } = useAuth();
  const customerEmail = getCurrentUser().email;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/bookings/customer",
          {
            customerEmail: customerEmail,
          }
        );
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerEmail]);

  if (loading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "80px" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3, maxWidth: 800, margin: "100px auto auto auto" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontSize: "2rem", color: "#5C2FC2" }}
      >
        My Bookings
      </Typography>

      {orders?.length === 0 ? (
        <Typography sx={{ fontSize: "1.25rem", textAlign: "center" }}>
          No orders found
        </Typography>
      ) : (
        <List>
          {orders?.map((order) => (
            <Paper
              key={order._id}
              elevation={3}
              sx={{
                marginBottom: 2,
                padding: 2,
                backgroundColor: "#FFE1FF",
                borderRadius: "10px",
              }}
            >
              <ListItem>
                <ListItemText
                  primaryTypographyProps={{
                    style: { fontSize: "1.2rem", fontWeight: "bold" },
                  }}
                  secondaryTypographyProps={{ style: { fontSize: "1rem" } }}
                  primary={`Theater: ${order.theaterName}`}
                  secondary={`Seats: ${order.seats.join(
                    ", "
                  )} | Total Amount: $${order.totalAmount}`}
                />
              </ListItem>
              <ListItemText
                secondaryTypographyProps={{
                  style: { fontSize: "1rem", marginLeft: "15px" },
                }}
                secondary={`Booking Date: ${order.bookingDate} | Booking Time: ${order.bookingTime}`}
              />
              <Divider sx={{ marginY: 1 }} />
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
};

export default MyBooking;
