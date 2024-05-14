import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { Link , useNavigate} from 'react-router-dom';
import Header from '../Header/Header';
import './Order.css';
import '../Utilities/No_results.css';


function Order(){
   document.title = "Your Order(s)";
   const [cookies] = useCookies("access_token");
   const[orders, setOrders]=useState([]);
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

    const fetchOrders = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/orders/user', {
            headers: {
              'Authorization': `Bearer ${cookies.access_token}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          setOrders(response.data.orders.reverse());
        } catch (error) {
          console.error('Error fetching Orders:', error);
        }
      };

      useEffect(() => {
        if (!cookies.access_token) {
          navigate('/');
        }
      }, [cookies.access_token]);

      useEffect(() => {
        fetchOrders();
      }, []);

    return(
        <>
         <Header/>
         {Object.keys(orders).length > 0 ?
         <div className="orders_container">
         {orders.map(order => (
             <div className="order_item" key={order.id}>
                 <div className="order_number"><span>Order Number : </span>{order.id}</div>
                 <div className="order_date"><span>Placed on : </span>{formatDate(order.created_at)}</div>
                 <div className="order_price"><span>Total Price : </span>$ {order.total_price}</div>
                 <div className="order_status"><span>Status : </span>{order.status}</div>
                 <div className="order_items"><span>{order.order_items.reduce((total, item) => total + item.quantity, 0)} Item(s)</span></div>
                 <div className="order_images">
                     <div className="img_container">
                     {order.order_items.map(orderItem => (
                      
                     (orderItem.product.images && orderItem.product.images.length > 0 ? (
                      <img key={orderItem.id} src={require(`../../../images/products/${orderItem.product.images[0].path}`)} alt="Product Image"/>
                      ) : (
                          <img src="" alt="No Image" />
                      )
                      )

                     ))}
                     </div>
                 </div>
                 <div className="order_view"><Link to={`/order/view/${order.id}`}>View Order</Link></div>
             </div>
         ))}
         </div>
         :
         <div className="no_results">
            <div className="no_results_i"><i className="fa-solid fa-ban"></i></div>
            <div className="no_results_text">No Order(s) Placed</div>
         </div>
         }
        
        </>
    );
}

export default Order;