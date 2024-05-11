import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [ _ , setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  
  const handleSubmit = (event) => {
    event.preventDefault();

    const credentials = {
      email: email,
      password: password
    };

    axios.post('http://localhost:8000/api/login', credentials)
      .then(response => {
        console.log('Login successful');
        if (response.data.user.isAdmin==true) {
          setCookies("access_token" , response.data.token);
          window.localStorage.setItem("UserID" , response.data.user.id);
          navigate('/admin');
        } 
        else if(response.data.user.isAdmin==false) {
          setCookies("access_token" , response.data.token);
          window.localStorage.setItem("UserID" , response.data.user.id);
          navigate('/user');
        }
      })
      .catch(error => {
        console.error('Login failed: ', error);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="form_wrapper">
      <div className="form_container">
        <h1>XpertGlow</h1>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form_item">
            <div className="form_item_i">
              <i className="fa-solid fa-envelope"></i>
            </div>
            <input id="email" type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
          </div>
          <div className="form_item">
            <div className="form_item_i">
              <i className="fa-solid fa-lock"></i>
            </div>
            <input id="password" type={showPassword ? 'text' : 'password'} name="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
            <button className="show_password" type="button" onClick={togglePasswordVisibility}>
              <i className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
            </button>
          </div>
          <input type="submit" value="Login" />
          <a href="/register">New Customer?Create your account</a>
        </form>
      </div>
    </div>
  );
}

export default Login;
