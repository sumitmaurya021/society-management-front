import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Container, Select, MenuItem, FormControl, InputLabel, Button, Grid } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from 'react-loader-spinner';

function MaintenanceBillPayments() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [maintenanceBills, setMaintenanceBills] = useState([]);
  const [selectedMaintenanceBill, setSelectedMaintenanceBill] = useState('');
  
  const [filterMonthYear, setFilterMonthYear] = useState('');
  const [filterBlock, setFilterBlock] = useState('');
  const [filterFloor, setFilterFloor] = useState('');

  useEffect(() => {
    const fetchMaintenanceBills = async () => {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('Access token not found');
      }
      try {
        const response = await axios.get('http://localhost:3000/api/v1/buildings/1/maintenance_bills', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.status === 200) {
          setMaintenanceBills(response.data);
        } else {
          throw new Error('Failed to fetch maintenance bills');
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchMaintenanceBills();
  }, []);

  const fetchPayments = async (maintenanceBillId) => {
    setIsLoading(true);
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
        setPayments(response.data.payments);
      } else {
        throw new Error('Failed to fetch payments');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMaintenanceBill) {
      fetchPayments(selectedMaintenanceBill);
    } else {
      setPayments([]);
    }
  }, [selectedMaintenanceBill]);

  const handleAcceptPayment = async (paymentId, maintenanceBillId) => {
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

  const handleClearFilters = () => {
    setSelectedMaintenanceBill('')
    setFilterMonthYear('');
    setFilterBlock('');
    setFilterFloor('');
  };

  const filteredPayments = payments.filter(payment => {
    return (
      (filterMonthYear ? payment.month_year === filterMonthYear : true) &&
      (filterBlock ? convertBlockToAlphabet(payment.block) === filterBlock : true) &&
      (filterFloor ? payment.floor === filterFloor : true)
    );
  });

  return (
    <Container>
      <Typography variant="h4" style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'center' }}>Maintenance Bill Payments</Typography>
      
      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel>Select Maintenance Bill</InputLabel>
        <Select
          value={selectedMaintenanceBill}
          onChange={(e) => setSelectedMaintenanceBill(e.target.value)}
        >
          {maintenanceBills.map((bill) => (
            <MenuItem key={bill.id} value={bill.id}>
              {bill.bill_name} - {bill.bill_month_and_year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid container spacing={2} style={{ marginBottom: '20px' }} className="align-items-center">
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Filter by Month and Year</InputLabel>
            <Select
              value={filterMonthYear}
              onChange={(e) => setFilterMonthYear(e.target.value)}
            >
              {[...new Set(payments.map(payment => payment.month_year))].map(monthYear => (
                <MenuItem key={monthYear} value={monthYear}>
                  {monthYear}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Filter by Block</InputLabel>
            <Select
              value={filterBlock}
              onChange={(e) => setFilterBlock(e.target.value)}
            >
              {[...new Set(payments.map(payment => convertBlockToAlphabet(payment.block)))].map(block => (
                <MenuItem key={block} value={block}>
                  {block}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Filter by Floor</InputLabel>
            <Select
              value={filterFloor}
              onChange={(e) => setFilterFloor(e.target.value)}
            >
              {[...new Set(payments.map(payment => payment.floor))].map(floor => (
                <MenuItem key={floor} value={floor}>
                  {floor}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <button className='btn btn-sm btn-primary' onClick={handleClearFilters}>
            Clear Filters
          </button>
        </Grid>
      </Grid>

      <div style={{ position: 'relative', minHeight: '300px' }}>
        {isLoading && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <CircularProgress />
          </div>
        )}
        {!isLoading && filteredPayments.length > 0 && (
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
                {filteredPayments.map((payment, index) => (
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
                        <Button variant="contained" color="primary" size="small" onClick={() => handleAcceptPayment(payment.id, selectedMaintenanceBill)}>
                          Accept
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {!isLoading && filteredPayments.length === 0 && selectedMaintenanceBill && (
          <Typography variant="h6" align="center" style={{ marginTop: '20px' }}>
            No payments found for the selected filters.
          </Typography>
        )}
      </div>
    </Container>
  );
}

export default MaintenanceBillPayments;
