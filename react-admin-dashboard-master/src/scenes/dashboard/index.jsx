import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  Select,
  MenuItem,
} from "@mui/material";
import { tokens } from "../../theme";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalAtmOutlinedIcon from "@mui/icons-material/LocalAtmOutlined";
import DiscountOutlinedIcon from "@mui/icons-material/DiscountOutlined";
import HorizontalBarChart from "../../components/HorizontalBarChart";
import { mockBarData as mockData } from "../../data/mockData";
import { mockBarDatav2 as mockDatav2 } from "../../data/mockData";


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [selectedFrom, setSelectedFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");
  const [dateRange, setDateRange] = useState([]);


  const apiUrl = "http://localhost:6001/api/sales";
  let isSmall = true;

  useEffect(() => {
    fetchSalesData();
  }, []);

  useEffect(() => {
    // Get list of states from salesData
    const uniqueStates = [...new Set(salesData.map((item) => item.State))];
    setStates(uniqueStates);
    // Set selected state to the first state in the array
    if (uniqueStates.length > 0) {
      setSelectedState(uniqueStates[0]);
    }
  }, [salesData]);

  useEffect(() => {
    if (selectedState) {
      fetchDateRange(selectedState);
    }
  }, [selectedState]);

  const fetchSalesData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch sales data");
      }
      const data = await response.json();
      console.log("response", data);
      setSalesData(data);
    } catch (error) {
      console.error("Error fetching sales data:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDateRange = async (state) => {
    try {
      const response = await fetch(`http://localhost:6001/api/dates/${state}`);
      if (!response.ok) {
        throw new Error("Failed to fetch date range");
      }
      const { minDate, maxDate, totalSales } = await response.json();
      console.log('totalSales',totalSales);
      setMinDate(minDate);
      setMaxDate(maxDate);
      setSelectedFrom(minDate);
      setSelectedTo(maxDate);
    } catch (error) {
      console.error("Error fetching date range:", error.message);
    } 
  };
  
  // Function to calculate total for a specific property of sales data for a selected state
  const calculateTotalForState = (data, selectedState, propertyName) => {
    console.log('selectedState',selectedState);
    // Filter sales data for the selected state
    const selectedStateSales = data.filter(sale => sale.State === selectedState);
    // Calculate total for the specified property
    const total = selectedStateSales.reduce((acc, item) => acc + item[propertyName], 0);
    return total;
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  const handleFromChange = (event) => {
    setSelectedFrom(event.target.value);
  };

  const handleToChange = (event) => {
    const selectedToDate = event.target.value;

    // Ensure selectedToDate is not before selectedFrom
    if (selectedFrom && new Date(selectedToDate) < new Date(selectedFrom)) {
      // If selectedToDate is before selectedFrom, set it to selectedFrom
      setSelectedTo(selectedFrom);
    } else {
      // Otherwise, set it to the selected value
      setSelectedTo(selectedToDate);
    }
  };

  const generateDateRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dateRange = [];
    for (
      let date = startDate;
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      dateRange.push(
        new Date(date).toISOString().split("T")[0]
      ); /* Format date as 'YYYY-MM-DD' */
    }
    return dateRange;
  };

  useEffect(() => {
    if (minDate && maxDate) {
      const range = generateDateRange(minDate, maxDate);
      setDateRange(range);
    }
  }, [minDate, maxDate]);

  return (
    <>
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="80vh" /* Adjust height as needed */
        >
          <CircularProgress color="secondary" size={60} />
        </Box>
      ) : (
        <Box m="20px">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            p={2}
          >
            {/* Sales Overview */}
            <Typography variant="h4" component="h2">
              Sales Overview
            </Typography>
            {/* Select State */}
            <Box display="flex" alignItems="center">
              <Typography variant="h6" sx={{ mr: 2 }}>
                Select State:
              </Typography>
              <Select value={selectedState} onChange={handleStateChange}>
                {states.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* From Date */}
            <Box display="flex" alignItems="center">
              <Typography variant="h6" sx={{ mr: 2 }}>
                Select From date :
              </Typography>
              <Select value={selectedFrom} onChange={handleFromChange}>
                {dateRange.map((date) => (
                  <MenuItem key={date} value={date}>
                    {date}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* To Date */}
            <Box display="flex" alignItems="center">
              <Typography variant="h6" sx={{ mr: 2 }}>
                Select To date :
              </Typography>
              <Select value={selectedTo} onChange={handleToChange}>
                {dateRange
                  /* Filter out dates before the selected "From" date */
                  .filter((date) => new Date(date) >= new Date(selectedFrom))
                  .map((date) => (
                    <MenuItem key={date} value={date}>
                      {date}
                    </MenuItem>
                  ))}
              </Select>
            </Box>
          </Box>
          {/* GRID & CHARTS */}
          <Box
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gridAutoRows="140px"
            gap="20px"
          >
            {/* ROW 1 */}
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={Math.round(calculateTotalForState(salesData, selectedState, "Sales"))}
                subtitle="Total Sales"
                icon={
                  <AttachMoneyIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "40px" }}
                  />
                }
              />
            </Box>
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={Math.round(calculateTotalForState(salesData, selectedState,  "Quantity"))}
                subtitle="Quantity Sold"
                icon={
                  <PointOfSaleIcon
                    sx={{ color: 'violet', fontSize: "40px" }}
                  />
                }
              />
            </Box>
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={Math.round(calculateTotalForState(salesData, selectedState, "Discount"))}
                subtitle="Discounts"
                icon={
                  <DiscountOutlinedIcon
                    sx={{ color: 'yellow', fontSize: "40px" }}
                  />
                }
              />
            </Box>
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={Math.round(calculateTotalForState(salesData, selectedState, "Profit"))}
                subtitle="Profit"
                icon={
                  <LocalAtmOutlinedIcon
                    sx={{ color: colors.redAccent[600], fontSize: "40px" }}
                  />
                }
              />
            </Box>

            {/* ROW 2 */}
            <Box
              gridColumn="span 6"
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
            >
              <Box
                mt="25px"
                p="0 30px"
                display="flex "
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight="600"
                    color={colors.grey[100]}
                  >
                    Sales By City
                  </Typography>
                </Box>
              </Box>
              <Box height="250px" m="-20px 0 0 0">
                <HorizontalBarChart data={mockData} isDashboard={true} isSmall={isSmall}/>
              </Box>
            </Box>
            <Box
              gridColumn="span 6"
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
            >
              <Box
                mt="25px"
                p="0 30px"
                display="flex "
                justifyContent="space-between"
                alignItems="center"
              >
              </Box>
              <Box height="250px" m="-20px 0 0 0">
                <HorizontalBarChart data={mockDatav2} isDashboard={true} />
              </Box>
            </Box>

            {/* ROW 3 */}
            <Box
              gridColumn="span 4"
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
              p="30px"
            >
              <Typography variant="h5" fontWeight="600">
                Sales By Category
              </Typography>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mt="25px"
              >
                <ProgressCircle size="125" />
              </Box>
            </Box>
            <Box
              gridColumn="span 4"
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
            >
              <Typography
                variant="h5"
                fontWeight="600"
                sx={{ padding: "30px 30px 0 30px" }}
              >
                Sales By Sub Category
              </Typography>
              <Box height="250px" mt="-20px">
                <BarChart isDashboard={true} />
              </Box>
            </Box>
            <Box
              gridColumn="span 4"
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
              p="30px"
            >
              <Typography variant="h5" fontWeight="600">
                Sales By Segments
              </Typography>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mt="25px"
              >
                <ProgressCircle size="125" />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Dashboard;
