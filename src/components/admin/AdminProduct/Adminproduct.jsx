import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { Link} from 'react-router-dom';
import Adminheader from "../AdminHeader/Adminheader";

function Adminproduct(){

    document.title = "Manage Products";
    const [cookies] = useCookies("access_token");
    const [products,setProducts] = useState([]);
    const [subcategories,setSubcategories] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [messageType, setMessageType] = useState("success");
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        code: "",
        quantity: "",
        price: "",
        sub_category_id: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                `http://localhost:8000/api/products`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${cookies.access_token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );
            fetchProducts();
            setMessage(response.data.message);
            setShowNotification(true);
        } catch (error) {
            console.error("Error Creating Product", error);
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
          setProducts(response.data.products.reverse());
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

    const deleteProduct = async (productId) => {
        try {
            const response = await axios.delete(
            `http://localhost:8000/api/products/${productId}`,
            {
                headers: {
                    Authorization: `Bearer ${cookies.access_token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
            );
            fetchProducts();
            setMessage(response.data.message);
            setShowNotification(true);
        } catch (error) {
            console.error("Error Deleting Product", error);
        }
    };

    useEffect(()=>{
        fetchProducts();
        fetchSubcategories();
    } ,[]);

    return(
        <>
        <Adminheader/>
        <div className="container">
            {showNotification && (
                <div className={`alert alert-${messageType} alert-dismissible fade show m-3`} role="alert">
                <strong>{message}</strong>
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            )}

            <div className="border border-dark border-3 p-3 m-3">
                <h2 className="text-center">New Product</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name" className="form-label mt-3"><b>Product Name:</b></label><br/> 
                    <input 
                    type="text" 
                    className="form-control" 
                    name="name"  
                    value={formData.name}
                    onChange={handleInputChange}
                    required/>

                    <label htmlFor="description" className="form-label mt-3"><b>Product Description:</b></label><br/> 
                    <textarea 
                    type="text" 
                    className="form-control" 
                    name="description" 
                    value={formData.description}
                    onChange={handleInputChange}
                    required></textarea>

                    <label htmlFor="code" className="form-label mt-3"><b>Product Code:</b></label><br/> 
                    <input 
                    type="text" 
                    className="form-control" 
                    name="code" 
                    value={formData.code}
                    onChange={handleInputChange}
                    required/>

                    <label htmlFor="quantity" className="form-label mt-3"><b>Product Quantity:</b></label><br/> 
                    <input 
                    type="number" 
                    step="1" 
                    min={0} 
                    className="form-control" 
                    name="quantity" 
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required/>

                    <label htmlFor="price" className="form-label mt-3"><b>Product Price:</b></label><br/> 
                    <input 
                    type="number" 
                    step="0.01" 
                    min={0} 
                    className="form-control" 
                    name="price" 
                    value={formData.price}
                    onChange={handleInputChange}
                    required/>

                    <label htmlFor="subcategory" className="form-label mt-3"><b>Product Subcategory:</b></label><br/>
                    <select 
                    name="sub_category_id" 
                    className="form-select" 
                    value={formData.sub_category_id}
                    onChange={handleInputChange}
                    required >
                    <option value="" disabled>Select an Subcategory</option>
                    {subcategories.map( subcategory=> (
                        <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                    ))}
                    </select>

                    <div className="d-grid mt-3">
                    <button type="submit" className="btn btn-success btn-lg">Create</button>
                    </div>
                </form>
            </div>

            <div className="border border-dark border-3 p-3 m-3">
                <h2 className="text-center">All Products</h2>
                <div className="row">
                    {products.map(product => (
                        <div key={product.id} className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3 p-3">
                            <div className="card bg-dark text-bg-danger">                         
                                <img className="card-img-top" src="" alt="Card image"/>
                                <div className="card-body">
                                <h4 className="card-title"><b>Product ID : </b>{product.id}</h4>
                                <p className="text-nowrap text-truncate"><b>Name : </b>{product.name}</p>
                                <p><b>Code : </b>{product.code}</p>
                                <p><b>Quantity : </b>{product.quantity}</p>
                                    <div className="d-grid gap-2">
                                        <Link to={`/admin/product/${product.id}`} className="d-grid gap-2 btn btn-primary">Update</Link>
                                        <button onClick={() => deleteProduct(product.id)} className="btn btn-danger">Delete</button>
                                    </div> 
                                </div>
                            </div>
                        </div>    
                    ))} 
                </div>
            </div>
        </div>
        </>
    );
}
export default Adminproduct;