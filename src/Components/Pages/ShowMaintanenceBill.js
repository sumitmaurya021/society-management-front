import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Zoom } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { motion } from                     "framer-motion"            ;
import { Fade } from 'react-awesome-reveal';
import { Modal } from 'react-bootstrap';

function ShowMaintanenceBill() {
  const [maintenanceBill, setMaintenanceBill] = useState({
    bill_name: 'Maintenance Bill',
    bill_month_and_year: '',
    owner_amount: '',
    rent_amount: '',
    start_date: '',
    end_date: '',
    remarks: '',
  });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false); // State for controlling the modal
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedBill, setSelectedBill] = useState({});
  const [editFormData, setEditFormData] = useState({
    bill_name: "",
    bill_month_and_year: "",
    owner_amount: "",
    rent_amount: "",
    start_date: "",
    end_date: "",
    remarks: "",
    late_fee: "",
  });

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
          console.error("Access token not found in local storage");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const response = await axios.get(
          "http://localhost:3000/api/v1/buildings/1/maintenance_bills",
          config
        );

        if (response.status === 200) {
          const formattedBills = response.data.map(bill => ({
            ...bill,
            start_date: new Date(bill.start_date).toISOString().substr(5, 5),
            end_date: new Date(bill.end_date).toISOString().substr(5, 5)
          }));
          setBills(formattedBills);
          setIsLoading(false);
          toast.success("Maintenance bills fetched successfully");
        } else {
          toast.error("Error fetching maintenance bills");
        }
      } catch (error) {
        console.error("Error fetching maintenance bills:", error);
      }
    };

    fetchBills();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaintenanceBill({
      ...maintenanceBill,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!maintenanceBill.bill_month_and_year) {
      newErrors.bill_month_and_year = 'Bill Month and Year is required';
    }
    if (!maintenanceBill.owner_amount) {
      newErrors.owner_amount = 'Owner Amount is required';
    }
    if (!maintenanceBill.rent_amount) {
      newErrors.rent_amount = 'Rent Amount is required';
    }
    if (!maintenanceBill.start_date) {
      newErrors.start_date = 'Start Date is required';
    }
    if (!maintenanceBill.end_date) {
      newErrors.end_date = 'End Date is required';
    }
    if (!maintenanceBill.remarks) {
      newErrors.remarks = 'Remarks are required';
    }
    if (!maintenanceBill.late_fee) {
      newErrors.late_fee = 'Late Fee is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    const accessToken = localStorage.getItem('access_token');
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/buildings/1/maintenance_bills',
        { maintenance_bill: maintenanceBill },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 201) {
        toast.success('Maintenance bill created successfully!');
        setBills(prevBills => [...prevBills, response.data]);
        setMaintenanceBill({
          bill_name: 'Maintenance Bill',
          bill_month_and_year: '',
          owner_amount: '',
          rent_amount: '',
          start_date: '',
          end_date: '',
          remarks: '',
          late_fee: '',
        });
        handleClose(); // Close the modal after submission
      } else {
        toast.error('Failed to create maintenance bill');
      }
    } catch (error) {
      toast.error('Failed to create maintenance bill: ' + error.message);
      console.error('Failed to create maintenance bill:', error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = (bill) => {
    setSelectedBill(bill);
    setEditFormData({
      bill_name: bill.bill_name,
      bill_month_and_year: bill.bill_month_and_year,
      owner_amount: bill.owner_amount,
      rent_amount: bill.rent_amount,
      start_date: bill.start_date,
      end_date: bill.end_date,
      remarks: bill.remarks,
      late_fee: bill.late_fee,
    });
    setShowEditModal(true);
  };

  const handleDelete = (bill) => {
    setSelectedBill(bill);
    setShowDeleteConfirmation(true);
  };

  const handleEditFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditSubmit = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        console.error("Access token not found in local storage");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios.put(
        `http://localhost:3000/api/v1/buildings/1/maintenance_bills/${selectedBill.id}`,
        {
          maintenance_bill: editFormData,
          access_token: accessToken
        },
        config
      );

      if (response.status === 200) {
        toast.success("Bill updated successfully");
        setShowEditModal(false);
        setBills(prevBills => prevBills.map(bill => (bill.id === selectedBill.id ? { ...bill, ...editFormData } : bill)));
      } else {
        toast.error("Error updating bill");
      }
    } catch (error) {
      console.error("Error updating bill:", error);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        console.error("Access token not found in local storage");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios.delete(
        `http://localhost:3000/api/v1/buildings/1/maintenance_bills/${selectedBill.id}`,
        {
          data: {
            access_token: accessToken
          },
          ...config
        }
      );

      if (response.status === 200) {
        toast.success("Bill deleted successfully");
        setShowDeleteConfirmation(false);
        setBills(prevBills => prevBills.filter(bill => bill.id !== selectedBill.id));
      } else {
        toast.error("Error deleting bill");
      }
    } catch (error) {
      console.error("Error deleting bill:", error);
    }
  };

  return (
    <div>
      <ToastContainer />
      <Fade>
        <div className="createmaincss">
          <Typography
            variant="h6"
            gutterBottom
            className="text-center p-3 bg-body-secondary text-dark sticky-top"
          >
            Show Maintenance Bill
          </Typography>
          <div className="text-end container">
            <button className='btn btn-sm btn-success' onClick={handleClickOpen}>
              Create Maintenance Bill
            </button>
          </div>
          <Dialog
            open={open}
            onClose={handleClose}
            TransitionComponent={Zoom}
            transitionDuration={{ enter: 500, exit: 500 }}
          >
            <DialogTitle>Show Maintenance Bill</DialogTitle>
            <DialogContent>
              <TextField
                name="bill_month_and_year"
                label="Bill Month And Year"
                value={maintenanceBill.bill_month_and_year}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.bill_month_and_year}
                helperText={errors.bill_month_and_year}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                name="owner_amount"
                label="Owner Amount"
                type="number"
                value={maintenanceBill.owner_amount}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.owner_amount}
                helperText={errors.owner_amount}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                name="rent_amount"
                label="Rent Amount"
                type="number"
                value={maintenanceBill.rent_amount}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.rent_amount}
                helperText={errors.rent_amount}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                name="start_date"
                label="Start Date"
                type="date"
                value={maintenanceBill.start_date}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.start_date}
                helperText={errors.start_date}
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
                error={!!errors.end_date}
                helperText={errors.end_date}
                InputLabelProps={{
                  shrink: true,
                }}
              />
                <TextField
                name="late_fee"
                label="Late Fee"
                type="number"
                value={maintenanceBill.late_fee}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.late_fee}
                helperText={errors.late_fee}
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
                error={!!errors.remarks}
                helperText={errors.remarks}
                multiline
                rows={4}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">Cancel</Button>
              <Button onClick={handleSubmit} color="primary">Create</Button>
            </DialogActions>
          </Dialog>
        </div>
      </Fade>

      <motion.div className="maintenance-bill-container container-fluid">
          <div className="table-container">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Bill Id</th>
                  <th>Bill Name</th>
                  <th>Bill Month and Year</th>
                  <th>Owner Amount</th>
                  <th>Rent Amount</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Late Fees</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill, index) => (
                  <tr key={index}>
                    <td>{bill.id}</td>
                    <td>{bill.bill_name}</td>
                    <td>{bill.bill_month_and_year}</td>
                    <td>{bill.owner_amount}</td>
                    <td>{bill.rent_amount}</td>
                    <td>{bill.start_date}</td>
                    <td>{bill.end_date}</td>
                    <td>{bill.late_fee}</td>
                    <td className='text-capitalize' style={{ color: bill.status === "expired" ? "red" : "green" }}>{bill.status}</td>
                    <td>{bill.remarks}</td>
                    <td>
                      <button onClick={() => handleEdit(bill)} className="btn mx-2 btn-sm btn-primary btn-outline-primary">Edit</button>
                      <button onClick={() => handleDelete(bill)} className="btn btn-sm btn-danger btn-outline-danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Bill</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="form-group">
                  <label htmlFor="bill_name">Bill Name</label>
                  <input type="text" className="form-control" id="bill_name" name="bill_name" value={editFormData.bill_name} onChange={handleEditFormChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="bill_month_and_year">Bill Month and Year</label>
                  <input type="text" className="form-control" id="bill_month_and_year" name="bill_month_and_year" value={editFormData.bill_month_and_year} onChange={handleEditFormChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="owner_amount">Owner Amount</label>
                  <input type="text" className="form-control" id="owner_amount" name="owner_amount" value={editFormData.owner_amount} onChange={handleEditFormChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="rent_amount">Rent Amount</label>
                  <input type="text" className="form-control" id="rent_amount" name="rent_amount" value={editFormData.rent_amount} onChange={handleEditFormChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="start_date">Start Date</label>
                  <input type="text" className="form-control" id="start_date" name="start_date" value={editFormData.start_date} onChange={handleEditFormChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="end_date">End Date</label>
                  <input type="text" className="form-control" id="end_date" name="end_date" value={editFormData.end_date} onChange={handleEditFormChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="remarks">Remarks</label>
                  <input type="text" className="form-control" id="remarks" name="remarks" value={editFormData.remarks} onChange={handleEditFormChange} />
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="btn btn-sm btn-outline-primary" onClick={handleEditSubmit}>Submit</button>
            </Modal.Footer>
          </Modal>
          <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this bill?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>No</Button>
              <Button variant="danger" onClick={handleDeleteSubmit}>Yes</Button>
            </Modal.Footer>
          </Modal>
        </motion.div>
    </div>
  );
}

export default ShowMaintanenceBill;
