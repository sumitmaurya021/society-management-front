import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Spinner from "../Spinner";
import { ToastContainer, toast } from "react-toastify";
import { Modal, Button, Form, Table } from "react-bootstrap";
import "./ShowWaterBill.css";

function ShowWaterBill() {
  const [waterBills, setWaterBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBuildingModal, setShowBuildingModal] = useState(false);
  const [showAddUnitsModal, setShowAddUnitsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showCreateBillModal, setShowCreateBillModal] = useState(false); // New state for Create Bill modal
  const [selectedBill, setSelectedBill] = useState({});
  const [editFormData, setEditFormData] = useState({
    bill_name: "",
    bill_month_and_year: "",
    start_date: "",
    end_date: "",
    remarks: "",
  });

  const [unitFormData, setUnitFormData] = useState({
    unit_rate: "",
    previous_unit: "",
    room_units: {},
  });

  const [createFormData, setCreateFormData] = useState({
    bill_name: "",
    bill_month_and_year: "",
    start_date: "",
    end_date: "",
    remarks: "",
  });

  const [buildingId, setBuildingId] = useState(1); // Initial building ID
  const [blockId, setBlockId] = useState(null);
  const [floorId, setFloorId] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const accessToken = localStorage.getItem("access_token"); // Retrieve access token from local storage
  const [unit, setUnit] = useState(null);
  const [waterBillId, setWaterBillId] = useState(null);

  // Fetch blocks when buildingId changes
  useEffect(() => {
    if (buildingId) {
      fetchBlocks();
    }
  }, [buildingId]);

  // Fetch floors when blockId changes
  useEffect(() => {
    if (blockId) {
      fetchFloors();
    }
  }, [blockId]);

  // Fetch rooms when floorId changes
  useEffect(() => {
    if (floorId) {
      fetchRooms();
    }
  }, [floorId]);

  // Fetch water bills and set the appropriate water bill
  useEffect(() => {
    const fetchBills = async () => {
      try {
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

  // Fetch blocks
  const fetchBlocks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/buildings/${buildingId}/blocks`,
        {
          params: {
            access_token: accessToken, // Use the access token retrieved from local storage
          },
        }
      );
      setBlocks(response.data); // Assuming the response is an array of blocks
      setBlockId(null); // Reset blockId when new blocks are fetched
      setFloors([]); // Clear floors when blocks change
      setRooms([]); // Clear rooms when blocks change
    } catch (error) {
      console.error("Error fetching blocks:", error);
    }
  };

  // Fetch floors
  const fetchFloors = async () => {
    if (blockId) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/buildings/${buildingId}/blocks/${blockId}/floors`,
          {
            params: {
              access_token: accessToken, // Use the access token retrieved from local storage
            },
          }
        );
        setFloors(response.data); // Assuming the response is an array of floors
        setFloorId(null); // Reset floorId when new floors are fetched
        setRooms([]); // Clear rooms when floors change
      } catch (error) {
        console.error("Error fetching floors:", error);
      }
    }
  };

  // Fetch rooms
  const fetchRooms = async () => {
    if (floorId) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/buildings/${buildingId}/blocks/${blockId}/floors/${floorId}/rooms`,
          {
            params: {
              access_token: accessToken, // Use the access token retrieved from local storage
            },
          }
        );
        setRooms(response.data); // Assuming the response is an array of rooms
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    }
  };

  // Handle building change
  const handleBuildingChange = (event) => {
    setBuildingId(event.target.value);
  };

  // Handle block change
  const handleBlockChange = (event) => {
    setBlockId(event.target.value);
  };

  // Handle floor change
  const handleFloorChange = (event) => {
    setFloorId(event.target.value);
  };

  // Open add units modal
  const handleAddUnitsModalOpen = (billId) => {
    setShowBuildingModal(true);
    setWaterBillId(billId); // Set the selected water bill ID dynamically
  };

  // Open add units modal for specific room
  const handleRoomAddUnitsClick = (room) => {
    setSelectedRoom(room);
    let previousUnit = room.updated_unit || 0; // Use updated unit if available, otherwise default to 0
    const currentUnit = unitFormData.room_units[room.id] || 0;
    setUnitFormData((prevFormData) => ({
      ...prevFormData,
      previous_unit: previousUnit, // Set previous unit to updated unit or 0 if not available
      room_units: {
        ...prevFormData.room_units,
        [room.id]: currentUnit, // Set current unit to updated unit
      },
    }));
    setShowAddUnitsModal(true);
  };

  // Close add units modal
  const handleAddUnitsModalClose = () => {
    setShowAddUnitsModal(false);
    setSelectedRoom(null);
  };

  // Handle form change
  const handleUnitFormChange = (e) => {
    setUnitFormData({
      ...unitFormData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle room units change
  const handleRoomUnitsChange = (roomId, value) => {
    setUnitFormData({
      ...unitFormData,
      room_units: {
        ...unitFormData.room_units,
        [roomId]: value,
      },
    });
  };

  // Handle add units submit
  const handleAddUnitsSubmit = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios.post(
        `http://localhost:3000/api/v1/buildings/${buildingId}/blocks/${blockId}/floors/${floorId}/rooms/${selectedRoom.id}/update_units`,
        {
          water_bill_id: waterBillId,
          water_bill: {
            ...unitFormData,
          },
          access_token: accessToken,
        },
        config
      );

      if (response.status === 200) {
        toast.success("Units added successfully");

        // Update the selected room's updated unit
        setRooms((prevRooms) =>
          prevRooms.map((room) =>
            room.id === selectedRoom.id
              ? { ...room, previous_unit: unitFormData.room_units[room.id] }
              : room
          )
        );

        setShowAddUnitsModal(false);
        setUnitFormData({
          unit_rate: "",
          previous_unit: "" || 0,
          room_units: {},
        });
        fetchRooms(); // Refresh rooms to reflect updated units
      } else {
        toast.error("Error adding units");
      }
    } catch (error) {
      console.error("Error adding units:", error);
    }
  };

  const handleEdit = (bill) => {
    setSelectedBill(bill);
    setEditFormData({
      bill_name: bill.bill_name,
      bill_month_and_year: bill.bill_month_and_year,
      start_date: bill.start_date,
      end_date: bill.end_date,
      remarks: bill.remarks,
    });
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
  };

  const handleEditFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios.put(
        `http://localhost:3000/api/v1/buildings/${buildingId}/water_bills/${selectedBill.id}`,
        {
          water_bill: {
            ...editFormData,
          },
          access_token: accessToken,
        },
        config
      );

      if (response.status === 200) {
        toast.success("Bill updated successfully");

        setWaterBills((prevBills) =>
          prevBills.map((bill) =>
            bill.id === selectedBill.id ? { ...bill, ...editFormData } : bill
          )
        );
        setShowEditModal(false);
      } else {
        toast.error("Error updating bill");
      }
    } catch (error) {
      console.error("Error updating bill:", error);
    }
  };

  const handleDeleteConfirmation = (bill) => {
    setSelectedBill(bill);
    setShowDeleteConfirmation(true);
  };

  const handleDelete = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios.delete(
        `http://localhost:3000/api/v1/buildings/${buildingId}/water_bills/${selectedBill.id}`,
        config
      );

      if (response.status === 200) {
        toast.success("Bill deleted successfully");

        setWaterBills((prevBills) =>
          prevBills.filter((bill) => bill.id !== selectedBill.id)
        );
        setShowDeleteConfirmation(false);
      } else {
        toast.error("Error deleting bill");
      }
    } catch (error) {
      console.error("Error deleting bill:", error);
    }
  };

  const handleCreateBillModalOpen = () => {
    setShowCreateBillModal(true);
  };

  const handleCreateBillModalClose = () => {
    setShowCreateBillModal(false);
  };

  const handleCreateFormChange = (e) => {
    setCreateFormData({
      ...createFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios.post(
        `http://localhost:3000/api/v1/buildings/${buildingId}/water_bills`,
        {
          water_bill: {
            ...createFormData,
          },
          access_token: accessToken,
        },
        config
      );

      if (response.status === 200) {
        toast.success("Bill created successfully");

        setWaterBills([...waterBills, response.data]);
        setShowCreateBillModal(false);
        setCreateFormData({
          bill_name: "",
          bill_month_and_year: "",
          start_date: "",
          end_date: "",
          remarks: "",
        });
      } else {
        toast.error("Error creating bill");
      }
    } catch (error) {
      console.error("Error creating bill:", error);
    }
  };

  return (
    <motion.div className="show-water-bill" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="water-bills">
          <h1>Water Bills</h1>
          <Button onClick={handleCreateBillModalOpen}>Create Water Bill</Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Bill Name</th>
                <th>Month and Year</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {waterBills.map((bill) => (
                <tr key={bill.id}>
                  <td>{bill.bill_name}</td>
                  <td>{bill.bill_month_and_year}</td>
                  <td>{bill.start_date}</td>
                  <td>{bill.end_date}</td>
                  <td>{bill.remarks}</td>
                  <td>
                    <Button onClick={() => handleEdit(bill)}>Edit</Button>
                    <Button onClick={() => handleDeleteConfirmation(bill)}>Delete</Button>
                    <Button onClick={() => handleAddUnitsModalOpen(bill.id)}>Add Units</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Edit Bill Modal */}
      <Modal show={showEditModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Water Bill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditFormSubmit}>
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
              <Form.Label>Month and Year</Form.Label>
              <Form.Control
                type="text"
                name="bill_month_and_year"
                value={editFormData.bill_month_and_year}
                onChange={handleEditFormChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="start_date"
                value={editFormData.start_date}
                onChange={handleEditFormChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
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
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Water Bill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this water bill?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create Water Bill Modal */}
      <Modal show={showCreateBillModal} onHide={handleCreateBillModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Water Bill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateFormSubmit}>
            <Form.Group>
              <Form.Label>Bill Name</Form.Label>
              <Form.Control
                type="text"
                name="bill_name"
                value={createFormData.bill_name}
                onChange={handleCreateFormChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Month and Year</Form.Label>
              <Form.Control
                type="text"
                name="bill_month_and_year"
                value={createFormData.bill_month_and_year}
                onChange={handleCreateFormChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="start_date"
                value={createFormData.start_date}
                onChange={handleCreateFormChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="end_date"
                value={createFormData.end_date}
                onChange={handleCreateFormChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                type="text"
                name="remarks"
                value={createFormData.remarks}
                onChange={handleCreateFormChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Create Bill
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Add Units Modal */}
      <Modal show={showAddUnitsModal} onHide={handleAddUnitsModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Units</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddUnitsSubmit}>
            <Form.Group>
              <Form.Label>Unit ID</Form.Label>
              <Form.Control
                type="text"
                name="unit_id"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Unit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </motion.div>
  );
};

export default ShowWaterBill;
