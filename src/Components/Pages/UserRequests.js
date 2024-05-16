import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UserRequests.css'; // Import custom CSS file for additional styling
import Spinner from '../Spinner';
import { ThreeDots } from 'react-loader-spinner';

function UserRequests() {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
                    setIsLoading(false);
                    toast.success("Requests fetched successfully");
                    setRequests(response.data.users); // Set users array from the response to the requests state
                } else {
                    toast.error("Error fetching requests");
                }
            } catch (error) {
                console.error("Error fetching requests:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchRequests();
    }, []);

    const handleApprove = async (id) => {
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

            // Update the request status to 'loading'
            updateRequestStatus(id, 'loading');

            const response = await axios.post("http://localhost:3000/api/v1/accept_user", { id, access_token: accessToken }, config);
            if (response.status === 200) {
                toast.success("User approved successfully");
                updateRequestStatus(id, 'accepted');
            } else {
                toast.error("Error approving user");
                updateRequestStatus(id, 'pending'); // Revert status back to 'pending' if there's an error
            }
        } catch (error) {
            console.error("Error approving user:", error);
            updateRequestStatus(id, 'pending'); // Revert status back to 'pending' if there's an error
        }
    };

    const handleReject = async (id) => {
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

            // Update the request status to 'loading'
            updateRequestStatus(id, 'loading');

            const response = await axios.post("http://localhost:3000/api/v1/reject_user", { id, access_token: accessToken }, config);
            if (response.status === 200) {
                toast.success("User rejected successfully");
                updateRequestStatus(id, 'rejected');
            } else {
                toast.error("Error rejecting user");
                updateRequestStatus(id, 'pending'); // Revert status back to 'pending' if there's an error
            }
        } catch (error) {
            console.error("Error rejecting user:", error);
            updateRequestStatus(id, 'pending'); // Revert status back to 'pending' if there's an error
        }
    };

    const updateRequestStatus = (id, status) => {
        setRequests(prevRequests => {
            return prevRequests.map(user => {
                if (user.id === id) {
                    user.status = status;
                }
                return user;
            });
        });
    };

    return (
        <>
            {isLoading ? <Spinner size="sm" /> : (
                <>
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
                                            <th>Gender</th>
                                            <th>Status</th>
                                            <th>owner_or_renter</th>
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
                                                <td>{request.block}</td>
                                                <td>{request.floor === 0 ? "Ground Floor" : request.floor}</td>
                                                <td>{request.room}</td>
                                                <td className='text-capitalize'>{request.gender}</td>
                                                <td className='text-capitalize' style={{ color: request.status === "accepted" ? "green" : request.status === "rejected" ? "red" : "black" }}>{request.status}</td>
                                                <td className='text-capitalize'>{request.owner_or_renter}</td>
                                                <td className='btn-action'>
                                                    {request.status === 'loading' ? (
                                                        
                                                        <ThreeDots
                                                            visible={true}
                                                            height="30"
                                                            width="30"
                                                            color="#4fa94d"
                                                            radius="9"
                                                            ariaLabel="three-dots-loading"
                                                            wrapperStyle={{}}
                                                            wrapperClass=""
                                                            />
                                                    ) : (
                                                        <>
                                                            {(request.status === 'pending' || request.status === 'rejected') && (
                                                                <button onClick={() => handleApprove(request.id)} className='btn btn-sm btn-success'>Approve</button>
                                                            )}
                                                            {(request.status === 'pending' || request.status === 'accepted') && (
                                                                <button onClick={() => handleReject(request.id)} className='btn btn-sm btn-danger'>Reject</button>
                                                            )}
                                                        </>
                                                    )}
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
            )}
        </>
    )
}

export default UserRequests;
