import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { Link} from 'react-router-dom';
import Adminheader from "../AdminHeader/Adminheader";

function Admincarousel(){

    document.title = "Manage Carousels";
    const [cookies] = useCookies("access_token");
    const [carousels,setCarousels] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [messageType, setMessageType] = useState("success");
    const [message, setMessage] = useState("");

    const fetchCarousels = async () => {
        try {
          const response =  await axios.get(
            `http://localhost:8000/api/carousels`,
            {},
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
          setCarousels(response.data.carousels.reverse());
        } catch (error) {
          console.error("Error Fetching Categories", error);
        }
    };

    useEffect(() => {
        fetchCarousels();
     }, []);


    return(
        <>
        <Adminheader/>
        <div className="container">
            {showNotification && (
                <div className={`alert alert-${messageType} alert-dismissible fade show m-3`} role="alert">
                <strong>{message}</strong>
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            )}
        </div>
        </>
    );
}
export default Admincarousel;