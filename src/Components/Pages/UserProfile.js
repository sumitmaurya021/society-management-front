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
import './UserProfile.css'; // Import the CSS file
import { ToastContainer } from 'react-toastify';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [editableField, setEditableField] = useState(null);
  const [editedValue, setEditedValue] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

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
        user: {
          ...updatedUser,
        },
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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <ToastContainer />
    <section style={{ backgroundColor: '#eee', height: '100vh' }}>
      <MDBContainer className="py-5">
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
                <div className="d-flex justify-content-center mb-2">
                </div>
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
                      <MDBCol sm="9" className="position-relative" style={{width: 'fit-content'}}>
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
                              style={{ marginRight: '10px' , fontSize: '30px'}}
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
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
    </>
  );
}

export default UserProfile;
