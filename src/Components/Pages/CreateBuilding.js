import React, { useState } from "react";
import { Button, TextField, Typography, FormControlLabel, Checkbox, Box, Paper } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { Fade } from "react-awesome-reveal";
import 'react-toastify/dist/ReactToastify.css';
import LoadingOverlay from "react-loading-overlay";

function CreateBuilding() {
  const [building, setBuilding] = useState({
    building_name: "",
    building_address: "",
    total_blocks: "",
    number_of_floors: "",
    number_of_rooms_per_floor: "",
    ground_floor: false,
    starting_room_number: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBuilding({
      ...building,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSuccessMessage("");
    const accessToken = localStorage.getItem("access_token");
    const buildingData = {
      ...building,
      total_blocks: parseInt(building.total_blocks, 10),
      number_of_floors: parseInt(building.number_of_floors, 10),
      number_of_rooms_per_floor: parseInt(building.number_of_rooms_per_floor, 10),
      starting_room_number: parseInt(building.starting_room_number, 10),
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/buildings",
        { building: buildingData, access_token: accessToken },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 201) {
        setSuccessMessage("Your building has been created successfully!");
        toast.success("Building created successfully!");
        setTimeout(() => {
          setLoading(false);
          setSuccessMessage("");
          setBuilding({
            building_name: "",
            building_address: "",
            total_blocks: "",
            number_of_floors: "",
            number_of_rooms_per_floor: "",
            ground_floor: false,
            starting_room_number: "",
          });
        }, 2000);
      } else {
        setLoading(false);
        toast.error("Failed to create building");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to create building: " + error.message);
      console.error("Failed to create building:", error);
    }
  };

  return (
    <LoadingOverlay
      active={loading}
      spinner
      text={successMessage || "Creating your building..."}
    >
      <Box sx={{ padding: 2, maxWidth: '100%', margin: '0 auto' }}>
        <Fade>
          <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#f9f9f9' }}>
            <Typography
              variant="h4"
              gutterBottom
              className="text-center"
              sx={{ marginBottom: 2 }}
            >
              Create Building
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                name="building_name"
                label="Building Name"
                value={building.building_name}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="building_address"
                label="Building Address"
                value={building.building_address}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="total_blocks"
                label="Total Blocks"
                type="number"
                value={building.total_blocks}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="number_of_floors"
                label="Number of Floors"
                type="number"
                value={building.number_of_floors}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="number_of_rooms_per_floor"
                label="Number of Rooms per Floor"
                type="number"
                value={building.number_of_rooms_per_floor}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="starting_room_number"
                label="Starting Room Number"
                type="number"
                value={building.starting_room_number}
                onChange={handleChange}
                fullWidth
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={building.ground_floor}
                    onChange={handleChange}
                    name="ground_floor"
                    color="primary"
                  />
                }
                label="Ground Floor"
              />
              <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
                Create
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Box>
    </LoadingOverlay>
  );
}

export default CreateBuilding;
