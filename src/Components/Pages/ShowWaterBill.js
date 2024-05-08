import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Spinner from "../Spinner";
import { ToastContainer, toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import "./ShowWaterBill.css";

function ShowWaterBill() {
  const [waterBills, setWaterBills] = useState([]);
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
          "http://localhost:3000/api/v1/buildings/1/water_bills",
          config
        );

        if (response.status === 200) {
          const formattedBills = response.data.map(bill => ({
            ...bill,
            start_date: new Date(bill.start_date).toISOString().substr(5, 5),
            end_date: new Date(bill.end_date).toISOString().substr(5, 5)
          }));
          setWaterBills(formattedBills);
          setIsLoading(false);
          toast("Water bills fetched successfully");
        } else {
          toast.error("Error fetching water bills");
        }
      } catch (error) {
        console.error("Error fetching water bills:", error);
      }
    };

    fetchBills();
  }, []);

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
      [e.target.name]: e.target.value,
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
        `http://localhost:3000/api/v1/buildings/1/water_bills/${selectedBill.id}`,
        {
          water_bill: editFormData,
          access_token: accessToken,
        },
        config
      );

      if (response.status === 200) {
        toast.success("Bill updated successfully");
        setShowEditModal(false);
        setWaterBills((prevBills) =>
          prevBills.map((bill) =>
            bill.id === selectedBill.id ? { ...bill, ...editFormData } : bill
          )
        );
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
        `http://localhost:3000/api/v1/buildings/1/water_bills/${selectedBill.id}`,
        {
          data: {
            access_token: accessToken,
          },
          ...config,
        }
      );

      if (response.status === 200) {
        toast.success("Bill deleted successfully");
        setShowDeleteConfirmation(false);
        setWaterBills((prevBills) =>
          prevBills.filter((bill) => bill.id !== selectedBill.id)
        );
      } else {
        toast.error("Error deleting bill");
      }
    } catch (error) {
      console.error("Error deleting bill:", error);
    }
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <motion.div className="maintenance-bill-container">
          <h1 className="sticky-top text-center p-3 bg-light border-bottom">
            Water Bill
          </h1>
          <div className="p-3">
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
                    <th>Remarks</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {waterBills.map((bill, index) => (
                    <tr key={index}>
                      <td>{bill.id}</td>
                      <td>{bill.bill_name}</td>
                      <td>{bill.bill_month_and_year}</td>
                      <td>{bill.owner_amount}</td>
                      <td>{bill.rent_amount}</td>
                      <td>{bill.start_date}</td>
                      <td>{bill.end_date}</td>
                      <td>{bill.remarks}</td>
                      <td>
                        <button
                          className="btn mx-2 btn-sm btn-primary btn-outline-primary"
                          onClick={() => handleEdit(bill)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger btn-outline-danger"
                          onClick={() => handleDelete(bill)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <ToastContainer />

          <Modal
            show={showEditModal}
            onHide={() => setShowEditModal(false)}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Edit Bill</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="form-group">
                  <label htmlFor="bill_name">Bill Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="bill_name"
                    name="bill_name"
                    value={editFormData.bill_name}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bill_month_and_year">Bill Month and Year</label>
                  <input
                    type="text"
                    className="form-control"
                    id="bill_month_and_year"
                    name="bill_month_and_year"
                    value={editFormData.bill_month_and_year}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="owner_amount">Owner Amount</label>
                  <input
                    type="text"
                    className="form-control"
                    id="owner_amount"
                    name="owner_amount"
                    value={editFormData.owner_amount}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="rent_amount">Rent Amount</label>
                  <input
                    type="text"
                    className="form-control"
                    id="rent_amount"
                    name="rent_amount"
                    value={editFormData.rent_amount}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="start_date">Start Date</label>
                  <input
                    type="text"
                    className="form-control"
                    id="start_date"
                    name="start_date"
                    value={editFormData.start_date}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="end_date">End Date</label>
                  <input
                    type="text"
                    className="form-control"
                    id="end_date"
                    name="end_date"
                    value={editFormData.end_date}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="remarks">Remarks</label>
                  <input
                    type="text"
                    className="form-control"
                    id="remarks"
                    name="remarks"
                    value={editFormData.remarks}
                    onChange={handleEditFormChange}
                  />
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleEditSubmit}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={showDeleteConfirmation}
            onHide={() => setShowDeleteConfirmation(false)}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this bill?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
                No
              </Button>
              <Button variant="danger" onClick={handleDeleteSubmit}>
                Yes
              </Button>
            </Modal.Footer>
          </Modal>
        </motion.div>
      )}
    </>
  );
}

export default ShowWaterBill;
