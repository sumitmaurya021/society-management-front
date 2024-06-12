import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { Fade } from 'react-awesome-reveal';
import { ActionCableConsumer } from 'react-actioncable-provider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useSpring } from 'react-spring';

function CreateNotification() {
  const [userId, setUserId] = useState('');
  const [notification, setNotification] = useState({ user_id: '', title: '', message: '' });
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [titleFilter, setTitleFilter] = useState('');
  const [messageFilter, setMessageFilter] = useState('');
  const [createdAtFilter, setCreatedAtFilter] = useState(null);
  const [updateNotification, setUpdateNotification] = useState({ id: null, title: '', message: '' });
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteNotificationId, setDeleteNotificationId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('user');
    if (storedUserId) {
      const userIdInt = parseInt(storedUserId, 10);
      setUserId(userIdInt);
      setNotification((prevNotification) => ({ ...prevNotification, user_id: userIdInt }));
    }
    fetchNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [titleFilter, messageFilter, createdAtFilter, notifications]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotification({ ...notification, [name]: value });
  };

  const handleSubmit = async () => {
    const accessToken = localStorage.getItem('access_token');
    try {
      const response = await axios.post(`http://localhost:3000/api/v1/users/${userId}/notifications`, { notification }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) {
        toast.success('Notification created successfully!');
        setNotification({ user_id: userId, title: '', message: '' });
        handleClose();
        fetchNotifications();
      } else {
        toast.error('Failed to create notification');
      }
    } catch (error) {
      toast.error('Failed to create notification: ' + error.message);
      console.error('Failed to create notification:', error);
    }
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchNotifications = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) throw new Error('Access token not found');
      const response = await axios.get('http://localhost:3000/api/v1/notifications', {
        headers: { Authorization: `Bearer ${accessToken}` },
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

  const handleUpdateClickOpen = (notification) => {
    setUpdateNotification(notification);
    setUpdateOpen(true);
  };

  const handleUpdateClose = () => setUpdateOpen(false);

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateNotification({ ...updateNotification, [name]: value });
  };

  const handleUpdateSubmit = async () => {
    const accessToken = localStorage.getItem('access_token');
    try {
      const response = await axios.put(`http://localhost:3000/api/v1/users/${userId}/notifications/${updateNotification.id}`, { notification: updateNotification }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) {
        toast.success('Notification updated successfully!');
        setUpdateOpen(false);
        fetchNotifications();
      } else {
        toast.error('Failed to update notification');
      }
    } catch (error) {
      toast.error('Failed to update notification: ' + error.message);
      console.error('Failed to update notification:', error);
    }
  };

  const handleDeleteClickOpen = (notificationId) => {
    setDeleteNotificationId(notificationId);
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => setDeleteOpen(false);

  const handleDeleteSubmit = async () => {
    const accessToken = localStorage.getItem('access_token');
    try {
      const response = await axios.delete(`http://localhost:3000/api/v1/users/${userId}/notifications/${deleteNotificationId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        data: { access_token: accessToken },
      });
      if (response.status === 200) {
        toast.success('Notification deleted successfully!');
        setDeleteOpen(false);
        fetchNotifications();
      } else {
        toast.error('Failed to delete notification');
      }
    } catch (error) {
      toast.error('Failed to delete notification: ' + error.message);
      console.error('Failed to delete notification:', error);
    }
  };

  const fade = useSpring({ from: { opacity: 0 }, to: { opacity: 1 } });

  return (
    <>
    <ToastContainer />
      <Fade>
        <motion.div>
          <div>
            <div className="createmaincss">
              <Typography variant="h6" gutterBottom className="text-center p-3 bg-body-secondary sticky-top border-bottom text-dark">
                Create Notification
              </Typography>
              <div className='text-end container'>
                <button className='btn btn-sm btn-primary' onClick={handleClickOpen}>Create Notification</button>
              </div>
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create Notification</DialogTitle>
                <DialogContent>
                  <TextField name="title" label="Title" value={notification.title} onChange={handleChange} fullWidth margin="normal" />
                  <TextField name="message" label="Message" value={notification.message} onChange={handleChange} fullWidth margin="normal" multiline rows={4} />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="secondary">Cancel</Button>
                  <Button onClick={handleSubmit} color="primary">Create</Button>
                </DialogActions>
              </Dialog>
            </div>
          </div>
        </motion.div>
        <ActionCableConsumer
          channel={{ channel: 'NotificationsChannel' }}
          onReceived={(notification) => {
            console.log('Received notification:', notification);
          }}
        />
      </Fade>

      <Container>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <TextField label="Filter by Title" variant="outlined" value={titleFilter} onChange={(e) => setTitleFilter(e.target.value)} sx={{ flex: 1, marginRight: 2 }} />
          <TextField label="Filter by Message" variant="outlined" value={messageFilter} onChange={(e) => setMessageFilter(e.target.value)} sx={{ flex: 1, marginRight: 2 }} />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker label="Filter by Created At" value={createdAtFilter} onChange={(newValue) => setCreatedAtFilter(newValue)} renderInput={(params) => <TextField {...params} variant="outlined" sx={{ flex: 1 }} />} />
          </LocalizationProvider>
        </Box>
        <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredNotifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell>{notification.title}</TableCell>
                  <TableCell>{notification.message}</TableCell>
                  <TableCell>{new Date(notification.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <button className='btn btn-sm btn-primary' onClick={() => handleUpdateClickOpen(notification)}>Update</button>
                    <button className='btn btn-sm ms-2 btn-danger' onClick={() => handleDeleteClickOpen(notification.id)}>Delete</button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Update Notification Dialog */}
      <Dialog open={updateOpen} onClose={handleUpdateClose}>
        <DialogTitle>Update Notification</DialogTitle>
        <DialogContent>
          <TextField name="title" label="Title" value={updateNotification.title} onChange={handleUpdateChange} fullWidth margin="normal" />
          <TextField name="message" label="Message" value={updateNotification.message} onChange={handleUpdateChange} fullWidth margin="normal" multiline rows={4} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateClose} color="secondary">Cancel</Button>
          <Button onClick={handleUpdateSubmit} color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={handleDeleteClose}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <Typography>Do you really want to delete this notification? This process cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="secondary">No</Button>
          <Button onClick={handleDeleteSubmit} color="primary">Yes</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CreateNotification;
