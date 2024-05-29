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
  const [users, setUsers] = useState([]);
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
          setIsLoading(false);
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
          <animated.div style={fade}>
            <Typography variant="h3" gutterBottom className="dashboard-heading">
              Dashboard
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
                    <TableCell>Mobile Number</TableCell>
                    <TableCell>Block</TableCell>
                    <TableCell>Floor</TableCell>
                    <TableCell>Room</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Gender</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.mobile_number}</TableCell>
                      <TableCell>{user.block}</TableCell>
                      <TableCell>{user.floor}</TableCell>
                      <TableCell>{user.room}</TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell>{user.gender}</TableCell>
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
                    { name: "Admin Users", value: users.filter(user => user.role === "admin").length },
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
          </animated.div>
        </Box>
      )}
    </>
  );
};

export default Dashboard;
