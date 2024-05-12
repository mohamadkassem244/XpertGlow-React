import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './components/auth/Login/Login';
import Register from './components/auth/Register/Register';
import User from './components/user/User';
import Admin from './components/admin/Admin';
import Home from './components/user/Home/Home';
import Favorite from './components/user/Favorite/Favorite';
import Cart from './components/user/Cart/Cart';
import Product from './components/user/Product/Product';
import Subcategory from './components/user/Subcategory/Subcategory';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" index element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/favorite" element={<Favorite/>}/>
        <Route path="/product/:id" element={<Product/>}/>
        <Route path="/subcategory/:id" element={<Subcategory/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/user" element={<User/>}/>
      </Routes>
    </Router>
  );
}


export default App;
