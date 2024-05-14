import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { useNavigate} from 'react-router-dom';
import './Account.css';
import Header from '../Header/Header';
import Notification from '../Notification/Notification';

function Account(){

    document.title = localStorage.getItem('UserName');
    const[cookies , setCookies] = useCookies("access_token");
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showAddress, setShowAddress] = useState(false);
    const [currentPassword, setcurrentPassword] = useState('');
    const [newPassword, setnewPassword] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState("");
    const [newAddress, setNewAddress] = useState({
        name: "",
        surname: "",
        address: "",
        more_info: "",
        district: "",
        locality: "",
        phone: "",
      });

    const closeNotification = () => {
        setShowNotification(false);
    };

    const openPassword = () => {
        setShowPassword(true);
        setShowAddress(false);
    };
    
    const closePassword = () => {
        setShowPassword(false);
    };
    
    const openAddress = () => {
        setShowAddress(true);
        setShowPassword(false);
    };
    
    const closeAddress = () => {
        setShowAddress(false);
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

      const changePassword = async () => {

          try {
            const response = await axios.put('http://localhost:8000/api/users/change_password',{
                current_password: currentPassword,
                new_password: newPassword,
            },{
              headers: {
                Authorization: `Bearer ${cookies.access_token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
              }
            });
            if (response.status === 200) {
                 setMessage(response.data.message);
                setShowNotification(true);
                setCookies("access_token", "");
                window.localStorage.removeItem("UserID");
                window.localStorage.removeItem("UserName");
                window.localStorage.removeItem("UserEmail");
                navigate('/login');
            }
          } catch (error) {
            if(error.response.status === 422){
              setMessage(error.response.data.message);
            }
            else{
              setMessage(error.response.data.error);
            }
            setShowNotification(true);
          }
      };

      const deleteAddress = async (addressId) => {
        try {
          const response =  await axios.put(
            `http://localhost:8000/api/addresses/deactivate/${addressId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${cookies.access_token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
          setMessage(response.data.message);
          setShowNotification(true);
          fetchAddresses();
        } catch (error) {
          console.error("Error Deleting Address", error);
        }
      };

      const addAddress = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.post(`http://localhost:8000/api/addresses`,
          {
            ...newAddress,
          },
            {
              headers: {
                Authorization: `Bearer ${cookies.access_token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
          setMessage(response.data.message);
          setShowNotification(true);
          fetchAddresses();
        } catch (error) {
          console.error(error.response.data);
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
        {showNotification && (
        <Notification message={message} onClose={closeNotification} />
        )}
        <Header/>
        <div className="account_wrapper">

                <div className="account_name">{localStorage.getItem('UserName')}</div>
                <div className="account_email">Email : {localStorage.getItem('UserEmail')}</div>
                <div className="account_password">
                    <div>
                        <button id="password" onClick={openPassword}>Password</button>
                    </div>
                    {
                    showPassword && (
                        <div className="password_input">
                        <input type="password" onChange={e => setcurrentPassword(e.target.value)} value={currentPassword} placeholder="Current Password" required/>
                        <input type="password" onChange={e => setnewPassword(e.target.value)} value={newPassword} placeholder="New Password" required/>
                        <button className="submit_button" onClick={changePassword}>Submit</button>
                        <button className="close_password" onClick={closePassword}>Close</button>
                        </div>
                    )
                    }
                </div>

                <div className="account_addresses">
                    <div>
                        <button id="address" onClick={openAddress}>Addresses</button>
                    </div>
                    {
                        showAddress && (<>
                    <div className="address_input">
                    <form onSubmit={addAddress}>
                    <input type="text" name="name" value={newAddress.name} onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })} placeholder="Name" required />
                    <input type="text" name="surname" value={newAddress.surname} onChange={(e) => setNewAddress({ ...newAddress, surname: e.target.value })} placeholder="Surname" required />
                    <input type="text" name="address" value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} placeholder="Address" required />
                    <input type="text" name="more_info" value={newAddress.more_info} onChange={(e) => setNewAddress({ ...newAddress, more_info: e.target.value })} placeholder="More Info" required />
                    <input type="text" name="district" value={newAddress.district} onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })} placeholder="District" required />
                    <input type="text" name="locality" value={newAddress.locality} onChange={(e) => setNewAddress({ ...newAddress, locality: e.target.value })} placeholder="Locality" required />
                    <input type="text" name="phone" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} placeholder="Phone" required />
                    <button className="submit_button">New Address</button>
                    <button className="close_address" onClick={closeAddress}>
                        Close
                    </button>
                    </form>
                    </div>
                           <div className="all_addresses">  
                                {addresses.filter(address => address.isDeleted === 0).map(address => (
                                    <li key={address.id}>
                                    {address.name} {address.surname} - 
                                    {address.address} - {address.more_info} -
                                    {address.district} / {address.locality} - 
                                    {address.phone}
                                        <button  onClick={() => deleteAddress(address.id)}>Delete</button>
                                    </li>
                                ))}
                            </div>
                        </>
                    )}
                </div>
        </div>
        </>
    );
}

export default Account;