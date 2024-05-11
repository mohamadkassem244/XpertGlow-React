import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import './Register.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [ _ , setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  
  const handleSubmit = (event) => {
    event.preventDefault();

    const credentials = {
      name : name,
      email: email,
      password: password
    };

    axios.post('http://localhost:8000/api/register', credentials)
      .then(response => {

          console.log('Register successful');
          setCookies("access_token" , response.data.token);
          window.localStorage.setItem("UserID" , response.data.user.id);
          navigate('/user');
        
      })
      .catch(error => {
        console.error('Register failed: ', error);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="form_wrapper">
        <div className="form_container">
            <h1>XpertGlow</h1>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="form_item">
                    <div className="form_item_i">
                        <i className="fa-solid fa-user"></i>
                    </div>
                    <input id="name" type="text" name="name" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required/>
                </div>

                <div className="form_item">
                    <div className="form_item_i">
                        <i className="fa-solid fa-envelope"></i>
                    </div>
                    <input id="email" type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required/>
                </div>
                
                <div className="form_item">
                    <div className="form_item_i">
                        <i className="fa-solid fa-lock"></i>
                    </div>
                    <input id="password" type={showPassword ? 'text' : 'password'} name="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required/>
                    <button className="show_password" type="button" onClick={togglePasswordVisibility}>
                        <i className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
                    </button>
                </div>

                <input type="submit" value="Create Account"/>
                <a href="/login">Already have an account? Login here</a>
            </form>
        </div>
    </div>
  );
}

export default Register;
