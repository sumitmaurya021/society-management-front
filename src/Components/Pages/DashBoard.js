import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
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
import { FcBullish } from "react-icons/fc";
import { FcTodoList } from "react-icons/fc";
import { FcClock } from "react-icons/fc";
import './DashBoard.css';
import { ThreeDots } from "react-loader-spinner";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  const [open, setOpen] = useState(false);
  const [maintenanceBillSummary, setMaintenanceBillSummary] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const accessToken = localStorage.getItem("access_token");

  const fetchBuildings = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/buildings", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setBuildings(response.data.buildings);
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

  const fetchDashboard = async () => {
    try {
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
        setShow(true);
      } else {
        toast.error("Error fetching users");
      }
    } catch (error) {
      toast.error("Error fetching users");
    }
  };

  const fetchMaintenanceBillSummary = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/buildings/1/maintenance_bill_summary",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        setMaintenanceBillSummary(response.data.maintenance_bill_summary[0]);
      } else {
        toast.error("Error fetching maintenance bill summary");
      }
    } catch (error) {
      toast.error("Error fetching maintenance bill summary");
      setIsLoading(false)
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    fetchDashboard();
    fetchUsers();
    fetchBuildings();
    fetchMaintenanceBillSummary();
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBuilding({
      ...building,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    setIsCreating(true);
    setLoading(true);
    setSuccessMessage("");
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
          handleClose();
          setIsCreating(false);
        }, 2000);
      } else {
        setLoading(false);
        setIsCreating(false);
        toast.error("Failed to create building");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to create building: " + error.message);
      console.error("Failed to create building:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
    <div style={{overflow: 'auto'}}>
      <ToastContainer stacked />
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <Box p={3}>
          <div className="d-flex justify-content-between align-items-center">
            <Typography variant="h3" gutterBottom>Dashboard</Typography>
            <button className="btn btn-sm btn-primary" onClick={handleClickOpen}>Create Building</button>
          </div>

          <Dialog
            open={open}
            TransitionComponent={Transition}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
              sx: { padding: 2, maxWidth: '600px' }
            }}
          >
            <DialogTitle>Create Building</DialogTitle>
            <DialogContent>
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
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">Cancel</Button>
              <Button onClick={handleSubmit} color="primary">            
                {loading ? (
              <CircularProgress size={24} />
            ) : (
              "Create"
            )}</Button>
            </DialogActions>
          </Dialog>

          <Box mt={2} mb={2} p={3}>
            {maintenanceBillSummary ? (
              <Box display="flex" gap={2} style={{justifyContent: 'space-around'}}>
                <Box component={Paper} p={2} display="flex" flexDirection="row" alignItems="center" width="330px" height="120px" style={{justifyContent: 'space-around', alignItems: 'center'}}>
                  <div className="d-flex flex-column">
                    <Typography variant="h6" style={{fontSize: '13px', marginBottom: '10px'}}>Total Amount</Typography>
                    <Typography variant="h5">₹{maintenanceBillSummary.total_amount}</Typography>
                  </div>
                  <div style={{fontSize: '60px'}}>
                    <FcTodoList />
                  </div>
                </Box>
                <Box component={Paper} p={2} display="flex" flexDirection="row" alignItems="center" width="330px" height="120px" style={{justifyContent: 'space-around', alignItems: 'center'}}>
                  <div className="d-flex flex-column">
                    <Typography variant="h6" style={{fontSize: '13px', marginBottom: '10px'}}>Due Payments</Typography>
                    <Typography variant="h5">₹{maintenanceBillSummary.remaining_payments}</Typography>
                  </div>
                  <div style={{fontSize: '60px'}}>
                    <FcClock />
                  </div>
                </Box>
                <Box component={Paper} p={2} display="flex" flexDirection="row" alignItems="center" width="330px" height="120px" style={{justifyContent: 'space-around', alignItems: 'center'}}>
                  <div className="d-flex flex-column">
                    <Typography variant="h6" style={{fontSize: '13px', marginBottom: '10px'}}>Payments Received</Typography>
                    <Typography variant="h5">₹{maintenanceBillSummary.total_payments_received}</Typography>
                  </div>
                  <div style={{fontSize: '60px'}}>
                    <FcBullish />
                  </div>
                </Box>
              </Box>
            ) : (
              <div className="d-flex justify-content-center">
                <ThreeDots
                visible={true}
                height="50"
                width="50"
                color="#1976d2"
                radius="9"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
      )}
    </Box>

          <div className="d-flex gap-3">
            <FormControl fullWidth margin="normal">
              <InputLabel id="building-select-label" className="select-label">Building</InputLabel>
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
              <InputLabel id="block-select-label" className="select-label">Block</InputLabel>
              <Select
                labelId="block-select-label"
                value={blockId}
                onChange={handleBlockChange}
              >
                {Array.isArray(blocks) && blocks.map((block) => (
                  <MenuItem key={block.id} value={block.id}>
                    {block.block_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" disabled={!blockId}>
              <InputLabel id="floor-select-label" className="select-label">Floor</InputLabel>
              <Select
                labelId="floor-select-label"
                value={floorId}
                onChange={handleFloorChange}
              >
                {Array.isArray(floors) && floors.map((floor) => (
                  <MenuItem key={floor.id} value={floor.id}>
                    {floor.floor_number}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="text-center">Room Number</TableCell>
                  <TableCell className="text-center">User Name</TableCell>
                  <TableCell className="text-center">User Email</TableCell>
                  <TableCell className="text-center">User Role</TableCell>
                  <TableCell className="text-center">Mobile Number</TableCell>
                  <TableCell className="text-center">User Status</TableCell>
                  <TableCell className="text-center">User Gender</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(rooms) && rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="text-center">{room.room_number.length === 0 ? `-` : room.room_number}</TableCell>
                    <TableCell className="text-center">{room.user_name}</TableCell>
                    <TableCell className="text-center">{room.user_email}</TableCell>
                    <TableCell className="text-center text-capitalize">{room.user_role}</TableCell>
                    <TableCell className="text-center">{room.user_mobile}</TableCell>
                    <TableCell className="text-center text-capitalize">{room.user_status}</TableCell>
                    <TableCell className="text-center text-capitalize">{room.user_gender}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box mt={4}>
            <Box mt={4}>
              <Typography variant="h4" gutterBottom>User Types</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: "Regular Users", value: users.filter(user => user.role === "customer").length },
                    { name: "Admins", value: users.filter(user => user.role === "admin").length },
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
      </div>
    </>
  );
};

export default Dashboard;
