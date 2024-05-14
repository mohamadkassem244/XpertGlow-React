import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { useNavigate ,Link} from 'react-router-dom';
import Header from "../Header/Header";
import './Cart.css';
import '../Utilities/No_results.css';
import Notification from '../Notification/Notification';

function Cart(){
    document.title = "Your Cart";
    const [cookies] = useCookies(["access_token"]);
    const [cart, setCart] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedAddressValue, setSelectedAddressValue] = useState('');
    const navigate = useNavigate();
    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState("");

    const closeNotification = () => {
      setShowNotification(false);
  };

    const handleAddressChange = (event) => {
      setSelectedAddressValue(event.target.value);
    };

    const fetchCart = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/cart', {
            headers: {
              'Authorization': `Bearer ${cookies.access_token}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          setCart(response.data.cart_items);
        } catch (error) {
          console.error('Error fetching Cart:', error);
        }
      };

       const fetchAddresses = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/user/addresses', {
            headers: {
              'Authorization': `Bearer ${cookies.access_token}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          setAddresses(response.data.addresses);
        } catch (error) {
          console.error('Error fetching Addresses:', error);
        }
      };

      const removeItem = async (cartItemId) => {
        try {
          const response = await axios.delete(`http://localhost:8000/api/remove_from_cart/${cartItemId}`, {
            headers: {
              'Authorization': `Bearer ${cookies.access_token}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          fetchCart();
          setMessage(response.data.message);
          setShowNotification(true);
        } catch (error) {
          console.error('Error removing cart item from cart:', error);
        }
      };

      const clearCart = async () => {
        try {
          const response = await axios.delete('http://localhost:8000/api/cart/clear', {
            headers: {
              'Authorization': `Bearer ${cookies.access_token}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          fetchCart();
          setMessage(response.data.message);
          setShowNotification(true);
        } catch (error) {
          console.error('Error clearing cart:', error);
        }
      };

      const increaseQuantity = async (cartItemId ,  cartItemQuantity) => {
          try {
            const response = await axios.post(`http://localhost:8000/api/update_cart_item_quantity/${cartItemId}`,{
            quantity: cartItemQuantity+1,
            }, {
              headers: {
                'Authorization': `Bearer ${cookies.access_token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            });
            fetchCart();
            setMessage(response.data.message);
            setShowNotification(true);
          } catch (error) {
            console.error('Error increasing quantity:', error);
          }
      };

      const decreaseQuantity = async (cartItemId ,  cartItemQuantity) => {
        if(cartItemQuantity>1){
          try {
            const response = await axios.post(`http://localhost:8000/api/update_cart_item_quantity/${cartItemId}`,{
            quantity: cartItemQuantity-1,
            }, {
              headers: {
                'Authorization': `Bearer ${cookies.access_token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            });
            fetchCart();
            setMessage(response.data.message);
            setShowNotification(true);
          } catch (error) {
            console.error('Error increasing quantity:', error);
          }
        }
      };

      const placeOrder = async () => {
        if (selectedAddressValue) {
          try {
            const response = await axios.post('http://localhost:8000/api/place_order',{
              address_id: selectedAddressValue,
            }, {
              headers: {
                'Authorization': `Bearer ${cookies.access_token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            });
            fetchCart();
            setMessage(response.data.message);
            setShowNotification(true);
          } catch (error) {
            console.error('Error placing order:', error);
          }
        }
      };

      useEffect(() => {
        fetchCart();
        fetchAddresses();
      }, []);

      useEffect(() => {
        let items = 0;
        let price = 0;
        cart.forEach(cartItem => {
          items += cartItem.quantity;
          price += cartItem.quantity * cartItem.product.price;
        });
        setTotalItems(items);
        setTotalPrice(price);
      }, [cart]);

      useEffect(() => {
        if (!cookies.access_token) {
          navigate('/');
        }
      }, [cookies.access_token]);

return(
    <>
    {showNotification && (
        <Notification message={message} onClose={closeNotification} />
    )}
    <Header/>
    {cart && cart.length > 0 ?
          <div className="cart_wrapper">
          <div className="all_items">
          
          <div className="item empty-item">
              <div className="item_image"></div>
              <div className="item_name"></div>
              <div className="item_quantity"></div>
              <div className="item_subtotal"></div>
              <div className="item_delete"><button id="remove_all" onClick={clearCart}><i className="fa-solid fa-trash"></i></button></div>
          </div>
       
          {cart.map(cartItem => (
  
          <div className="item" key={cartItem.id}>
              <div className="item_image">
                  <div className="image_container">
                  {cartItem.product.images && cartItem.product.images.length > 0 ? (
                            <img src={require(`../../../images/products/${cartItem.product.images[0].path}`)} />
                            ) : (
                            <img src="" alt="No Image" />
                    )}
                  </div>
              </div>
              <div className="item_name">
              <Link to={`/product/${cartItem.product.id}`}>{cartItem.product.name}</Link>
              </div>
  
              <div className="item_quantity">
                  <div className="input_container">
                      <button id="decrease" onClick={() => decreaseQuantity(cartItem.id, cartItem.quantity)}>-</button>
                      <input type="number" id="quantity" value={cartItem.quantity} min="1" readOnly={true}/>
                      <button id="increase" onClick={() => increaseQuantity(cartItem.id, cartItem.quantity)}>+</button>
                  </div>
              </div>
  
              <div className="item_subtotal">
              ${ (cartItem.quantity * cartItem.product.price).toFixed(2) }
              </div>
  
              <div className="item_delete"><button id="remove" onClick={() => removeItem(cartItem.id)}><i className="fa-solid fa-delete-left"></i></button></div>
          </div>
  
          ))}
         
          </div>
          <div className="check">
              <div className="check_summary">Summary</div>
              <div className="check_items">Item(s) : <span>{totalItems}</span></div>
              <div className="check_price">Total Price : <span>${ (totalPrice).toFixed(2) }</span></div>
              <div className="check_address">
                  <select id="address-select" name="address-select" required  value={selectedAddressValue} onChange={handleAddressChange}>
                  <option value="" disabled>Select an Address</option>
                  {addresses.filter(address => address.isDeleted === 0).map(address => (
                       <option key={address.id} value={address.id}>
                       {address.name} {address.surname} / {address.district} - {address.locality} - {address.phone}
                     </option>
                  ))}
                  </select>
              </div>
              <div className="check_place">
                  <button id="place_order" onClick={placeOrder}>Place Order</button>
              </div>
          </div>
          </div> 
          : 
          <div className="no_results">
          <div className="no_results_i"><i className="fa-solid fa-ban"></i></div>
          <div className="no_results_text">Your Cart is Empty</div>
          </div>
          }
    </>
);
}
export default Cart;
