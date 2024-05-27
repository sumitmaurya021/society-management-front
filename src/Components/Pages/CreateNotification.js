import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { Fade } from 'react-awesome-reveal';
import PropTypes from 'prop-types'; // Import PropTypes
import { ActionCableConsumer } from 'react-actioncable-provider'; // Import ActionCableConsumer

function CreateNotification() {
  const [userId, setUserId] = useState('');
  const [notification, setNotification] = useState({
    user_id: '',
    title: '',
    message: '',
  });

  useEffect(() => {
    // Retrieve user ID from localStorage and parse it as an integer
    const storedUserId = localStorage.getItem('user');
    if (storedUserId) {
      const userIdInt = parseInt(storedUserId, 10); // Parse the user ID as an integer
      setUserId(userIdInt);
      setNotification((prevNotification) => ({
        ...prevNotification,
        user_id: userIdInt,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotification({
      ...notification,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const accessToken = localStorage.getItem('access_token');
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/users/${userId}/notifications`,
        { notification },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success('Notification created successfully!');
        setNotification({
          user_id: userId,
          title: '',
          message: '',
        });
      } else {
        toast.error('Failed to create notification');
      }
    } catch (error) {
      toast.error('Failed to create notification: ' + error.message);
      console.error('Failed to create notification:', error);
    }
  };

  return (
    <Fade>
      <motion.div>
        <div>
          <div className="createmaincss">
            <Typography
              variant="h6"
              gutterBottom
              className="text-center p-3 bg-body-secondary sticky-top border-bottom text-dark"
            >
              Create Notification
            </Typography>
            <div className="p-4">
              <div className="p-4 box-shadow-css">
                <TextField
                  name="title"
                  label="Title"
                  value={notification.title}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  name="message"
                  label="Message"
                  value={notification.message}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Create
                </Button>
              </div>
            </div>
          </div>
          <ToastContainer />
        </div>
      </motion.div>
                <ActionCableConsumer
            channel={{ channel: 'NotificationsChannel' }}
            onReceived={(notification) => {
                console.log('Received notification:', notification);
                // Handle the received notification
            }}
            />
    </Fade>
  );
}

CreateNotification.propTypes = {
  userId: PropTypes.number.isRequired, // Define userId prop type as number
};

export default CreateNotification;
