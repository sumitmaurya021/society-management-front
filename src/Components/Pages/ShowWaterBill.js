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
  const [showCreateBillModal, setShowCreateBillModal] = useState(false);
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
  const [unit, setUnit] = useState(null);
  const [waterBillId, setWaterBillId] = useState(null);

  const [createFormData, setCreateFormData] = useState({
    bill_name: "Water Bill",
    bill_month_and_year: "",
    unit_rate: "",
    start_date: "",
    end_date: "",
    remarks: "",
  });

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

  const handleCreateFormChange = (e) => {
    setCreateFormData({
      ...createFormData,
      [e.target.name]: e.target.value,
    });
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
      unit_rate: bill.unit_rate,
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

  const handleCreateBillModalOpen = () => {
    setShowCreateBillModal(true);
  };

  const handleCreateBillModalClose = () => {
    setShowCreateBillModal(false);
  };

  const handleCreateFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/buildings/${buildingId}/water_bills`,
        {
          water_bill: {
            ...createFormData,
          },
          access_token: accessToken,
        },
      );

      if (response.status === 201) {
        toast.success("Bill created successfully");

        setWaterBills([...waterBills, response.data]);
        setShowCreateBillModal(false);
        setCreateFormData({
          bill_name: "",
          bill_month_and_year: "",
          start_date: "",
          end_date: "",
          unit_rate: "",
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
    <>
    <motion.div
      className="water-bill-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="header">
        <h2>Show Water Bills</h2>
      </div>
      <div className="text-end mb-4">
      <button className="btn btn-primary btn-sm" onClick={handleCreateBillModalOpen}>Create Water Bill</button>
    </div>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="text-center">Bill Name</th>
                <th className="text-center">Bill Month & Year</th>
                <th className="text-center">Unit Rate</th>
                <th className="text-center">Start Date</th>
                <th className="text-center">End Date</th>
                <th className="text-center">Remarks</th>
                <th className="text-center">Actions</th>
                <th className="text-center">Add Unit</th>
              </tr>
            </thead>
            <tbody>
              {waterBills.map((bill) => (
                <tr key={bill.id}>
                  <td className="text-center">{bill.bill_name}</td>
                  <td className="text-center">{bill.bill_month_and_year}</td>
                  <td className="text-center">{bill.unit_rate}</td>
                  <td className="text-center">{bill.start_date}</td>
                  <td className="text-center">{bill.end_date}</td>
                  <td className="text-center">{bill.remarks}</td>
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
                  <td>
                    <Button
                      variant="primary"
                      className="btn btn-sm btn-primary btn-outline-success text-center"
                      onClick={() => handleAddUnitsModalOpen(bill.id)}
                    >
                      Add Units
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {/* Building Modal */}
      <Modal
        show={showBuildingModal}
        onHide={() => setShowBuildingModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Building Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Building:</Form.Label>
              <Form.Control
                as="select"
                value={buildingId}
                onChange={handleBuildingChange}
              >
                <option value={1}>Building 1</option>
                <option value={2}>Building 2</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Block:</Form.Label>
              <Form.Control
                as="select"
                value={blockId}
                onChange={handleBlockChange}
              >
                <option value="">Select Block</option>
                {blocks.map((block) => (
                  <option key={block.id} value={block.id}>
                    {block.block_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Floor:</Form.Label>
              <Form.Control
                as="select"
                value={floorId}
                onChange={handleFloorChange}
              >
                <option value="">Select Floor</option>
                {floors.map((floor) => (
                  <option key={floor.id} value={floor.id}>
                    {floor.floor_number}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
          <div>
            <h5 className="mt-3 mb-3 font-monospace">Add Units to Rooms:</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th className="text-center">Room Number</th>
                  <th className="text-capitalize text-center">
                    previous unit (₹)
                  </th>
                  <th className="text-capitalize text-center">
                    updated unit (₹)
                  </th>
                  <th className="text-capitalize text-center">
                    total units (₹)
                  </th>
                  <th className="text-capitalize text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td className="text-center">{room.room_number}</td>
                    <td className="text-center">
                      {room.previous_unit === null ? "-" : room.previous_unit}
                    </td>
                    <td className="text-center">
                      {room.updated_unit === null ? "-" : room.updated_unit}
                    </td>
                    <td className="text-center">
                      {room.total_units === null ? "-" : room.total_units}
                    </td>
                    <td className="text-center">
                      <Button
                        className="btn btn-sm btn-primary btn-outline-success"
                        onClick={() => handleRoomAddUnitsClick(room)}
                      >
                        Add Units
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
      </Modal>

      {/* Add Units Modal */}
      <Modal show={showAddUnitsModal} onHide={handleAddUnitsModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Add Units for Room {selectedRoom?.room_number}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="previous_unit">
              <Form.Label>Previous Unit</Form.Label>
              <Form.Control
                type="number"
                name="previous_unit"
                value={unitFormData.previous_unit}
                onChange={handleUnitFormChange}
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="room_units">
              <Form.Label>Current Unit</Form.Label>
              <Form.Control
                type="number"
                name={`room_units[${selectedRoom?.id}]`}
                value={unitFormData.room_units[selectedRoom?.id] || ""}
                onChange={(e) =>
                  handleRoomUnitsChange(selectedRoom?.id, e.target.value)
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddUnitsModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddUnitsSubmit}>
            Add Unit
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

            <Form.Group controlId="billAmount">
              <Form.Label>unit_rate</Form.Label>
              <Form.Control
                type="number"
                name="unit_rate"
                value={editFormData.unit_rate}
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

            <Form.Group controlId="billMonthYear">
              <Form.Label>Unit rate</Form.Label>
              <Form.Control
                type="number"
                name="unit_rate"
                value={createFormData.unit_rate}
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" type="submit" onClick={handleCreateFormSubmit}>
              Create Bill
            </Button>
            </Modal.Footer>
      </Modal>
    </motion.div>
    </>
  );
}

export default ShowWaterBill;