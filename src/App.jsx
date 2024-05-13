import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './components/auth/Login/Login';
import Register from './components/auth/Register/Register';
import Admin from './components/admin/Admin';
import Home from './components/user/Home/Home';
import Favorite from './components/user/Favorite/Favorite';
import Cart from './components/user/Cart/Cart';
import Product from './components/user/Product/Product';
import Subcategory from './components/user/Subcategory/Subcategory';
import Account from './components/user/Account/Account';
import Order from './components/user/Order/Order';
import Vieworder from './components/user/Vieworder/Vieworder';
import Search from './components/user/Search/Search';


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
        <Route path="/search" element={<Search />} />
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/account" element={<Account/>}/>
        <Route path="/order" element={<Order/>}/>
        <Route path="/order/view/:id" element={<Vieworder/>}/>
        <Route path="/admin" element={<Admin/>}/>
      </Routes>
    </Router>
  );
}


export default App;
