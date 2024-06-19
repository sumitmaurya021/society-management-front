import React, { useEffect, useState } from 'react'
import './VehicleDetails.css'
import { toast, ToastContainer } from 'react-toastify';
import axios from "axios";
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slide,
  } from "@mui/material";
  import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from "recharts";

function VehicleDetails() {
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const accessToken = localStorage.getItem("access_token");

    const fetchVehicles = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        const response = await axios.get("http://localhost:3000/api/v1/get_all_vehicles", config);
        if (response.status === 200) {
          toast.success("Vehicles fetched successfully");  
          setVehicles(response.data.vehicles);
        } else {
          toast.error("Error fetching vehicles");
        }
        } catch (error) {
          toast.error("Error fetching vehicles");
        } finally {
          setIsLoading(false);
        }
      };

  useEffect(() => {
    fetchVehicles();
  }, []);




  return (
    <div>
        <ToastContainer />
        <Box p={3} mt={4}>
            <Typography variant="h4" gutterBottom>Vehicle Details</Typography>
            <ResponsiveContainer width="100%" height={300}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ textAlign: 'center' }}>Vehicle ID</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>Name</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>Email</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>Mobile Number</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>Floor Number</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>Block Name</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>Room Number</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>Total Two-Wheelers</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>Two-Wheeler Numbers</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>Total Four-Wheelers</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>Four-Wheeler Numbers</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell style={{ textAlign: 'center' }}>{vehicle.id}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{vehicle.name}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{vehicle.email}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{vehicle.mobile_number}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{vehicle.floor_number}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{vehicle.block_name}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{vehicle.room_number}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{vehicle.total_no_of_two_wheeler}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{vehicle.two_wheeler_numbers.join(", ")}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{vehicle.total_no_of_four_wheeler}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{vehicle.four_wheeler_numbers.join(", ")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            </ResponsiveContainer>
          </Box>
    </div>
  )
}

export default VehicleDetails
