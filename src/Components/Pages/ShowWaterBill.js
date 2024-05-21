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
  const [selectedRoom, setSelectedRoom] = useState(null);
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
            unit_rate: waterBills.find(bill => bill.id === waterBillId).unit_rate, // Set unit rate dynamically based on selected water bill
          },
          access_token: accessToken,
        },
        config
      );

      if (response.status === 200) {
        toast.success("Units added successfully");
        setShowAddUnitsModal(false);
        setUnitFormData({
          unit_rate: unit,
          previous_unit: "",
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

  return (
    <motion.div
      className="water-bill-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="header">
        <h2>Show Water Bills</h2>
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="text-center">Bill Name</th>
                <th className="text-center">Month and Year</th>
                <th className="text-center">Unit Rate</th>
                <th className="text-center">Start Date</th>
                <th className="text-center">End Date</th>
                <th className="text-center">Remarks</th>
                <th className="text-center">Actions</th>
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
      <Modal show={showBuildingModal} onHide={() => setShowBuildingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Building Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Building:</Form.Label>
              <Form.Control as="select" value={buildingId} onChange={handleBuildingChange}>
                <option value={1}>Building 1</option>
                <option value={2}>Building 2</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Block:</Form.Label>
              <Form.Control as="select" value={blockId} onChange={handleBlockChange}>
                <option value="">Select Block</option>
                {blocks.map((block) => (
                  <option key={block.id} value={block.id}>
                    {block.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Floor:</Form.Label>
              <Form.Control as="select" value={floorId} onChange={handleFloorChange}>
                <option value="">Select Floor</option>
                {floors.map((floor) => (
                  <option key={floor.id} value={floor.id}>
                    {floor.number}
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
                  <th className="text-capitalize text-center">previous unit (₹)</th>
                  <th className="text-capitalize text-center">total units (₹)</th>
                  <th className="text-capitalize text-center">updated unit (₹)</th>
                  <th className="text-capitalize text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td className="text-center">{room.room_number}</td>
                    <td className="text-center">{room.previous_unit === null ? "-" : room.previous_unit}</td>
                    <td className="text-center">{room.total_units === null ? "-" : room.total_units}</td>
                    <td className="text-center">{room.updated_unit === null ? "-" : room.updated_unit}</td>
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
          <Modal.Title>Add Units for Room {selectedRoom?.room_name}</Modal.Title>
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
              />
            </Form.Group>
            <Form.Group controlId="room_units">
              <Form.Label>Current Unit</Form.Label>
              <Form.Control
                type="number"
                name={`room_units[${selectedRoom?.id}]`}
                value={unitFormData.room_units[selectedRoom?.id] || ""}
                onChange={(e) => handleRoomUnitsChange(selectedRoom?.id, e.target.value)}
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
      <ToastContainer />
    </motion.div>
  );
}

export default ShowWaterBill;
