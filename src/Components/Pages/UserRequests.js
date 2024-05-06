import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UserRequests.css'; // Import custom CSS file for additional styling
import Spinner from '../Spinner';

function UserRequests() {
    const [requests, setRequests] = useState([]);
    const [isloading, setIsloading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
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

                const response = await axios.get("http://localhost:3000/api/v1/users", config);
                if (response.status === 200) {
                    setIsloading(false);
                    toast.success("Requests fetched successfully");
                    setRequests(response.data.users); // Set users array from the response to the requests state
                } else {
                    toast.error("Error fetching requests");
                }
            } catch (error) {
                console.error("Error fetching requests:", error);
            }
        }

        fetchRequests();
    }, []);

    return (
        <>
        {isloading && <Spinner />}
        <h2 className="mt-4 mb-4">User Requests</h2>
       <div className="p-3">     
        <div className="user_requests">
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>User Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Block</th>
                            <th>Floor</th>
                            <th>Room</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request, index) => (
                            <tr key={index}>
                                <td>{request.id}</td>
                                <td>{request.name}</td>
                                <td>{request.email}</td>
                                <td>{request.mobile_number}</td>
                                <td className='text-capitalize'>{request.role}</td>
                                <td>{request.block_id}</td>
                                <td>{request.floor_id}</td>
                                <td>{request.room_number}</td>
                                <td className='text-capitalize' style={{ color: request.status === "accepted" ? "green" : "red" }}>{request.status}</td>
                                <td className='btn-action'>
                                    <button className='btn btn-sm btn-success'>Approve</button>
                                    <button className='btn btn-sm btn-danger'>Reject</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>
        </div>
        </>
    )
}

export default UserRequests;
