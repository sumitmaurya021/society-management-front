import React, { useState, useEffect } from 'react';
import { ActionCableConsumer } from 'react-actioncable-provider';
import { Typography, Card, CardContent, List, ListItem, ListItemText, Divider, Container } from '@mui/material';
import axios from 'axios';

function ReceiveNotification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

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
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleReceivedNotification = (notification) => {
    // Add the received notification to the state
    setNotifications((prevNotifications) => [...prevNotifications, notification]);
  };


  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Receive Notification
      </Typography>
      {/* Action Cable Consumer to listen for new notifications */}
      <ActionCableConsumer
        channel={{ channel: 'NotificationChannel' }}
        onReceived={handleReceivedNotification}
      />
      <List>
        {notifications.map((notification) => (
          <React.Fragment key={notification.id}>
            <ListItem alignItems="flex-start">
              <Card variant="outlined" sx={{ width: '100%' }}> {/* Use Card component */}
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {notification.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {notification.message}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created at: {new Date(notification.created_at).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
}

export default ReceiveNotification;
