import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import Header from "../Header/Header";
import './Cart.css';

function Cart(){

    const [cookies] = useCookies("access_token");
    const [cart, setCart] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

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

return(
    <>
    <Header/>
    <div className="cart_wrapper" data-cart-id="">
        <div className="all_items">
          
        <div className="item empty-item">
            <div className="item_image"></div>
            <div className="item_name"></div>
            <div className="item_quantity"></div>
            <div className="item_subtotal"></div>
            <div className="item_delete"><button id="remove_all"><i className="fa-solid fa-trash"></i></button></div>
        </div>
     
        {cart.map(cartItem => (

        <div className="item" data-item-id="">
            <div className="item_image">
                <div className="image_container">
                <img src={require(`../../../images/products/${cartItem.product.images[0].path}`)} />
                </div>
            </div>
            <div className="item_name">
                <a href="">{cartItem.product.name}</a>
            </div>
            <div className="item_quantity">
                <div className="input_container">
                    <button id="decrease">-</button>
                    <input type="number" id="quantity" value={cartItem.quantity} min="1" readonly/>
                    <button id="increase" >+</button>
                </div>
            </div>

            <div className="item_subtotal" data-price-per-item="">
            ${ (cartItem.quantity * cartItem.product.price).toFixed(2) }
            </div>

            <div className="item_delete"><button id="remove"><i className="fa-solid fa-delete-left"></i></button></div>
        </div>

        ))}
       
        </div>
        <div className="check">
            <div className="check_summary">Summary</div>
            <div className="check_items">Item(s) : <span>{totalItems}</span></div>
            <div className="check_price">Total Price : <span>${ (totalPrice).toFixed(2) }</span></div>
            <div className="check_address">
                <select id="address-select" name="address-select" required>
                <option value="" disabled selected>Select an Address</option>

                {addresses.filter(address => address.isDeleted === 0).map(address => (
                     <option key={address.id} value={address.id}>
                     {address.name} {address.surname} / {address.district} - {address.locality} - {address.phone}
                   </option>
                ))}

                </select>
            </div>
            <div className="check_place" data-cart-id="">
                <button id="place_order" >Place Order</button>
            </div>
        </div>
        </div>

    </>
);
}
export default Cart;
