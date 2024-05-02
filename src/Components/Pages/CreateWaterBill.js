import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';

function CreateWaterBill() {
  const [waterBill, setWaterBill] = useState({
    bill_name: 'Water Bill',
    bill_month_and_year: '',
    owner_amount: '',
    rent_amount: '',
    start_date: '',
    end_date: '',
    remarks: ''
  });
  const [createdBill, setCreatedBill] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWaterBill({
      ...waterBill,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    const accessToken = localStorage.getItem("access_token");
    const response = await fetch('http://localhost:3000/api/v1/buildings/1/water_bills', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}` // Assuming accessToken is defined
      },
      body: JSON.stringify({ water_bill: waterBill })
    });
    const data = await response.json();
    if (response.ok) {
      toast.success('Water bill created successfully!');
      setCreatedBill(data);
      setWaterBill({
        bill_name: 'Water Bill',
        bill_month_and_year: '',
        owner_amount: '',
        rent_amount: '',
        start_date: '',
        end_date: '',
        remarks: ''
      });
    } else {
      console.error('Failed to create Water bill:', data.error);
    }
  };

  return (
    <motion.div>
        <div>
        <div className="createmaincss">
        <Typography variant="h6" gutterBottom>Create Water Bill</Typography>

        <TextField
          name="bill_month_and_year"
          label="Bill Month And Year"
          value={waterBill.bill_month_and_year}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="owner_amount"
          label="Owner Amount"
          type="number"
          value={waterBill.owner_amount}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="rent_amount"
          label="Rent Amount"
          type="number"
          value={waterBill.rent_amount}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="start_date"
          label="Start Date"
          type="date"
          value={waterBill.start_date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          name="end_date"
          label="End Date"
          type="date"
          value={waterBill.end_date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          name="remarks"
          label="Remarks"
          value={waterBill.remarks}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />


        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Create
        </Button>
      </div>
      <ToastContainer />
    </div>
  </motion.div>
  )
}

export default CreateWaterBill
