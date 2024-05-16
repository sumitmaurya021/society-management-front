import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Fade } from "react-awesome-reveal";

function CreateWaterBill() {
  const [waterBill, setWaterBill] = useState({
    bill_name: "Water Bill",
    bill_month_and_year: "",
    owner_amount: "",
    rent_amount: "",
    start_date: "",
    end_date: "",
    remarks: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWaterBill({
      ...waterBill,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const accessToken = localStorage.getItem("access_token");
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/buildings/1/water_bills",
        { water_bill: waterBill },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 201) {
        toast.success("Water bill created successfully!");
        setWaterBill({
          bill_name: "Water Bill",
          bill_month_and_year: "",
          owner_amount: "",
          rent_amount: "",
          start_date: "",
          end_date: "",
          remarks: "",
        });
      } else {
        toast.error("Failed to create Water bill");
      }
    } catch (error) {
      toast.error("Failed to create Water bill: " + error.message);
      console.error("Failed to create Water bill:", error);
    }
  };

  return (
    <Fade>
    <motion.div>
      <div>
        <div className="createmaincss">
          <Typography
            variant="h6"
            gutterBottom
            className="text-center p-3 bg-body-secondary sticky-top border-bottom text-dark"
          >
            Create Water Bill
          </Typography>
          <div className="p-4">
            <div className="p-4 box-shadow-css">
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
          </div>
        </div>
        <ToastContainer />
      </div>
    </motion.div>
    </Fade>
  );
}

export default CreateWaterBill;
