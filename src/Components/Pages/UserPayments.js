import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function UserPayments() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [buildingId, setBuildingId] = useState(1);
  const [maintenanceBillId, setMaintenanceBillId] = useState(1);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          throw new Error('Access token not found');
        }

        const response = await axios.get(`http://localhost:3000/api/v1/buildings/${buildingId}/maintenance_bills/${maintenanceBillId}/payments`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 200) {
          setIsLoading(false);
          setPayments(response.data.payments);
        } else {
          throw new Error('Failed to fetch payments');
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'An error occurred');
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [buildingId, maintenanceBillId]);

  const handleAcceptPayment = async (paymentId) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('Access token not found');
      }

      const response = await axios.post(`http://localhost:3000/api/v1/buildings/${buildingId}/maintenance_bills/${maintenanceBillId}/payments/${paymentId}/accept`, {
        payment: {
          status: 'paid'
        },
        access_token: accessToken,
      });

      if (response.status === 200) {
        const updatedPayments = payments.map(payment => {
          if (payment.id === paymentId) {
            return { ...payment, status: 'paid' };
          }
          return payment;
        });
        setPayments(updatedPayments);
        setOpenSnackbar(true);
      } else {
        throw new Error('Failed to accept payment');
      }
    } catch (error) {
      console.error('Error accepting payment:', error);
      setErrorMessage('Failed to accept payment');
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="container">
      <div className="filter-options">
        <label>
          Building ID:
          <input type="number" value={buildingId} onChange={(e) => setBuildingId(e.target.value)} />
        </label>
        <label>
          Maintenance Bill ID:
          <input type="number" value={maintenanceBillId} onChange={(e) => setMaintenanceBillId(e.target.value)} />
        </label>
      </div>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          {errorMessage && <div>{errorMessage}</div>}
          <h2>User Payments</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Month and Year</th>
                <th>Bill Name</th>
                <th>Block</th>
                <th>Floor</th>
                <th>Room Number</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{payment.month_year || 'N/A'}</td>
                  <td>{payment.bill_name}</td>
                  <td>{payment.block || 'N/A'}</td>
                  <td>{payment.floor || 'N/A'}</td>
                  <td>{payment.room_number || 'N/A'}</td>
                  <td>{payment.amount}</td>
                  <td>{payment.payment_method}</td>
                  <td>{payment.status || 'N/A'}</td>
                  <td>
                    {payment.status !== 'paid' && (
                      <button className='btn btn-sm btn-primary' onClick={() => handleAcceptPayment(payment.id)}>Accept</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          Payment accepted successfully!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default UserPayments;
