import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { Link} from 'react-router-dom';
import Adminheader from "../AdminHeader/Adminheader";

function Adminsubcategory(){

    document.title = "Manage Subcategories";
    const [cookies] = useCookies("access_token");
    const [subcategories,setSubcategories] = useState([]);
    const [categories,setCategories] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [messageType, setMessageType] = useState("success");
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        category_id: ""
    });

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
          setSubcategories(response.data.subcategories.reverse());
        } catch (error) {
          console.error("Error Fetching Subcategories", error);
        }
    };

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                `http://localhost:8000/api/subcategories`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${cookies.access_token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );
            fetchSubcategories();
            setMessage(response.data.message);
            setShowNotification(true);
        } catch (error) {
            console.error("Error Creating Subcategory", error);
        }
    };

    const deleteSubcategory = async (subcategoryId) => {
        try {
            const response = await axios.delete(
            `http://localhost:8000/api/subcategories/${subcategoryId}`,
            {
                headers: {
                    Authorization: `Bearer ${cookies.access_token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
            );
            fetchSubcategories();
            setMessage(response.data.message);
            setShowNotification(true);
        } catch (error) {
            console.error("Error Deleting Subcategory", error);
        }
    };

    useEffect(() => {
        fetchSubcategories();
        fetchCategories();
     }, []);

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
                <h2 className="text-center">New Subcategory</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name" className="form-label mt-3"><b>Subcategory Name:</b></label><br/>
                    <input type="text" className="form-control" name="name"  required
                        value={formData.name}
                        onChange={handleInputChange}
                    />

                    <label htmlFor="category_id" className="form-label mt-3"><b>Subcategory Category:</b></label><br/>
                    <select 
                    name="category_id" 
                    className="form-select" 
                    value={formData.category_id}
                    onChange={handleInputChange}
                    required >
                    <option value="" disabled>Select an Category</option>
                    {categories.map( category=> (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                    </select>
                    
                    <div className="d-grid pt-3">
                        <button type="submit" className="btn btn-success btn-lg">Create</button>
                    </div>
                </form>
            </div>

            <div className="border border-dark border-3 p-3 m-3">
                <h2 className="text-center">All Subcategories</h2>
                <div className="row">
                    {subcategories.map(subcategory => (
                        <div key={subcategory.id} className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3 p-3">
                            <div className="card bg-dark text-bg-danger">                         
                                <img className="card-img-top" src="" alt="Card image"/>
                                <div className="card-body">
                                    <h4 className="card-title"><b>Subcategory ID : </b>{subcategory.id}</h4>
                                    <p><b>Name : </b>{subcategory.name}</p>
                                    <div className="d-grid gap-2">
                                        <Link to={`/admin/subcategory/${subcategory.id}`} className="d-grid gap-2 btn btn-primary">Update</Link>
                                        <button onClick={() => deleteSubcategory(subcategory.id)} className="btn btn-danger">Delete</button>
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
export default Adminsubcategory;