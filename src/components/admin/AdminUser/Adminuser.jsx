import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import Adminheader from "../AdminHeader/Adminheader";

function Adminuser(){

    document.title = "Manage Users";
    const [cookies] = useCookies("access_token");
    const [users,setUsers] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState("");

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
        });
    };

    const fetchUsers = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/users`,
            {
              headers: {
                Authorization: `Bearer ${cookies.access_token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
          const users = response.data.users.filter(user => !user.isAdmin);
          setUsers(users);
        } catch (error) {
          console.error("Error Fetching Users", error);
        }
    };

    const blockUser = async (userId) => {
        try {
            const response = await axios.put(
            `http://localhost:8000/api/users/status/${userId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${cookies.access_token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
          fetchUsers();
          setMessage(response.data.message);
          setShowNotification(true);
        } catch (error) {
          console.error("Error Blocking User", error);
        }
    };

    const deleteUser = async (userId) => {
        try {
            const response = await axios.delete(
            `http://localhost:8000/api/users/${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${cookies.access_token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
            );
            fetchUsers();
            setMessage(response.data.message);
            setShowNotification(true);
        } catch (error) {
            console.error("Error Deleting User", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return(
        <>
        <Adminheader/>
        <div className="container">
            {showNotification && (
                <div className="alert alert-success alert-dismissible fade show m-3" role="alert">
                <strong>{message}</strong>
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            )}
            <div className="row">
            {users.map(user => (
                <div key={user.id} className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3 p-3">
                        <div className="card bg-dark text-bg-danger">
                            <div className="card-body">
                                <h4 className="card-title">{user.name}</h4>
                                <p><b>User ID : </b>{user.id}</p>
                                <p><b>Email : </b>{user.email}</p>
                                <p><b>Created at : </b>{formatDate(user.created_at)}</p>
                                <p><b>Total Orders : </b>{user.orders.length}</p>
                                <p>Status : 
                                    {user.isBlocked == 0 ? (
                                        <b className="text-success">Active</b>
                                    ) : (
                                        <b className="text-danger">Blocked</b>
                                    )}    
                                </p>
                                <div className="card-footer d-grid gap-2">
                                    {user.isBlocked == 0 ? (
                                        <button onClick={() => blockUser(user.id)} className="btn btn-danger">Block this User</button>
                                    ) : (
                                        <button onClick={() => blockUser(user.id)} className="btn btn-success">Unblock this User</button>
                                    )} 
                                </div> 
                                <div className="card-footer d-grid gap-2">
                                    <button onClick={() => deleteUser(user.id)} className="btn btn-danger">Delete</button>
                                </div> 
                            </div>
                        </div>
                    </div>
            ))}  
            </div>
        </div>
        </>
    );
}
export default Adminuser;