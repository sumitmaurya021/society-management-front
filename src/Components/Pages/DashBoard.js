import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
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

const Dashboard = () => {
  const [buildingId, setBuildingId] = useState("");
  const [blockId, setBlockId] = useState("");
  const [floorId, setFloorId] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dashboard, setDashboard] = useState({});
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);

  const accessToken = localStorage.getItem("access_token");

  const fetchBuildings = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/buildings", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setBuildings(response.data.buildings); // Ensure response data is correctly assigned
    } catch (error) {
      toast.error("Error fetching buildings");
    }
  };

  const fetchBlocks = async (buildingId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/buildings/${buildingId}/blocks`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setBlocks(response.data);
    } catch (error) {
      toast.error("Error fetching blocks");
    }
  };

  const fetchFloors = async (blockId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/buildings/${buildingId}/blocks/${blockId}/floors`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setFloors(response.data);
    } catch (error) {
      toast.error("Error fetching floors");
    }
  };

  const fetchRooms = async (floorId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/buildings/${buildingId}/blocks/${blockId}/floors/${floorId}/rooms`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setRooms(response.data);
    } catch (error) {
      toast.error("Error fetching rooms");
    }
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          console.error("Access token not found in local storage");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const response = await axios.get(
          "http://localhost:3000/api/v1/dashboards",
          config
        );

        if (response.status === 200) {
          setDashboard(response.data);
          toast.success("Dashboard fetched successfully");
        } else {
          toast.error("Error fetching dashboard");
        }
      } catch (error) {
        toast.error("Error fetching dashboard");
      }
    };

    const fetchUsers = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          console.error("Access token not found in local storage");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const response = await axios.get(
          "http://localhost:3000/api/v1/users",
          config
        );

        if (response.status === 200) {
          setUsers(response.data.users);
          toast.success("Users fetched successfully");
          setShow(true);
        } else {
          toast.error("Error fetching users");
        }
      } catch (error) {
        toast.error("Error fetching users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
    fetchUsers();
    fetchBuildings(); // Fetch buildings when the component mounts
  }, []);

  useEffect(() => {
    if (buildingId) {
      fetchBlocks(buildingId);
    }
  }, [buildingId]);

  useEffect(() => {
    if (blockId) {
      fetchFloors(blockId);
    }
  }, [blockId]);

  useEffect(() => {
    if (floorId) {
      fetchRooms(floorId);
    }
  }, [floorId]);

  const handleBuildingChange = (event) => {
    setBuildingId(event.target.value);
    setBlockId("");
    setFloorId("");
    setBlocks([]);
    setFloors([]);
    setRooms([]);
  };

  const handleBlockChange = (event) => {
    setBlockId(event.target.value);
    setFloorId("");
    setFloors([]);
    setRooms([]);
  };

  const handleFloorChange = (event) => {
    setFloorId(event.target.value);
    setRooms([]);
  };

  return (
    <>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <Box p={3}>
          <Typography variant="h3" gutterBottom>
            Dashboard
          </Typography>
          <div className="">
          <FormControl fullWidth margin="normal">
            <InputLabel id="building-select-label">Building</InputLabel>
            <Select
              labelId="building-select-label"
              value={buildingId}
              onChange={handleBuildingChange}
            >
              {Array.isArray(buildings) && buildings.map((building) => (
                <MenuItem key={building.id} value={building.id}>
                  {building.building_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" disabled={!buildingId}>
            <InputLabel id="block-select-label">Block</InputLabel>
            <Select
              labelId="block-select-label"
              value={blockId}
              onChange={handleBlockChange}
            >
              {Array.isArray(blocks) && blocks.map((block) => (
                <MenuItem key={block.id} value={block.id}>
                  {block.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" disabled={!blockId}>
            <InputLabel id="floor-select-label">Floor</InputLabel>
            <Select
              labelId="floor-select-label"
              value={floorId}
              onChange={handleFloorChange}
            >
              {Array.isArray(floors) && floors.map((floor) => (
                <MenuItem key={floor.id} value={floor.id}>
                  {floor.number}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          </div>

          <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Room Number</TableCell>
                  <TableCell>Unit Rate</TableCell>
                  <TableCell>Previous Unit</TableCell>
                  <TableCell>Updated Unit</TableCell>
                  <TableCell>Total Unit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(rooms) && rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>{room.room_number}</TableCell>
                    <TableCell>{room.unit_rate === null ? "-" : room.unit_rate }</TableCell>
                    <TableCell>{room.previous_unit === null ? "-" : room.previous_unit}</TableCell>
                    <TableCell>{room.updated_unit === null ? "-" : room.updated_unit}</TableCell>
                    <TableCell>{room.total_units === null ? "-" : room.total_units}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box mt={4}>
            <Typography variant="h4" gutterBottom>
              Users
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Mobile Number</TableCell>
                    <TableCell>Block</TableCell>
                    <TableCell>Floor</TableCell>
                    <TableCell>Room</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Gender</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(users) && users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.mobile_number}</TableCell>
                      <TableCell>{user.block}</TableCell>
                      <TableCell>{user.floor}</TableCell>
                      <TableCell>{user.room}</TableCell>
                      <TableCell style={{ color: user.status === "accepted" ? "green" : "red", textTransform: "capitalize" }}>{user.status}</TableCell>
                      <TableCell style={{ textTransform: "capitalize" }}>{user.gender}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box mt={4}>
              <Typography variant="h4" gutterBottom>
                User Types
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: "Regular Users", value: users.filter(user => user.role === "customer").length },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Dashboard;
