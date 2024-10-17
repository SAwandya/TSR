import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  List,
  ListItemText,
  Divider,
  CircularProgress,
  Grid,
  Button,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import jsPDF from "jspdf";
import "jspdf-autotable";

const AllBookings = () => {
  const { getCurrentUser } = useAuth();
  const customerEmail = getCurrentUser().email;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/bookings");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerEmail]);

  const generatePDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Theater Name",
      "Seats",
      "Total Amount",
      "Booking Date",
      "Booking Time",
      "Customer Name",
      "Customer Email",
    ];
    const tableRows = [];

    orders.forEach((order) => {
      const orderData = [
        order.theaterName,
        order.seats.join(", "),
        order.totalAmount,
        order.bookingDate,
        order.bookingTime,
        order.customerName,
        order.customerEmail,
      ];
      tableRows.push(orderData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("All Bookings Report", 14, 15);
    doc.save("bookings_report.pdf");
  };

  const downloadCSV = () => {
    const csvRows = [];
    const headers = [
      "Theater Name",
      "Seats",
      "Total Amount",
      "Booking Date",
      "Booking Time",
      "Customer Name",
      "Customer Email",
    ];
    csvRows.push(headers.join(",")); // Add header row

    orders.forEach((order) => {
      const orderData = [
        order.theaterName,
        order.seats.join(", "),
        order.totalAmount,
        order.bookingDate,
        order.bookingTime,
        order.customerName,
        order.customerEmail,
      ];
      csvRows.push(orderData.join(",")); // Add each order as a row
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "bookings_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <CircularProgress />;
  }

  // const [query, setQuery] = React.useState("");

  // const keys = ["theaterName"];

  // const search = (data) => {
  //   return data?.filter((item) =>
  //     keys.some((key) => item[key].toLowerCase().includes(query))
  //   );
  // };

  return (
    <div style={{ padding: "20px", marginRight: "60px" }}>
      <Typography variant="h4" gutterBottom style={{ fontSize: "2rem" }}>
        All Bookings
      </Typography>
      {/* PDF Generation Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={generatePDF}
        style={{
          marginBottom: "20px",
          backgroundColor: "#5C2FC2",
          color: "white",
        }}
      >
        Generate PDF Report
      </Button>

      {/* CSV Download Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={downloadCSV}
        style={{
          marginBottom: "20px",
          marginLeft: "10px",
          backgroundColor: "#5C2FC2",
          color: "white",
        }}
      >
        Download CSV Report
      </Button>

      {orders.length === 0 ? (
        <Typography style={{ fontSize: "1.25rem" }}>No orders found</Typography>
      ) : (
        <List>
          {orders.map((order) => (
            <Paper
              key={order._id}
              style={{
                marginBottom: "20px",
                padding: "20px",
                backgroundColor: "#FFE1FF",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <ListItemText
                    primaryTypographyProps={{
                      style: { fontSize: "1.5rem", fontWeight: "bold" },
                    }}
                    secondaryTypographyProps={{
                      style: { fontSize: "1.25rem" },
                    }}
                    primary={`Theater: ${order.theaterName}`}
                    secondary={`Seats: ${order.seats.join(
                      ", "
                    )} | Total Amount: $${order.totalAmount}`}
                  />
                </Grid>
                <Grid item xs={12} sm={4} style={{ textAlign: "right" }}>
                  <Typography
                    variant="subtitle1"
                    style={{ fontSize: "1.25rem", fontWeight: "bold" }}
                  >
                    {`Booking Date: ${order.bookingDate}`}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    style={{ fontSize: "1.25rem", fontWeight: "bold" }}
                  >
                    {`Booking Time: ${order.bookingTime}`}
                  </Typography>
                </Grid>
              </Grid>
              <Divider style={{ margin: "10px 0" }} />
              <Typography
                variant="body2"
                style={{ fontSize: "1rem", color: "#555" }}
              >
                Customer Name: {order.customerName}
              </Typography>
              <Typography
                variant="body2"
                style={{ fontSize: "1rem", color: "#555" }}
              >
                Customer Email: {order.customerEmail}
              </Typography>
            </Paper>
          ))}
        </List>
      )}
    </div>
  );
};

export default AllBookings;
