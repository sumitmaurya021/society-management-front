import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Bounce } from "react-awesome-reveal";

function CreateMaintenanceBill() {
  const [maintenanceBill, setMaintenanceBill] = useState({
    bill_name: "Maintenance Bill",
    bill_month_and_year: "",
    owner_amount: "",
    rent_amount: "",
    start_date: "",
    end_date: "",
    remarks: "",
  });
  const [createdBill, setCreatedBill] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaintenanceBill({
      ...maintenanceBill,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const accessToken = localStorage.getItem("access_token");
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/buildings/1/maintenance_bills",
        { maintenance_bill: maintenanceBill },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 201) {
        toast.success("Maintenance bill created successfully!");
        setCreatedBill(response.data);
        setMaintenanceBill({
          bill_name: "Maintenance Bill",
          bill_month_and_year: "",
          owner_amount: "",
          rent_amount: "",
          start_date: "",
          end_date: "",
          remarks: "",
        });
      } else {
        toast.error("Failed to create maintenance bill");
      }
    } catch (error) {
      toast.error("Failed to create maintenance bill: " + error.message);
      console.error("Failed to create maintenance bill:", error);
    }
  };

  return (
    <div>
      <Bounce>
      <div className="createmaincss">
        <Typography
          variant="h6"
          gutterBottom
          className="text-center p-3 bg-body-secondary text-dark sticky-top"
        >
          Create Maintenance Bill
        </Typography>
        <div className="p-4">
          <div className="p-4 box-shadow-css">
          <TextField
            name="bill_month_and_year"
            label="Bill Month And Year"
            value={maintenanceBill.bill_month_and_year}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="owner_amount"
            label="Owner Amount"
            type="number"
            value={maintenanceBill.owner_amount}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="rent_amount"
            label="Rent Amount"
            type="number"
            value={maintenanceBill.rent_amount}
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
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Create
          </Button>
          </div>
        </div>
      </div>
      <ToastContainer />
      </Bounce>
    </div>
  );
}

export default CreateMaintenanceBill;
