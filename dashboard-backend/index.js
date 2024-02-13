// app.js

const express = require("express");
const cors = require("cors");
const salesData = require("./sales.json");

const app = express();
const PORT = process.env.PORT || 6001;

app.use(cors());

// Endpoint to get all sales data
app.get("/api/sales", (req, res) => {
  res.json(salesData);
});

// Endpoint to get minimum and maximum dates for a state
app.get("/api/dates/:state", (req, res) => {
  // Get the selected state from the route parameter
  const selectedState = req.params.state;

  // Filter sales data for the selected state
  const stateSales = salesData.filter((sale) => sale.State === selectedState);

  // If no sales data found for the state, return an error response
  if (stateSales.length === 0) {
    return res.status(404).json({ message: "No sales data found for the selected state" });
  }

  // Find minimum and maximum dates
  const dates = stateSales.map((sale) => new Date(sale["Order Date"]));
  const minDate = new Date(Math.min(...dates)).toISOString().split("T")[0];
  const maxDate = new Date(Math.max(...dates)).toISOString().split("T")[0];
  // Return the minimum and maximum dates as JSON
  res.json({ minDate, maxDate });
});
 
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
