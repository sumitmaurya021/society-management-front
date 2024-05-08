import { useEffect, useState } from "react";
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
import { useSpring, animated } from "react-spring";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../Spinner";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({});
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
          setShow(true);
          setIsLoading(false);
        } else {
          toast.error("Error fetching dashboard");
        }
      } catch (error) {
        toast.error("Error fetching dashboard", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const fade = useSpring({
    opacity: show ? 1 : 0,
    marginTop: show ? 0 : -100,
    from: { opacity: 0, marginTop: -100 },
  });

  return (
    <>
    {isLoading ? (
      <Spinner />
    ) : (
      <Box p={3}>
        <ToastContainer />
        <animated.div style={fade}>
          <Typography variant="h3" gutterBottom className="dashboard-heading">
            DashBoard
          </Typography>

          {/* Table for Users */}
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
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboard.admin_users?.map((adminUser) => (
                  <TableRow key={adminUser.id}>
                    <TableCell>{adminUser.name}</TableCell>
                    <TableCell>{adminUser.email}</TableCell>
                    <TableCell>{adminUser.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Charts with Animations */}
          <Box mt={4}>
            <Typography variant="h4" gutterBottom>
              User Types
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: "Admin Users", value: dashboard.admin_users_count },
                  {
                    name: "Regular Users",
                    value: dashboard.regular_users_count,
                  },
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

          <Box mt={4}>
            <Typography variant="h4" gutterBottom>
              Building Structure
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={dashboard.buildings?.flatMap((building) =>
                  building.blocks?.map((block) => ({
                    building_name: building.name,
                    block_name: block.name,
                    blocks_count: building.blocks_count,
                    floors_count: block.floors?.length || 0,
                    rooms_count:
                      block.floors?.reduce(
                        (total, floor) => total + (floor.rooms?.length || 0),
                        0
                      ) || 0,
                  }))
                )}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="block_name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="blocks_count" name="Blocks" fill="#8884d8" />
                <Bar dataKey="floors_count" name="Floors" fill="#82ca9d" />
                <Bar dataKey="rooms_count" name="Rooms" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </animated.div>
      </Box>
    )}
    </>
  );
};

export default Dashboard;
