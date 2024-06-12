import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../Spinner';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import './WaterBillsPay.css';
import { CheckCircle } from '@mui/icons-material';
import { FaFilePdf } from "react-icons/fa";

function WaterBillsPay() {
    const [waterBills, setWaterBills] = useState([]);
    const [userRoom, setUserRoom] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBill, setSelectedBill] = useState(null);
    const [openPaymentPopup, setOpenPaymentPopup] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [statuses, setStatuses] = useState({});

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
                setWaterBills(response.data.water_bills);
                setUserRoom(response.data.user_room);
                fetchStatuses(response.data.water_bills);
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

    const fetchStatuses = async (bills) => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const loggedInUserId = JSON.parse(localStorage.getItem('user')).id; // Retrieve logged-in user ID
    
            if (!accessToken) {
                throw new Error('Access token not found');
            }
    
            const statusPromises = bills.map(bill => 
                axios.get(`http://localhost:3000/api/v1/buildings/1/water_bills/${bill.id}/water_bill_payments`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                })
            );
    
            const responses = await Promise.all(statusPromises);
    
            const newStatuses = responses.reduce((acc, response, index) => {
                const userPayments = response.data.water_bill_payments.filter(payment => payment.user_id === loggedInUserId);
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
                month_year: paymentDate,
                payment_method: paymentMethod,
                access_token: accessToken,
                floor_number: userRoom.floor_number,
            });

            if (response.status === 200) {
                toast.success('Payment successful');
                fetchStatuses(waterBills);  // Update the status after payment
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

    const handleGenerateInvoice = (billId, paymentId) => {
        if (!paymentId) {
            toast.error('Payment ID not found');
            return;
        }

        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            toast.error('Access token not found');
            return;
        }

        const url = `http://localhost:3000/api/v1/buildings/1/water_bills/${billId}/water_bill_payments/${paymentId}/generate_invoice_pdf.pdf?access_token=${accessToken}`;
        console.log(`Opening URL: ${url}`); // Debugging line
        window.open(url, '_blank');
    };

    return (
        <>
        <ToastContainer />
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
                                        <th>Status</th>
                                        <th>Action</th>
                                        <th>Invoice</th>
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
                                            <td>{statuses[bill.id]?.status || 'Unpaid'}</td>
                                            <td>
                                                {statuses[bill.id]?.status === 'Paid' ? (
                                                    <CheckCircle style={{ color: 'green' }} />
                                                ) : (
                                                    <button className='btn btn-sm btn-success' onClick={() => handleOpenPaymentPopup(bill)}>Pay</button>
                                                )}
                                            </td>
                                            <td>
                                                {statuses[bill.id]?.status === 'Paid' ? (
                                                    <FaFilePdf 
                                                        style={{ color: 'red', cursor: 'pointer', fontSize: '20px' }} 
                                                        onClick={() => handleGenerateInvoice(bill.id, statuses[bill.id].paymentId)}
                                                    />
                                                ) : (
                                                    <FaFilePdf 
                                                        style={{ color: 'blue', cursor: 'pointer', fontSize: '20px' }} 
                                                        onClick={() => toast.error('Invoice available after payment')}
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
            </div>
        </>
    );
}

export default WaterBillsPay;
