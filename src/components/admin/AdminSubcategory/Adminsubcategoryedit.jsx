import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { useParams} from 'react-router-dom';
import Adminheader from "../AdminHeader/Adminheader";

function Adminsubcategoryedit(){

    document.title = "Update Subcategory";
    const [cookies] = useCookies("access_token");
    const { id } = useParams();
    const [subcategory,setSubcategory] = useState([]);
    const [categories,setCategories] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [messageType, setMessageType] = useState("success");
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        category_id: ""
    });

    const fetchSubcategory = async () => {
        try {
          const response =  await axios.get(
            `http://localhost:8000/api/subcategories/${id}`,
            {},
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
          const subcategory = response.data.subcategory;
            setFormData({
                name: subcategory.name,
                category_id: subcategory.category_id
            });
            setSubcategory(response.data.subcategory);
        } catch (error) {
          console.error("Error Fetching Subcategory", error);
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

      const updateSubcategory = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(
                `http://localhost:8000/api/subcategories/${subcategory.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${cookies.access_token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );
            fetchSubcategory();
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

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const uploadImage = async () => {
        try {
            const formData = new FormData();
            formData.append('image', image);
            formData.append('imageable_id', subcategory.id);
            formData.append('imageable_type', 'App\\Models\\SubCategory');

            const response = await axios.post(
                `http://localhost:8000/api/images`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${cookies.access_token}`,
                        Accept: "application/json",
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setMessage(response.data.message);
            setShowNotification(true);
            fetchSubcategory();
        } catch (error) {
            console.error("Error Uploading Image", error);
        }
      };

    const deleteImage = async (imageId) => {
        try {
            const response = await axios.delete(
            `http://localhost:8000/api/images/${imageId}`,
            {
                headers: {
                    Authorization: `Bearer ${cookies.access_token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
            );
            setMessage(response.data.message);
            setShowNotification(true);
            fetchSubcategory();
        } catch (error) {
            console.error("Error Deleting Image", error);
        }
    };
  

    useEffect(() => {
        fetchSubcategory();
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
                <h2 className="text-center">Update Subcategory</h2>

                <form onSubmit={updateSubcategory}>

                <label htmlFor="name" className="form-label mt-3"><b>Subcategory Name:</b></label><br/> 
                    <input 
                    type="text" 
                    className="form-control" 
                    name="name"  
                    value={formData.name}
                    onChange={handleInputChange}
                    required/>
                
                <label htmlFor="category_id" className="form-label mt-3"><b>Subcategory Category:</b></label><br/>
                    <select 
                    name="category_id" 
                    className="form-select" 
                    value={formData.category_id}
                    onChange={handleInputChange}
                    required >
                    {categories.map( category=> (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                    </select>
                    
                <div className="d-grid pt-3">
                    <button type="submit" className="btn btn-success btn-lg">Save</button>
                </div>

                </form>
              </div>

              <div className="border border-dark border-3 p-3 m-3">
                <h3 className="text-center">Add Image for Subcategory</h3>
                <div className="d-grid">
                    <label htmlFor="image" className="form-label"><b>Choose an image:</b></label>
                    <input type="file" name="image" className="form-control" required accept="image/*" onChange={handleImageChange}/>
                    <button onClick={uploadImage} className="btn btn-success btn-lg mt-3">Upload</button>
                </div>

                <h3 className="text-center pt-3">All Images</h3>

                {subcategory.images && subcategory.images.length > 0 ?
                 (
                    <div className="row">
                    {subcategory.images.map(image => (
                        <div key={image.id} className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3 p-3">
                            <div className="card bg-dark text-bg-danger">
                                <img className="card-img-top" src='#' alt="Card image" />
                                <div className="card-body">
                                    <p><b>Image ID : </b>{image.id}</p>
                                    <div className="d-grid gap-2">          
                                        <button onClick={() => deleteImage(image.id)} className="btn btn-danger">Delete</button>
                                    </div> 
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                 )
                 :
                 (<h3 className="text-center pt-3">No Images for this Category</h3>)
                 }
            </div>
        </div>
        </>
    );
}
export default Adminsubcategoryedit;