import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { Link} from 'react-router-dom';
import Adminheader from "../AdminHeader/Adminheader";

function Adminhome(){
  
    document.title = "XpertGlow Admin Dashboard";
    const[cookies] = useCookies("access_token");
    const [categories,setCategories] = useState([]);
    const [products,setProducts] = useState([]);
    const [subcategories,setSubcategories] = useState([]);
    const [orders,setOrders] = useState([]);
    const [users,setUsers] = useState([]);
    const [carousels,setCarousels] = useState([]);

    const fetchCategories = async () => {
        try {
          const response =  await axios.get(
            `http://localhost:8000/api/categories`,
            {},
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
          setCategories(response.data.categories);
        } catch (error) {
          console.error("Error Fetching Categories", error);
        }
    };

    const fetchSubcategories = async () => {
        try {
          const response =  await axios.get(
            `http://localhost:8000/api/subcategories`,
            {},
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
          setSubcategories(response.data.subcategories);

        } catch (error) {
          console.error("Error Fetching Subcategories", error);
        }
    };

    const fetchProducts = async () => {
        try {
          const response =  await axios.get(
            `http://localhost:8000/api/products`,
            {},
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
          setProducts(response.data.products);
        } catch (error) {
          console.error("Error Fetching Products", error);
        }
    };

    const fetchOrders = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/orders`,
            {
              headers: {
                Authorization: `Bearer ${cookies.access_token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
          setOrders(response.data.orders); 
        } catch (error) {
          console.error("Error Fetching Orders", error);
        }
    };

    const fetchUsers = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/users`,
            {
              headers: {
                Authorization: `Bearer ${cookies.access_token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
          const users = response.data.users.filter(user => !user.isAdmin);
          setUsers(users);
        } catch (error) {
          console.error("Error Fetching Users", error);
        }
    };

    const fetchCarousels = async () => {
        try {
          const response =  await axios.get(
            `http://localhost:8000/api/carousels`,
            {},
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
          setCarousels(response.data.carousels);
        } catch (error) {
          console.error("Error Fetching Carousels", error);
        }
    };
      

    useEffect(() => {
        fetchCategories();
        fetchSubcategories();
        fetchProducts();
        fetchOrders();
        fetchUsers();
        fetchCarousels();
    }, []);

    return(
        <>
        <Adminheader/>
        <div className="container">

            <h2 className="pt-3">Welcome {localStorage.getItem('UserName')}</h2>
            
            <div className="row">

                <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3 p-3">
                    <div className="card">
                    <div className="card-header text-center"><b>Users</b></div>
                    <div className="card-body text-center text-secondary"><b>Total : {users.length}</b></div>
                    <div className="card-footer d-grid gap-2">
                        <Link to={"/admin/user"} className="btn btn-dark">Manage</Link>
                    </div>
                    </div>
                </div>

                <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3 p-3">
                    <div className="card">
                    <div className="card-header text-center"><b>Categories</b></div>
                    <div className="card-body text-center text-secondary"><b>Total : {categories.length}</b></div>
                    <div className="card-footer d-grid gap-2">
                    <Link to={"/admin/category"} className="btn btn-dark">Manage</Link>
                    </div>
                    </div>
                </div>

                <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3 p-3">
                    <div className="card">
                    <div className="card-header text-center"><b>Subcategories</b></div>
                    <div className="card-body text-center text-secondary"><b>Total : {subcategories.length}</b></div>
                    <div className="card-footer d-grid gap-2">
                    <Link to={"/admin/subcategory"} className="btn btn-dark">Manage</Link>
                    </div>
                    </div>
                </div>

                <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3 p-3">
                    <div className="card">
                    <div className="card-header text-center"><b>Products</b></div>
                    <div className="card-body text-center text-secondary"><b>Total : {products.length}</b></div>
                    <div className="card-footer d-grid gap-2">
                    <Link to={"/admin/product"} className="btn btn-dark">Manage</Link>
                    </div>
                    </div>
                </div>

                <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3 p-3">
                    <div className="card">
                    <div className="card-header text-center"><b>Orders</b></div>
                    <div className="card-body text-center text-secondary"><b>Total : {orders.length}</b></div>
                    <div className="card-footer d-grid gap-2">
                    <Link to={"/admin/order"} className="btn btn-dark">Manage</Link>
                    </div>
                    </div>
                </div>

                <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3 p-3">
                    <div className="card">
                    <div className="card-header text-center"><b>Carousels</b></div>
                    <div className="card-body text-center text-secondary"><b>Total : {carousels.length}</b></div>
                    <div className="card-footer d-grid gap-2">
                    <Link to={"/admin/carousel"} className="btn btn-dark">Manage</Link>
                    </div>
                    </div>
                </div>

                    </div>
        </div>
        </>
    );
}
export default Adminhome;