import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../Spinner';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import './MaintenenceBillPay.css';
import { CheckCircle } from '@mui/icons-material';
import { FaFilePdf } from "react-icons/fa";

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
      const loggedInUserId = JSON.parse(localStorage.getItem('user')).id; // Retrieve logged-in user ID
  
      if (!accessToken) {
        throw new Error('Access token not found');
      }
  
      const statusPromises = bills.map(bill =>
        axios.get(`http://localhost:3000/api/v1/buildings/1/maintenance_bills/${bill.id}/payments`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        })
      );
  
      const responses = await Promise.all(statusPromises);
  
      const newStatuses = responses.reduce((acc, response, index) => {
        const userPayments = response.data.maintenance_bill_payments.filter(payment => payment.user_id === loggedInUserId);
        if (userPayments.length > 0) {
          acc[bills[index].id] = {
            status: userPayments[0].status,
            paymentId: userPayments[0].id
          };
        } else {
          acc[bills[index].id] = { status: 'Unpaid', paymentId: null };
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

  const handleGenerateInvoice = async (billId, paymentId) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('Access token not found');
      }

      const url = `http://localhost:3000/api/v1/buildings/1/maintenance_bills/${billId}/payments/${paymentId}/generate_invoice_pdf.pdf?access_token=${accessToken}`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Failed to generate invoice');
    }
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
    <ToastContainer />
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
                    <th>Invoice</th>
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
                      <td className='text-capitalize'>{statuses[bill.id]?.status || 'Unpaid'}</td>
                      <td>
                        {statuses[bill.id]?.status === 'Paid' ? (
                          <button className='btn btn-sm btn-success' onClick={() => handleOpenPaymentPopup(bill)}>Pay</button>
                          ) : (
                          <CheckCircle style={{ color: 'green' }} />
                        )}
                      </td>
                      <td>
                        {statuses[bill.id]?.status === 'Paid' ? (
                            <FaFilePdf 
                            style={{ color: 'blue', cursor: 'pointer', fontSize: '20px' }} 
                            onClick={() => toast.error('Invoice available after payment')}
                          />
                        ) : (
                          <FaFilePdf 
                            style={{ color: 'red', cursor: 'pointer', fontSize: '20px' }} 
                            onClick={() => handleGenerateInvoice(bill.id, statuses[bill.id].paymentId)}
                          />
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
      </div>
    </>
  );
}

export default MaintenanceBillPay;
