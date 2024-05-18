import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { Link} from 'react-router-dom';
import Adminheader from "../AdminHeader/Adminheader";


function Adminorder(){

    document.title = "Manage Orders";
    const [cookies] = useCookies("access_token");
    const [orders,setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/orders`,
            {
              headers: {
                Authorization: `Bearer ${cookies.access_token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
          setOrders(response.data.orders.reverse());
        } catch (error) {
          console.error("Error Fetching Orders", error);
        }
    };

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

    useEffect(() => {
        fetchOrders();
     }, []);

    return(
        <>
        <Adminheader/>
        <div className="container">
        <div className="border border-dark border-3 p-3 m-3"> 
        <h3 className="text-center">All Orders</h3>
        <div className="row">
        {orders.map(order => (
            <div key={order.id} className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3 p-3">
                <div className="card bg-dark text-bg-danger">
                    <div className="card-body">
                        <h4 className="card-title"><b>Order ID : </b>{order.id}</h4>
                        <p><b>Owner : </b>{order.user.name}</p>
                        <p><b>Placed On : </b>{formatDate(order.created_at)}</p>
                        <p><b>Total Item(s) : </b>{order.order_items.reduce((total, item) => total + item.quantity, 0)}</p>
                        <p><b>Total Price : </b>$ {order.total_price}</p>
                        <p className="text-capitalize"><b>Status : </b>{order.status}</p>
                        <Link className="d-grid gap-2 btn btn-primary" to={`/admin/order/${order.id}`}>View</Link>
                    </div>
                </div>
            </div>
        ))}
            
        </div>
        </div>
        </div>

        </>
    );
}
export default Adminorder;