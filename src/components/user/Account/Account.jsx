import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { useNavigate} from 'react-router-dom';
import './Account.css';
import Header from '../Header/Header';

function Account(){

    document.title = localStorage.getItem('UserName');
    const [cookies] = useCookies(["access_token"]);
    const [addresses, setAddresses] = useState([]);
    const navigate = useNavigate();

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
        fetchAddresses();
    }, []);

    useEffect(() => {
        if (!cookies.access_token) {
          navigate('/');
        }
      }, [cookies.access_token]);

    return(
        <>
        <Header/>
        <div className="account_wrapper">

                <div className="account_name">nour</div>
                <div className="account_email">Email : nourkassem@gmail.com</div>
                <div className="account_password">
                    <div>
                        <button id="password">Password</button>
                    </div>
                    <div className="password_input">
                        <form method="POST" action="/change_password">
                            <input type="password" name="current_password" placeholder="Current Password" required/>
                            <input type="password" name="new_password" placeholder="New Password" required/>
                            <input type="submit" value="Submit"/>
                        </form>
                        <button className="close_password">Close</button>
                    </div>
                </div>

                <div className="account_addresses">
                    <div>
                        <button id="address">Addresses</button>
                    </div>

                    <div className="address_input">
                        <form method="POST" action="/add_address">
                            <input type="text" name="name" placeholder="Name" required/>
                            <input type="text" name="surname" placeholder="Surname" required/>
                            <input type="text" name="address" placeholder="Address" required/>
                            <input type="text" name="more_info" placeholder="More Info" required/>
                            <input type="text" name="district" placeholder="District" required/>
                            <input type="text" name="locality" placeholder="Locality" required/>
                            <input type="text" name="phone" placeholder="Phone" required/>
                            <input type="submit" value="New Address"/>
                        </form>
                        <button className="close_address">Close</button>
                    </div>

                    <div className="all_addresses">  
                        {addresses.filter(address => address.isDeleted === 0).map(address => (
                            <li>
                            {address.name} {address.surname} - 
                            {address.address} - {address.more_info} -
                            {address.district} / {address.locality} - 
                            {address.phone}
                            <form action="/delete_address/{{$address->id}}" method="POST">
                            
                                <button type="submit">Delete</button>
                            </form>
                        </li>
                        ))}
                    </div>
                </div>
        </div>
        </>
    );
}

export default Account;