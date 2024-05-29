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

  const [buildingId, setBuildingId] = useState(1); // Initial building ID
  const [blockId, setBlockId] = useState(null);
  const [floorId, setFloorId] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const accessToken = localStorage.getItem("access_token"); // Retrieve access token from local storage
  const [waterBillId, setWaterBillId] = useState(null);

  useEffect(() => {
    if (buildingId) {
      fetchBlocks();
    }
  }, [buildingId]);

  useEffect(() => {
    if (blockId) {
      fetchFloors();
    }
  }, [blockId]);

  useEffect(() => {
    if (floorId) {
      fetchRooms();
    }
  }, [floorId]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const response = await axios.get(
          `http://localhost:3000/api/v1/buildings/${buildingId}/water_bills`,
          config
        );

        if (response.status === 200) {
          const formattedBills = response.data.map((bill) => ({
            ...bill,
            start_date: new Date(bill.start_date).toISOString().substr(0, 10),
            end_date: new Date(bill.end_date).toISOString().substr(0, 10),
          }));

          setWaterBills(formattedBills);
          setIsLoading(false);
          toast.success("Water bills fetched successfully");
        } else {
          toast.error("Error fetching water bills");
        }
      } catch (error) {
        console.error("Error fetching water bills:", error);
        toast.error("Error fetching water bills");
      }
    };

    fetchBills();
  }, [buildingId]);

  const fetchBlocks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/buildings/${buildingId}/blocks`,
        {
          params: {
            access_token: accessToken,
          },
        }
      );
      setBlocks(response.data);
      setBlockId(null);
      setFloors([]);
      setRooms([]);
    } catch (error) {
      console.error("Error fetching blocks:", error);
    }
  };

  const fetchFloors = async () => {
    if (blockId) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/buildings/${buildingId}/blocks/${blockId}/floors`,
          {
            params: {
              access_token: accessToken,
            },
          }
        );
        setFloors(response.data);
        setFloorId(null);
        setRooms([]);
      } catch (error) {
        console.error("Error fetching floors:", error);
      }
    }
  };

  const fetchRooms = async () => {
    if (floorId) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/buildings/${buildingId}/blocks/${blockId}/floors/${floorId}/rooms`,
          {
            params: {
              access_token: accessToken,
            },
          }
        );
        setRooms(response.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    }
  };

  const handleBuildingChange = (event) => {
    setBuildingId(event.target.value);
  };

  const handleBlockChange = (event) => {
    setBlockId(event.target.value);
  };

  const handleFloorChange = (event) => {
    setFloorId(event.target.value);
  };

  const handleAddUnitsModalOpen = (billId) => {
    setShowBuildingModal(true);
    setWaterBillId(billId);
  };

  const handleRoomAddUnitsClick = (room) => {
    setSelectedRoom(room);
    const previousUnit = room.updated_unit || 0;
    const currentUnit = unitFormData.room_units[room.id] || 0;
    setUnitFormData((prevFormData) => ({
      ...prevFormData,
      previous_unit: previousUnit,
      room_units: {
        ...prevFormData.room_units,
        [room.id]: currentUnit,
      },
    }));
    setShowAddUnitsModal(true);
  };

  const handleAddUnitsModalClose = () => {
    setShowAddUnitsModal(false);
    setSelectedRoom(null);
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
          previous_unit: "",
          room_units: {},
        });
        fetchRooms();
      } else {
        toast.error("Error adding units");
      }
    } catch (error) {
      console.error("Error adding units:", error);
      toast.error("Error adding units");
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
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios.put(
        `http://localhost:3000/api/v1/buildings/${buildingId}/water_bills/${selectedBill.id}`,
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
      toast.error("Error updating bill");
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios.delete(
        `http://localhost:3000/api/v1/buildings/${buildingId}/water_bills/${selectedBill.id}`,
        {
          params: {
            access_token: accessToken,
          },
        },
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
      toast.error("Error deleting bill");
    }
  };

  const handleCloseModal = () => {
    setShowBuildingModal(false);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
  };

  const handleDeleteConfirmationClose = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="water-bill-container">
        <h1 className="text-center mt-3 mb-4">Water Bill Management</h1>
        {isLoading ? (
          <Spinner />
        ) : (
          <div>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Bill Name</th>
                  <th>Month & Year</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                  <th>Add Unit</th>
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
                      <Button
                        variant="primary"
                        className="btn-sm"
                        onClick={() => handleEdit(bill)}
                      >
                        Edit
                      </Button>{" "}
                      <Button
                        className="btn-sm"
                        variant="danger"
                        onClick={() => handleDelete(bill)}
                      >
                        Delete
                      </Button>
                    </td>
                    <td><Button
                        className="btn-sm"
                        variant="success"
                        onClick={() => handleAddUnitsModalOpen(bill.id)}
                      >
                        Add Units
                      </Button></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
      <Modal show={showBuildingModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Select Block and Floor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBuildingSelect">
              <Form.Label>Building</Form.Label>
              <Form.Control
                as="select"
                value={buildingId}
                onChange={handleBuildingChange}
              >
                <option value="1">Building 1</option>
                <option value="2">Building 2</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formBlockSelect">
              <Form.Label>Block</Form.Label>
              <Form.Control
                as="select"
                value={blockId}
                onChange={handleBlockChange}
              >
                <option value="">Select Block</option>
                {blocks.map((block) => (
                  <option key={block.id} value={block.id}>
                    {block.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formFloorSelect">
              <Form.Label>Floor</Form.Label>
              <Form.Control
                as="select"
                value={floorId}
                onChange={handleFloorChange}
              >
                <option value="">Select Floor</option>
                {floors.map((floor) => (
                  <option key={floor.id} value={floor.id}>
                    {floor.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={() => setShowAddUnitsModal(true)}>
            Next
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAddUnitsModal} onHide={handleAddUnitsModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Units</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="unitRate">
              <Form.Label>Unit Rate</Form.Label>
              <Form.Control
                type="number"
                name="unit_rate"
                value={unitFormData.unit_rate}
                onChange={handleUnitFormChange}
              />
            </Form.Group>

            <Form.Group controlId="previousUnit">
              <Form.Label>Previous Unit</Form.Label>
              <Form.Control
                type="number"
                name="previous_unit"
                value={unitFormData.previous_unit}
                onChange={handleUnitFormChange}
              />
            </Form.Group>

            <h5>Room Units</h5>
            {rooms.map((room) => (
              <Form.Group key={room.id} controlId={`room-${room.id}`}>
                <Form.Label>{room.name}</Form.Label>
                <Form.Control
                  type="number"
                  value={unitFormData.room_units[room.id] || ""}
                  onChange={(e) =>
                    handleRoomUnitsChange(room.id, e.target.value)
                  }
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddUnitsModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddUnitsSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Bill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="billName">
              <Form.Label>Bill Name</Form.Label>
              <Form.Control
                type="text"
                name="bill_name"
                value={editFormData.bill_name}
                onChange={handleEditFormChange}
              />
            </Form.Group>

            <Form.Group controlId="billMonthYear">
              <Form.Label>Month & Year</Form.Label>
              <Form.Control
                type="text"
                name="bill_month_and_year"
                value={editFormData.bill_month_and_year}
                onChange={handleEditFormChange}
              />
            </Form.Group>

            <Form.Group controlId="startDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="start_date"
                value={editFormData.start_date}
                onChange={handleEditFormChange}
              />
            </Form.Group>

            <Form.Group controlId="endDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="end_date"
                value={editFormData.end_date}
                onChange={handleEditFormChange}
              />
            </Form.Group>

            <Form.Group controlId="remarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                as="textarea"
                name="remarks"
                value={editFormData.remarks}
                onChange={handleEditFormChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteConfirmation} onHide={handleDeleteConfirmationClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the bill for{" "}
          {selectedBill.bill_name}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteConfirmationClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteSubmit}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </motion.div>
  );
}

export default ShowWaterBill;
