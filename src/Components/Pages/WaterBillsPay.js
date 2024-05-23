import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../Spinner';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import './WaterBillsPay.css';

function WaterBillsPay() {
    const [waterBills, setWaterBills] = useState([]);
    const [userRoom, setUserRoom] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBill, setSelectedBill] = useState(null);
    const [openPaymentPopup, setOpenPaymentPopup] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [block, setBlock] = useState('');
    const [floor, setFloor] = useState('');
    const [room, setRoom] = useState('');

    const fetchWaterBill = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                throw new Error('Access token not found');
            }

            const response = await axios.get('http://localhost:3000/api/v1/get_water_bills', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.status === 200) {
                setIsLoading(false);
                setWaterBills(response.data.water_bills);
                setUserRoom(response.data.user_room);
            } else {
                throw new Error('Failed to fetch water bills');
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to fetch water bills');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWaterBill();
    }, []);

    const handleOpenPaymentPopup = (bill) => {
        setSelectedBill(bill);
        setOpenPaymentPopup(true);
    };

    const handlePayWaterBill = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                throw new Error('Access token not found');
            }

            const response = await axios.post(`http://localhost:3000/api/v1/buildings/1/water_bills/${selectedBill.id}/water_bill_payments`, {
                month_year: paymentDate, // Assuming paymentDate holds the payment month and year
                payment_method: paymentMethod,
                access_token: accessToken,
            });

            if (response.status === 200) {
                toast.success('Payment successful');
            } else {
                throw new Error('Failed to make payment');
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to make payment');
        } finally {
            setOpenPaymentPopup(false);
        }
    };

    return (
        <>
            <div className="bills-page">
                {isLoading ? (
                    <Spinner />
                ) : (
                    <div className="bills-container">
                        <h2 className="bills-title">Water Bills</h2>
                        <div className="table-container">
                            <table className="bills-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Bill Name</th>
                                        <th>Month and Year</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Remarks</th>
                                        <th>Total Units</th>
                                        <th>Previous Unit</th>
                                        <th>Updated Unit</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {waterBills.map((bill) => (
                                        <tr key={bill.id}>
                                            <td>{bill.id}</td>
                                            <td>{bill.bill_name}</td>
                                            <td>{bill.bill_month_and_year}</td>
                                            <td>{bill.start_date}</td>
                                            <td>{bill.end_date}</td>
                                            <td>{bill.remarks}</td>
                                            <td>{userRoom.total_units}</td>
                                            <td>{userRoom.previous_unit}</td>
                                            <td>{userRoom.updated_unit}</td>
                                            <td>
                                                <button className='btn btn-sm btn-success' onClick={() => handleOpenPaymentPopup(bill)}>Pay</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <Dialog open={openPaymentPopup} onClose={() => setOpenPaymentPopup(false)}>
                    <DialogTitle>Pay Water Bill</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth className='mb-3 mt-4'>
                            <InputLabel id="payment-method-label">Payment Method</InputLabel>
                            <Select
                                labelId="payment-method-label"
                                id="payment-method"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                label="Payment Method"
                            >
                                <MenuItem value="Cash">Cash</MenuItem>
                                <MenuItem value="Online">Online</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField className='mb-3' label="Payment Amount" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} fullWidth />
                        <TextField className='mb-3'
                            label="Payment Date"
                            type="date"
                            value={paymentDate}
                            onChange={(e) => setPaymentDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenPaymentPopup(false)}>Cancel</Button>
                        <Button onClick={handlePayWaterBill}>Pay</Button>
                    </DialogActions>
                </Dialog>

                <ToastContainer />
            </div>
        </>
    );
}

export default WaterBillsPay;
