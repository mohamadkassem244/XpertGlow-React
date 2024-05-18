import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './components/auth/Login/Login';
import Register from './components/auth/Register/Register';
import Home from './components/user/Home/Home';
import Favorite from './components/user/Favorite/Favorite';
import Cart from './components/user/Cart/Cart';
import Product from './components/user/Product/Product';
import Subcategory from './components/user/Subcategory/Subcategory';
import Account from './components/user/Account/Account';
import Order from './components/user/Order/Order';
import Vieworder from './components/user/Vieworder/Vieworder';
import Search from './components/user/Search/Search';
import Adminhome from './components/admin/AdminHome/Adminhome';
import Adminuser from './components/admin/AdminUser/Adminuser';
import Admincategory from './components/admin/AdminCategory/Admincategory';
import Admincategoryedit from './components/admin/AdminCategory/Admincategoryedit';
import Adminproduct from './components/admin/AdminProduct/Adminproduct';
import Adminproductedit from './components/admin/AdminProduct/Adminproductedit';
import Adminsubcategory from './components/admin/AdminSubcategory/Adminsubcategory';
import Adminsubcategoryedit from './components/admin/AdminSubcategory/Adminsubcategoryedit';
import Admincarousel from './components/admin/AdminCarousel/Admincarousel';
import Adminorder from './components/admin/AdminOrder/Adminorder';
import Adminorderedit from './components/admin/AdminOrder/Adminorderedit';

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
        <Route path="/admin" element={<Adminhome/>}/>
        <Route path="/admin/user" element={<Adminuser/>}/>
        <Route path="/admin/category" element={<Admincategory/>}/>
        <Route path="/admin/category/:id" element={<Admincategoryedit/>}/>
        <Route path="/admin/subcategory" element={<Adminsubcategory/>}/>
        <Route path="/admin/subcategory/:id" element={<Adminsubcategoryedit/>}/>
        <Route path="/admin/product" element={<Adminproduct/>}/>
        <Route path="/admin/product/:id" element={<Adminproductedit/>}/>
        <Route path="/admin/carousel" element={<Admincarousel/>}/>
        <Route path="/admin/order" element={<Adminorder/>}/>
        <Route path="/admin/order/:id" element={<Adminorderedit/>}/>
      </Routes>
    </Router>
  );
}
export default App;
