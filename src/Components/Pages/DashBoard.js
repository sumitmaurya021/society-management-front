import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import axios from 'axios';

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({});

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          console.error('Access token not found in local storage');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const response = await axios.get('http://localhost:3000/api/v1/dashboard', config);

        if (response.status === 200) {
          console.log('Dashboard fetched successfully');
          setDashboard(response.data);
        } else {
          console.error('Error fetching dashboard');
        }
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h3" gutterBottom>DashBoard</Typography>

      {/* User Information Table */}
      <Typography variant="h4" gutterBottom>User Information</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{dashboard.user?.email}</TableCell>
              <TableCell>{dashboard.user?.name}</TableCell>
              <TableCell>{dashboard.user?.role}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Buildings Table */}
      <Typography variant="h4" gutterBottom>Buildings</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dashboard.building?.map((building) => (
              <TableRow key={building.id}>
                <TableCell>{building.building_name}</TableCell>
                <TableCell>{building.building_address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Blocks Table */}
      <Typography variant="h4" gutterBottom>Blocks</Typography>
      {dashboard.building?.map((building) => (
        <Box key={building.id} mt={3}>
          <Typography variant="h5" gutterBottom>{building.building_name}</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboard.block
                  ?.filter((block) => block.building_id === building.id)
                  .map((block) => (
                    <TableRow key={block.id}>
                      <TableCell>{block.name}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Floors Table */}
          {dashboard.block
            ?.filter((block) => block.building_id === building.id)
            .map((block) => (
              <Box key={block.id} mt={3}>
                <Typography variant="h6" gutterBottom>{block.name}</Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Floor Number</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboard.floor
                        ?.filter((floor) => floor.block_id === block.id)
                        .map((floor) => (
                          <TableRow key={floor.id}>
                            <TableCell>{floor.number}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Rooms Table */}
                {dashboard.floor
                  ?.filter((floor) => floor.block_id === block.id)
                  .map((floor) => (
                    <Box key={floor.id} mt={3}>
                      <Typography variant="subtitle1" gutterBottom>Rooms - Floor {floor.number}</Typography>
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Room Number</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {dashboard.room
                              ?.filter((room) => room.floor_id === floor.id)
                              .map((room) => (
                                <TableRow key={room.id}>
                                  <TableCell>{room.room_number}</TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  ))}
              </Box>
            ))}
        </Box>
      ))}
    </Box>
  );
};

export default Dashboard;
