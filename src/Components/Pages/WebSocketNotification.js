import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WebSocketNotification = () => {
  const location = useLocation();

  useEffect(() => {
    const allowedPaths = ['/WaterBillsPay', '/MaintenenceBillPay', '/ReceiveNotification'];
    if (allowedPaths.includes(location.pathname)) {
      const ws = new WebSocket('ws://localhost:3000/cable');

      ws.onopen = () => {
        console.log('Connected to WebSocket server');
        ws.send(JSON.stringify({
          command: 'subscribe',
          identifier: JSON.stringify({
            channel: 'NotificationChannel'
          })
        }));
      };

      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        const message = response.message;

        if (message && message.title) {
          toast.info(`New Notification: ${message.title}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      };

      return () => {
        ws.close();
      };
    }
  }, [location.pathname]);

  return <ToastContainer />;
};

export default WebSocketNotification;
