import React, { useState, useEffect } from 'react';
import {
  Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Container, TextField, Box, Card, CardContent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useSpring, animated } from 'react-spring';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';

function ReceiveNotification() {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [titleFilter, setTitleFilter] = useState('');
  const [messageFilter, setMessageFilter] = useState('');
  const [createdAtFilter, setCreatedAtFilter] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [titleFilter, messageFilter, createdAtFilter, notifications]);

  const fetchNotifications = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('Access token not found');
      }
      const response = await axios.get('http://localhost:3000/api/v1/notifications', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setNotifications(response.data);
      setFilteredNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const filterNotifications = () => {
    const filtered = notifications.filter((notification) => {
      const matchesTitle = notification.title.toLowerCase().includes(titleFilter.toLowerCase());
      const matchesMessage = notification.message.toLowerCase().includes(messageFilter.toLowerCase());
      const matchesCreatedAt = createdAtFilter
        ? new Date(notification.created_at).toLocaleDateString() === createdAtFilter.toLocaleDateString()
        : true;
      return matchesTitle && matchesMessage && matchesCreatedAt;
    });
    setFilteredNotifications(filtered);
  };

  const fade = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
  });

  return (
    <>
    <ToastContainer />
    <div>
    <Typography variant="h4" gutterBottom className="text-center p-3 bg-body-secondary text-dark sticky-top mb-4">
        Receive Notification
      </Typography>
    </div>
    <Container>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Filter by Title"
          variant="outlined"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          sx={{ flex: 1, marginRight: 2 }}
        />
        <TextField
          label="Filter by Message"
          variant="outlined"
          value={messageFilter}
          onChange={(e) => setMessageFilter(e.target.value)}
          sx={{ flex: 1, marginRight: 2 }}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Filter by Created At"
            value={createdAtFilter}
            onChange={(newValue) => setCreatedAtFilter(newValue)}
            renderInput={(params) => <TextField {...params} variant="outlined" sx={{ flex: 1 }} />}
          />
        </LocalizationProvider>
      </Box>
      <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredNotifications.map((notification) => (
              <TableRow key={notification.id}>
                <TableCell>{notification.title}</TableCell>
                <TableCell>{notification.message}</TableCell>
                <TableCell>{new Date(notification.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
    </>
  );
}

export default ReceiveNotification;
