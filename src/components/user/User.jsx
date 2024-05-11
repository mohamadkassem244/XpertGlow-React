import React from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';

function User() {

    const[cookies , setCookies] = useCookies("access_token");
    const navigate = useNavigate();

    const removeCookies = async () =>{
      try {
        const response = await axios.post('http://localhost:8000/api/logout', {}, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies.access_token}`
          }
        });

        if (response.status === 200) {
          setCookies("access_token", "");
          window.localStorage.removeItem("UserID");
          navigate('/');
        } else {
          console.error('Logout request failed');
        }
      } catch (error) {
        console.error('Network error', error);
      }
    }

    return (
      <>
      User Page
      {
        cookies.access_token
        ?<button onClick={removeCookies}>Logout</button>
        :navigate('/')
      }
    </>
    );
  }
  
export default User;