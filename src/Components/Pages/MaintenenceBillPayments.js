import React, { useState, useEffect } from                                                                                'react'                                ;
import axios from                                                                                                         'axios'                                ;
import CircularProgress from                                                                                              '@mui/material/CircularProgress'       ;
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Container } from '@mui/material'                        ;
import { CheckCircle } from                                                                                               '@mui/icons-material'                  ;
import { toast, ToastContainer } from                                                                                     'react-toastify'                       ;
import                                                                                                                    'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from                                                                                   'framer-motion'                        ;
import { ThreeDots } from                                                                                                 'react-loader-spinner'                 ;



function MaintenenceBillPayments() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [maintenanceBillId, setMaintenanceBillId] = useState(1);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          throw new Error('Access token not found');
        }

        const response = await axios.get(`http://localhost:3000/api/v1/buildings/1/maintenance_bills/${maintenanceBillId}/payments`, {
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
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [maintenanceBillId]);

  const handleAcceptPayment = async (paymentId) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('Access token not found');
      }
      const updatedPayments = payments.map(payment => {
        if (payment.id === paymentId) {
          return { ...payment, status: 'loading' };
        }
        return payment;
      });
      setPayments(updatedPayments);
  
      const response = await axios.post(`http://localhost:3000/api/v1/buildings/1/maintenance_bills/${maintenanceBillId}/payments/${paymentId}/accept`, {
        payment: {
          status: 'paid'
        },
        access_token: accessToken,
      });
  
      if (response.status === 200) {
        toast.success('Payment accepted successfully');
        const updatedPayments = payments.map(payment => {
          if (payment.id === paymentId) {
            return { ...payment, status: 'paid' };
          }
          return payment;
        });
        setPayments(updatedPayments);
      } else {
        throw new Error('Failed to accept payment');
      }
    } catch (error) {
      console.error('Error accepting payment:', error);
    }
  };
  const convertBlockToAlphabet = (blockNumber) => {
    return String.fromCharCode(64 + parseInt(blockNumber));
  };

  return (
    <Container>
      <Typography variant="h4" style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'center' }}>Maintenance Bill Payments</Typography>
      <TextField
        label="Maintenance Bill ID"
        type="number"
        value={maintenanceBillId}
        onChange={(e) => setMaintenanceBillId(e.target.value)}
        variant="outlined"
        fullWidth
        style={{ marginBottom: '20px' }}
      />
      <div style={{ position: 'relative', minHeight: '300px' }}>
        <AnimatePresence mode="wait">
          {!isLoading && (
            <motion.div
              key={maintenanceBillId}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
            >
              <TableContainer component={Paper} style={{ maxHeight: '400px', overflow: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">ID</TableCell>
                      <TableCell align="center">Month and Year</TableCell>
                      <TableCell align="center">Bill Name</TableCell>
                      <TableCell align="center">Block</TableCell>
                      <TableCell align="center">Floor</TableCell>
                      <TableCell align="center">Room Number</TableCell>
                      <TableCell align="center">Amount</TableCell>
                      <TableCell align="center">Payment Method</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payments.map((payment, index) => (
                      <TableRow key={payment.id} style={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff' }}>
                        <TableCell align="center">{payment.id}</TableCell>
                        <TableCell align="center">{payment.month_year || 'N/A'}</TableCell>
                        <TableCell align="center">{payment.bill_name}</TableCell>
                        <TableCell align="center">{convertBlockToAlphabet(payment.block) || 'N/A'}</TableCell>
                        <TableCell align="center">{payment.floor || 'N/A'}</TableCell>
                        <TableCell align="center">{payment.room_number || 'N/A'}</TableCell>
                        <TableCell align="center">{payment.amount}</TableCell>
                        <TableCell align="center" className="text-capitalize">{payment.payment_method}</TableCell>
                        <TableCell align="center">
                          {payment.status === 'paid' ? (
                            <Typography><p style={{ color: 'green' }} className='mb-0'>Paid</p></Typography>
                          ) : (
                            <Typography><p style={{ color: 'orange' }} className='mb-0'>Pending</p></Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {payment.status === 'loading' ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <ThreeDots
                              align="center"
                              visible={true}
                              height="30"
                              width="30"
                              color="#4fa94d"
                              radius="9"
                              ariaLabel="three-dots-loading"
                              wrapperStyle={{}}
                              wrapperClass=""
                            />
                            </div>
                          ) : payment.status === 'paid' ? (
                            <CheckCircle style={{ color: 'green' }} />                            
                          ) : (
                            <button className="btn btn-sm btn-primary" onClick={() => handleAcceptPayment(payment.id)}>
                              Accept
                            </button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </motion.div>
          )}
          {isLoading && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <CircularProgress />
            </div>
          )}
        </AnimatePresence>
      </div>
    </Container>
  );
}

export default MaintenenceBillPayments;
