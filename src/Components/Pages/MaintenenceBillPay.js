import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../Spinner';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import './MaintenenceBillPay.css';
import { CheckCircle } from '@mui/icons-material';

function MaintenanceBillPay() {
  const [maintenanceBills, setMaintenanceBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [openPaymentPopup, setOpenPaymentPopup] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [block, setBlock] = useState('');
  const [floor, setFloor] = useState('');
  const [room, setRoom] = useState('');
  const [statuses, setStatuses] = useState({});

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
        setMaintenanceBills(response.data.maintenance_bills);
        fetchStatuses(response.data.maintenance_bills);
      } else {
        throw new Error('Failed to fetch maintenance bills');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch maintenance bills');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatuses = async (bills) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('Access token not found');
      }

      const statusPromises = bills.map(bill => 
        axios.get(`http://localhost:3000/api/v1/buildings/1/maintenance_bills/${bill.id}/payments`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      );

      const responses = await Promise.all(statusPromises);

      const newStatuses = responses.reduce((acc, response, index) => {
        if (response.status === 200 && response.data.payments.length > 0) {
          acc[bills[index].id] = response.data.payments[0].status;
        } else {
          acc[bills[index].id] = 'Unpaid';
        }
        return acc;
      }, {});

      setStatuses(newStatuses);
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch payment statuses');
    }
  };

  useEffect(() => {
    fetchMaintenanceBills();
  }, []);

  const handleOpenPaymentPopup = (bill) => {
    setSelectedBill(bill);
    setOpenPaymentPopup(true);
    setBlock(localStorage.getItem('block_number'));
    setFloor(localStorage.getItem('floor_number'));
    setRoom(localStorage.getItem('room_number'));
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
        fetchStatuses(maintenanceBills);
      } else {
        throw new Error('Failed to create payment');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error('Failed to create payment');
    }
  };

  return (
    <>
      <div className="bills-page">
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="bills-container">
            <h2 className="bills-title">Maintenance Bills</h2>
            <div className="table-container">
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
                    <th>Status</th>
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
                      <td className='text-capitalize'>{statuses[bill.id] || 'Unpaid'}</td>
                      <td>
                        {statuses[bill.id] === 'paid' ? (
                          <CheckCircle style={{ color: 'green' }} />
                        ) : (
                          <button className='btn btn-sm btn-success' onClick={() => handleOpenPaymentPopup(bill)}>Pay</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
      </div>
    </>
  );
}

export default MaintenanceBillPay;
