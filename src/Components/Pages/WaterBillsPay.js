import React, { useState, useEffect } from                                           'react'              ;
import axios from                                                                    'axios'              ;
import Spinner from                                                                  '../Spinner'         ;
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'      ;
import { toast, ToastContainer } from                                                'react-toastify'     ;
import                                                                               './WaterBillsPay.css';

function WaterBillsPay() {
    const [waterBills, setWaterBills] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBill, setSelectedBill] = useState(null);
    const [openPaymentPopup, setOpenPaymentPopup] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
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
                                        <th>Owner Amount</th>
                                        <th>Rent Amount</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Remarks</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {waterBills.map((bill) => (
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
                                                <button className='btn btn-sm btn-success' onClick={() => handleOpenPaymentPopup(bill)}>Pay</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <ToastContainer />
            </div>
        </>
    );
}

export default WaterBillsPay;
