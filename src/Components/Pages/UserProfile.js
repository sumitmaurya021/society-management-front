import React, { useEffect, useState } from 'react';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
} from 'mdb-react-ui-kit';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserProfile.css';
import { ToastContainer } from 'react-toastify';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [editableField, setEditableField] = useState(null);
  const [editedValue, setEditedValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [vehicleData, setVehicleData] = useState({
    total_no_of_two_wheeler: '',
    total_no_of_four_wheeler: '',
    two_wheeler_numbers: [],
    four_wheeler_numbers: [],
  });
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchVehicleData();
  }, []);

  const fetchVehicleData = async () => {
    const blockId = localStorage.getItem('block_id');
    const floorId = localStorage.getItem('floor_id');
    const roomId = localStorage.getItem('room_id');
    const accessToken = localStorage.getItem('access_token');
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/buildings/1/blocks/${blockId}/floors/${floorId}/rooms/${roomId}/vehicles`,
        {
          params: { access_token: accessToken },
        }
      );
      setVehicles(response.data.vehicles);
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
    }
  };

  const handleIconClick = (field) => {
    setEditableField(field);
    setEditedValue(user[field]);
  };

  const handleInputChange = (e) => {
    setEditedValue(e.target.value);
  };

  const handleSave = async () => {
    const updatedUser = { ...user, [editableField]: editedValue };
    setUser(updatedUser);
    setEditableField(null);

    const userId = user.id;
    const accessToken = user.access_token;
    try {
      await axios.put(`http://localhost:3000/api/v1/users/${userId}`, {
        user: { ...updatedUser },
        access_token: accessToken,
      });
      console.log('User information updated successfully.');
    } catch (error) {
      console.error('Error updating user information:', error);
    }
  };

  const handleCancel = () => {
    setEditableField(null);
    setEditedValue('');
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setVehicleData({
      total_no_of_two_wheeler: '',
      total_no_of_four_wheeler: '',
      two_wheeler_numbers: [],
      four_wheeler_numbers: [],
    });
  };

  const handleVehicleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData({ ...vehicleData, [name]: value });
  };

  const handleAddVehicle = async () => {
    const blockId = localStorage.getItem('block_id');
    const floorId = localStorage.getItem('floor_id');
    const roomId = localStorage.getItem('room_id');
    const accessToken = user.access_token;
    try {
      await axios.post(
        `http://localhost:3000/api/v1/buildings/1/blocks/${blockId}/floors/${floorId}/rooms/${roomId}/vehicles`,
        {
          vehicle: {
            ...vehicleData,
            two_wheeler_numbers: vehicleData.two_wheeler_numbers.split(','),
            four_wheeler_numbers: vehicleData.four_wheeler_numbers.split(','),
          },
          access_token: accessToken,
        }
      );
      console.log('Vehicle added successfully.');
      handleCloseModal();
      fetchVehicleData(); // Refresh the vehicle list after adding a new vehicle
    } catch (error) {
      console.error('Error adding vehicle:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ToastContainer />
      <section style={{ backgroundColor: '#eee', height: '100vh', overflow: 'auto' }}>
        <MDBContainer className="py-5">
          <div className="text-end mb-1">
            <Button className="btn btn-sm btn-primary" onClick={handleShowModal}>
              Add Vehicle
            </Button>
          </div>
          <MDBRow>
            <MDBCol lg="4">
              <MDBCard className="mb-4">
                <MDBCardBody className="text-center">
                  <MDBCardImage
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                    alt="avatar"
                    className="rounded-circle"
                    style={{ width: '150px' }}
                    fluid
                  />
                  <p className="text-muted mb-1">{user.role}</p>
                  <p className="text-muted mb-4">{user.owner_or_renter}</p>
                  <div className="d-flex justify-content-center mb-2"></div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol lg="8">
              <MDBCard className="mb-4">
                <MDBCardBody>
                  {['name', 'email', 'mobile_number', 'gender'].map((field) => (
                    <div key={field} className="editable-field-container">
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>{field.charAt(0).toUpperCase() + field.slice(1)}</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9" className="position-relative" style={{ width: 'fit-content' }}>
                          {editableField === field ? (
                            <div className="edit-field">
                              <input
                                type="text"
                                value={editedValue}
                                onChange={handleInputChange}
                                className="edit-input"
                              />
                              <FontAwesomeIcon
                                icon={faCheck}
                                className="action-icon save-icon"
                                onClick={handleSave}
                                style={{ marginRight: '10px', fontSize: '30px' }}
                              />
                              <FontAwesomeIcon
                                icon={faTimes}
                                className="action-icon cancel-icon"
                                style={{ fontSize: '30px' }}
                                onClick={handleCancel}
                              />
                            </div>
                          ) : (
                            <MDBCardText className="text-muted editable-field">
                              {user[field]}
                              <FontAwesomeIcon
                                icon={faPencilAlt}
                                className="edit-icon"
                                onClick={() => handleIconClick(field)}
                              />
                            </MDBCardText>
                          )}
                        </MDBCol>
                      </MDBRow>
                      <hr />
                    </div>
                  ))}
                </MDBCardBody>
              </MDBCard>
              <MDBCard className="mb-4">
                <MDBCardBody>
                  <h5>Vehicles</h5>
                  {vehicles.length > 0 ? (
                    vehicles.map((vehicle) => (
                      <div key={vehicle.id}>
                        <div className='d-flex justify-content-between'>
                          <MDBCardText>
                            <strong>Total Two Wheelers: </strong>{vehicle.total_no_of_two_wheeler}
                          </MDBCardText>
                          <MDBCardText>
                            <strong>Two Wheeler Numbers: </strong>{vehicle.two_wheeler_numbers.join(', ')}
                          </MDBCardText>
                        </div>
                        <div className='d-flex justify-content-between'>
                          <MDBCardText>
                            <strong>Total Four Wheelers: </strong>{vehicle.total_no_of_four_wheeler}
                          </MDBCardText>
                          <MDBCardText>
                            <strong>Four Wheeler Numbers: </strong>{vehicle.four_wheeler_numbers.join(', ')}
                          </MDBCardText>
                        </div>
                        <hr />
                      </div>
                    ))
                  ) : (
                    <MDBCardText>No vehicles found.</MDBCardText>
                  )}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Vehicle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="total_no_of_two_wheeler">
              <Form.Label>Total Number of Two Wheelers</Form.Label>
              <Form.Control
                type="number"
                name="total_no_of_two_wheeler"
                value={vehicleData.total_no_of_two_wheeler}
                onChange={handleVehicleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="total_no_of_four_wheeler">
              <Form.Label>Total Number of Four Wheelers</Form.Label>
              <Form.Control
                type="number"
                name="total_no_of_four_wheeler"
                value={vehicleData.total_no_of_four_wheeler}
                onChange={handleVehicleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="two_wheeler_numbers">
              <Form.Label>Two Wheeler Numbers (comma separated)</Form.Label>
              <Form.Control
                type="text"
                name="two_wheeler_numbers"
                value={vehicleData.two_wheeler_numbers}
                onChange={handleVehicleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="four_wheeler_numbers">
              <Form.Label>Four Wheeler Numbers (comma separated)</Form.Label>
              <Form.Control
                type="text"
                name="four_wheeler_numbers"
                value={vehicleData.four_wheeler_numbers}
                onChange={handleVehicleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddVehicle}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UserProfile;
