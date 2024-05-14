import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../Spinner';
import './BillsPage.css'; // Import CSS for styling
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'; // Import Material UI components
import { toast, ToastContainer } from 'react-toastify';

function BillsPage() {
  const [maintenanceBills, setMaintenanceBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);
  const [openPaymentPopup, setOpenPaymentPopup] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [block, setBlock] = useState('');
  const [floor, setFloor] = useState('');
  const [room, setRoom] = useState('');

  const fetchMaintenanceBills = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('Access token not found');
      }

      const response = await axios.get('http://localhost:3000/api/v1/get_maintenance_bills', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        setIsLoading(false);
        setMaintenanceBills(response.data.maintenance_bills);
      } else {
        throw new Error('Failed to fetch maintenance bills');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceBills();
  }, []);

  const handleOpenPaymentPopup = (bill) => {
    setSelectedBill(bill);
    setOpenPaymentPopup(true);
  };

  const handleClosePaymentPopup = () => {
    setOpenPaymentPopup(false);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handlePaymentAmountChange = (event) => {
    setPaymentAmount(event.target.value);
  };

  const handleDateChange = (event) => {
    setPaymentDate(event.target.value);
  };

  const handleBlockChange = (event) => {
    setBlock(event.target.value);
  };

  const handleFloorChange = (event) => {
    setFloor(event.target.value);
  };

  const handleRoomChange = (event) => {
    setRoom(event.target.value);
  };

  const handlePaymentSubmit = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('Access token not found');
      }

      const response = await axios.post(`http://localhost:3000/api/v1/buildings/1/maintenance_bills/${selectedBill.id}/payments`, {
        payment: {
          month_year: paymentDate,
          bill_name: selectedBill.bill_name,
          block: block,
          floor: floor,
          room_number: room,
          amount: paymentAmount,
          payment_method: paymentMethod,
        },
        access_token: accessToken,
      });

      if (response.status === 201) {
        toast.success('Payment created successfully');
        handleClosePaymentPopup();
        fetchMaintenanceBills();
      } else {
        throw new Error('Failed to create payment');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      setErrorMessage('Failed to create payment');
    }
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="bills-container">
          <h2 className="bills-title">Maintenance Bills</h2>
          <table className="bills-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Bill Name</th>
                <th>Month and Year</th>
                <th>Owner Amount</th>
                <th>Rent Amount</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Remarks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {maintenanceBills.map((bill) => (
                <tr key={bill.id}>
                  <td>{bill.id}</td>
                  <td>{bill.bill_name}</td>
                  <td>{bill.bill_month_and_year}</td>
                  <td>{bill.owner_amount}</td>
                  <td>{bill.rent_amount}</td>
                  <td>{bill.start_date}</td>
                  <td>{bill.end_date}</td>
                  <td>{bill.remarks}</td>
                  <td>
                    <button className="btn btn-sm btn-success btn-outline-success" onClick={() => handleOpenPaymentPopup(bill)}>Pay</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={openPaymentPopup} onClose={handleClosePaymentPopup}>
        <DialogTitle>Make Payment</DialogTitle>
        <DialogContent>
          <TextField
            label="Bill Name"
            value={selectedBill?.bill_name}
            disabled
            fullWidth
            required
            margin="normal"
          />
          <TextField
            type="date"
            value={paymentDate}
            onChange={handleDateChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Block"
            value={block}
            onChange={handleBlockChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Floor"
            value={floor}
            onChange={handleFloorChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Room Number"
            value={room}
            onChange={handleRoomChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Amount"
            type="number"
            value={paymentAmount}
            onChange={handlePaymentAmountChange}
            fullWidth
            required
            margin="normal"
          />
          <FormControl fullWidth required margin="normal">
            <InputLabel id="payment-method-label">Payment Method</InputLabel>
            <Select
              labelId="payment-method-label"
              id="payment-method-select"
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
            >
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="online">Online</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentPopup} color="secondary">Cancel</Button>
          <Button onClick={handlePaymentSubmit} color="primary">Pay</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
}

export default BillsPage;
