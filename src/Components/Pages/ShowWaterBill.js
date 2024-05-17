import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Spinner from "../Spinner";
import { ToastContainer, toast } from "react-toastify";
import { Modal, Button, Form } from "react-bootstrap";
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

  const [showAddUnitsModal, setShowAddUnitsModal] = useState(false);
  const [unitFormData, setUnitFormData] = useState({
    unit_rate: "",
    previous_unit: "",
    room_units: {},
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
          const formattedBills = response.data.map((bill) => ({
            ...bill,
            start_date: new Date(bill.start_date).toISOString().substr(5, 5),
            end_date: new Date(bill.end_date).toISOString().substr(5, 5),
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




  const handleAddUnitsModalOpen = () => {
    setShowAddUnitsModal(true);
  };

  const handleAddUnitsModalClose = () => {
    setShowAddUnitsModal(false);
  };

  const handleUnitFormChange = (e) => {
    setUnitFormData({
      ...unitFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoomUnitsChange = (roomId, value) => {
    setUnitFormData({
      ...unitFormData,
      room_units: {
        ...unitFormData.room_units,
        [roomId]: value,
      },
    });
  };

  const handleAddUnitsSubmit = async () => {
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

      const response = await axios.post(
        "http://localhost:3000/api/v1/buildings/1/blocks/1/floors/1/rooms/1/update_units",
        {
          water_bill: unitFormData,
          access_token: accessToken,
        },
        config
      );

      if (response.status === 200) {
        console.log("Units added successfully");
        setShowAddUnitsModal(false);
        // Add any necessary state updates or notifications here
      } else {
        console.error("Error adding units");
      }
    } catch (error) {
      console.error("Error adding units:", error);
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
                    <th>Add Unit</th>
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
                      <td><button className="btn btn-sm btn-primary btn-outline-success" onClick={handleAddUnitsModalOpen}>Add Units</button></td>
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
              <Form>
                <Form.Group>
                  <Form.Label>Bill Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="bill_name"
                    value={editFormData.bill_name}
                    onChange={handleEditFormChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Bill Month and Year</Form.Label>
                  <Form.Control
                    type="text"
                    name="bill_month_and_year"
                    value={editFormData.bill_month_and_year}
                    onChange={handleEditFormChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Owner Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="owner_amount"
                    value={editFormData.owner_amount}
                    onChange={handleEditFormChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Rent Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="rent_amount"
                    value={editFormData.rent_amount}
                    onChange={handleEditFormChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="text"
                    name="start_date"
                    value={editFormData.start_date}
                    onChange={handleEditFormChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="text"
                    name="end_date"
                    value={editFormData.end_date}
                    onChange={handleEditFormChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Remarks</Form.Label>
                  <Form.Control
                    type="text"
                    name="remarks"
                    value={editFormData.remarks}
                    onChange={handleEditFormChange}
                  />
                </Form.Group>
              </Form>
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

          <Modal
        show={showAddUnitsModal}
        onHide={handleAddUnitsModalClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Units</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Unit Rate</Form.Label>
              <Form.Control
                type="text"
                name="unit_rate"
                value={unitFormData.unit_rate}
                onChange={handleUnitFormChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Previous Unit</Form.Label>
              <Form.Control
                type="text"
                name="previous_unit"
                value={unitFormData.previous_unit}
                onChange={handleUnitFormChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Room Units</Form.Label>
              {waterBills.map((bill, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  placeholder={`Room ${bill.id}`}
                  value={unitFormData.room_units[bill.id] || ""}
                  onChange={(e) => handleRoomUnitsChange(bill.id, e.target.value)}
                />
              ))}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddUnitsModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddUnitsSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
        </motion.div>
      )}
    </>
  );
}

export default ShowWaterBill;
