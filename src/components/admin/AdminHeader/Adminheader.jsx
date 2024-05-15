import React from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Adminheader(){

    const[cookies , setCookies] = useCookies("access_token");
    const navigate = useNavigate();

    const removeCookies = async () =>{
        try {
          const response = await axios.post('http://localhost:8000/api/logout', {}, {
            headers: {
              Authorization: `Bearer ${cookies.access_token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            }
          });
  
          if (response.status === 200) {
            setCookies("access_token", "");
            window.localStorage.removeItem("UserID");
            window.localStorage.removeItem("UserName");
            window.localStorage.removeItem("UserEmail");
            navigate('/login');
          } else {
            console.error('Logout request failed');
          }
        } catch (error) {
          console.error('Network error', error);
        }
    };

    return(
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="/admin">XpertGlow</a>
          <div>
              <button onClick={removeCookies} className="btn btn-danger">Logout</button>
          </div>
        </div>
      </nav>
    );
}
export default Adminheader;