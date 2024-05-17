import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { Link} from 'react-router-dom';
import Adminheader from "../AdminHeader/Adminheader";

function Admincategory(){

    document.title = "Manage Categories";
    const [cookies] = useCookies("access_token");
    const [categories,setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const [messageType, setMessageType] = useState("success");
    const [message, setMessage] = useState("");

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
          setCategories(response.data.categories.reverse());
        } catch (error) {
          console.error("Error Fetching Categories", error);
        }
    };

    const deleteCategory = async (categoryId) => {
        try {
            const response = await axios.delete(
            `http://localhost:8000/api/categories/${categoryId}`,
            {
                headers: {
                    Authorization: `Bearer ${cookies.access_token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
            );
            fetchCategories();
            setMessage(response.data.message);
            setShowNotification(true);
        } catch (error) {
            console.error("Error Deleting Category", error);
        }
    };

    const createCategory = async () => {
        try {
            const response = await axios.post(
                `http://localhost:8000/api/categories`,
                { name: newCategoryName },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.access_token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );
            fetchCategories();
            setNewCategoryName("");
            setMessage(response.data.message);
            setShowNotification(true);
        } catch (error) {
            if(error.response.status === 400){
                setMessage(error.response.data.errors.name);
                setMessageType("danger");
                setShowNotification(true);
            }
        }
    };

    useEffect(() => {
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
                <h2 className="text-center">New Category</h2>
                <div>
                    <label htmlFor="name" className="form-label mt-3"><b>Category Name:</b></label><br/>
                    <input type="text" className="form-control" name="name" value={newCategoryName} required
                        onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <div className="d-grid pt-3">
                        <button className="btn btn-success btn-lg" onClick={createCategory}>Create</button>
                    </div>
                </div>
            </div>

            <div className="border border-dark border-3 p-3 m-3">
                <h2 className="text-center">All Categories</h2>
                <div className="row">
                    {categories.map(category => (
                        <div key={category.id} className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3 p-3">
                            <div className="card bg-dark text-bg-danger">                         
                                <img className="card-img-top" src="" alt="Card image"/>
                                <div className="card-body">
                                    <h4 className="card-title"><b>Category ID : </b>{category.id}</h4>
                                    <p><b>Name : </b>{category.name}</p>
                                    <div className="d-grid gap-2">
                                        <Link to={`/admin/category/${category.id}`} className="d-grid gap-2 btn btn-primary">Update</Link>
                                        <button onClick={() => deleteCategory(category.id)} className="btn btn-danger">Delete</button>
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
export default Admincategory;