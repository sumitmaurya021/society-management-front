import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';

function CreateMaintanenceBill() {
  const [maintenanceBill, setMaintenanceBill] = useState({
    your_name: '',
    name: 'Maintenance Bill',
    amount: '',
    start_date: '',
    end_date: '',
    remarks: ''
  });
  const [createdBill, setCreatedBill] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaintenanceBill({
      ...maintenanceBill,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    const accessToken = localStorage.getItem("access_token");
    const response = await fetch('http://localhost:3000/api/v1/buildings/1/maintenance_bills', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}` // Assuming accessToken is defined
      },
      body: JSON.stringify({ maintenance_bill: maintenanceBill })
    });
    const data = await response.json();
    if (response.ok) {
      setCreatedBill(data);
      setMaintenanceBill({
        your_name: '',
        name: 'Maintenance Bill',
        amount: '',
        start_date: '',
        end_date: '',
        remarks: ''
      });
    } else {
      console.error('Failed to create maintenance bill:', data.error);
    }
  };

  return (
    <div>
      <div className="createmaincss">
        <Typography variant="h6" gutterBottom>Create Maintenance Bill</Typography>
        <TextField
          name="your_name"
          label="Your Name"
          value={maintenanceBill.your_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="amount"
          label="Amount"
          type="number"
          value={maintenanceBill.amount}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="start_date"
          label="Start Date"
          type="date"
          value={maintenanceBill.start_date}
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
          value={maintenanceBill.end_date}
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
          value={maintenanceBill.remarks}
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
    </div>
  );
}

export default CreateMaintanenceBill;
