import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import Header from '../Header/Header';
import './Vieworder.css';

function Vieworder(){

    const [cookies] = useCookies(["access_token"]);
    const { id } = useParams();
    const [order, setOrder] = useState([]);
    const [orderStatus, setOrderStatus] = useState("");
    const navigate = useNavigate();

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

    const statusStyle = () => {
        const orderWrapper = document.querySelector('.order_wrapper');
        const line1 = document.querySelector('.line_1');
        const line2 = document.querySelector('.line_2');
        const pendingCircle = document.querySelector('.pending_circle');
        const processingCircle = document.querySelector('.processing_circle');
        const completedCircle = document.querySelector('.completed_circle');
        const pendingText = document.querySelector('.pending');
        const processingText = document.querySelector('.processing');
        const completedText = document.querySelector('.completed');

        if (orderWrapper) {
            if (orderStatus === "pending") {
                pendingCircle.style.borderColor = "black";
                pendingText.style.color = "black";
                pendingCircle.style.animation = "fade_shadow 2s ease-out infinite";
            } else if (orderStatus === "processing") {
                pendingCircle.style.borderColor = "black";
                pendingText.style.color = "black";
                pendingCircle.style.backgroundColor = "black";
                line1.style.backgroundColor = "black";
                processingCircle.style.borderColor = "black";
                processingText.style.color = "black";
                processingCircle.style.animation = "fade_shadow 2s ease-out infinite";
            } else if (orderStatus === "completed") {
                pendingCircle.style.borderColor = "black";
                pendingText.style.color = "black";
                pendingCircle.style.backgroundColor = "black";
                line1.style.backgroundColor = "black";
                processingCircle.style.backgroundColor = "black";
                processingCircle.style.borderColor = "black";
                processingText.style.color = "black";
                line2.style.backgroundColor = "black";
                completedCircle.style.backgroundColor = "black";
                completedCircle.style.borderColor = "black";
                completedText.style.color = "black";
            } else if (orderStatus === "cancelled") {
                pendingCircle.style.borderColor = "black";
                pendingCircle.style.backgroundColor = "black";
                pendingText.style.color = "black";
                line1.style.backgroundColor = "black";
                line2.style.backgroundColor = "black";
                processingCircle.remove();
                processingText.remove();
                completedCircle.style.backgroundColor = "black";
                completedCircle.style.borderColor = "black";
                completedText.style.color = "black";
                completedText.innerText = 'Cancelled';
            }
        }
    };

    const fetchOrder = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/orders/${id}`,{
                headers: {
                    'Authorization': `Bearer ${cookies.access_token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  }
            });

            if (response.data.order) {
                setOrder(response.data.order);
                setOrderStatus(response.data.order.status);
            } else {
                navigate('/order');
            }
          } catch (error) {
            console.error('Error fetching Order:', error);
          }
    };

    const cancelOrder = async () => {
        try {
            const response = await axios.put(
                `http://localhost:8000/api/orders/cancel/${id}`,{},
                {
                    headers: {
                        'Authorization': `Bearer ${cookies.access_token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            );
            fetchOrder();
        } catch (error) {
            console.error('Error Cancelling Order:', error);
        }
    };

    const removeItem = async (itemId) => {
        try {
            const response = await axios.delete(
                `http://localhost:8000/api/orders/${id}/item/${itemId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${cookies.access_token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            );
            fetchOrder();

        } catch (error) {
            console.error('Error Delete Order Item:', error);
        }
    };

      useEffect(() => {
        fetchOrder();
      }, []);

      useEffect(() => {
        statusStyle();
      }, [orderStatus]);

    return(
        <>
        <Header/>
        <div className="order_wrapper" data-order-status={orderStatus}>

                <div className="order_status">
                    <div className="line_1"></div>
                    <div className="line_2"></div>
                    <div className="pending">Pending</div>
                    <div className="processing">Processing</div>
                    <div className="completed">Completed</div>
                    <div className="pending_circle"></div>
                    <div className="processing_circle"></div>
                    <div className="completed_circle"></div>
                </div>

                <div className="order_information">
                    
                    <div className="order_cancel">
                        <button id="cancel" onClick={cancelOrder}>Cancel Order</button>
                    </div>
                    <div className="order_nb"><span>Order Number : </span>{order.id}</div>
                    <div className="order_date"><span>Placed on : </span>{formatDate(order.created_at)}</div>
                    <div className="order_price"><span>Total Price : </span>$ {order.total_price}</div>
                    <div className="order_status_text"><span>Status : </span>{order.status}</div>
                    <div className="order_address">
                        <span>Address : </span>
                        {order.address && (
                            <>
                                {order.address.name && `${order.address.name} `}
                                {order.address.surname && `${order.address.surname} - `}
                                {order.address.address && `${order.address.address} - `}
                                {order.address.more_info && `${order.address.more_info} - `}
                                {order.address.district && `${order.address.district} / `}
                                {order.address.locality && `${order.address.locality} - `}
                                {order.address.phone && `${order.address.phone}`}
                            </>
                        )}
                    </div>
                    {order.order_items && (
                        <div className="order_total_items">
                            <span>
                                {order.order_items.length > 0 && (
                                    <>
                                        {order.order_items.reduce((total, item) => total + item.quantity, 0)} Item(s)
                                    </>
                                )}
                            </span>
                        </div>
                    )}
                </div>

                {order.order_items && (
                    <div className="order_items">
                        {order.order_items.map((orderItem) => (
                        <div className="item" key={orderItem.id}>
                        <div className="img_container">
                        <img key={orderItem.id} src={require(`../../../images/products/${orderItem.product.images[0].path}`)} alt="Product Image"/>
                        </div>
                        <div className="item_information">
                            <div className="item_name">{orderItem.product.name}</div>
                            <div className="item_price">$ {orderItem.price}</div>
                            <div className="item_quantity">{orderItem.quantity} Item(s)</div>
                            <div className="item_remove">
                                <button onClick={() => removeItem(orderItem.id)}>Remove</button>
                            </div>
                  
                        </div>
                        </div>
                            
                        ))}
                    </div>
                )}
        </div>
        </>
    );
}
export default Vieworder;