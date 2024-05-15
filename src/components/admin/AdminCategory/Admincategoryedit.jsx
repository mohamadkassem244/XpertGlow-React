import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { useParams} from 'react-router-dom';
import Adminheader from "../AdminHeader/Adminheader";

function Admincategoryedit(){
    
    document.title = "Update Category";
    const [cookies] = useCookies("access_token");
    const { id } = useParams();
    const [category,setCategory] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [image, setImage] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [messageType, setMessageType] = useState("success");
    const [message, setMessage] = useState("");

    const fetchCategory = async () => {
        try {
          const response =  await axios.get(
            `http://localhost:8000/api/categories/${id}`,
            {},
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
          setCategory(response.data.category);
          setCategoryName(response.data.category.name);
        } catch (error) {
          console.error("Error Fetching Category", error);
        }
    };

    const updateCategory = async () => {
        try {
            const response = await axios.put(
                `http://localhost:8000/api/categories/${category.id}`,
                { name: categoryName },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.access_token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );
            setCategoryName(response.data.category.name);
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
            fetchCategory();
        } catch (error) {
            console.error("Error Deleting Image", error);
        }
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const uploadImage = async () => {
        try {

            const formData = new FormData();
            formData.append('image', image);
            formData.append('imageable_id', category.id);
            formData.append('imageable_type', 'App\\Models\\Category');

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
            fetchCategory();
        } catch (error) {
            console.error("Error Uploading Image", error);
        }
    };

    useEffect(() => {
        fetchCategory();
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
                <h2 className="text-center">Update Category</h2>
                <div>
                <label htmlFor="name" className="form-label mt-3"><b>Category Name:</b></label><br/>
                <input type="text" className="form-control" name="name" value={categoryName} required
                    onChange={(e) => setCategoryName(e.target.value)}
                />
                <div className="d-grid pt-3">
                    <button onClick={() => updateCategory(category.id)} className="btn btn-success btn-lg">Save</button>
                </div>
                </div>
            </div>

            <div className="border border-dark border-3 p-3 m-3">

                <h3 className="text-center">Add Image for Category</h3>

                <div className="d-grid">
                    <label htmlFor="image" className="form-label"><b>Choose an image:</b></label>
                    <input type="file" name="image" className="form-control" required accept="image/*" onChange={handleImageChange}/>
                    <button onClick={uploadImage} className="btn btn-success btn-lg mt-3">Upload</button>
                </div>

                <h3 className="text-center pt-3">All Images</h3>

                {category.images && category.images.length > 0 ?
                 (
                    <div className="row">
                    {category.images.map(image => (
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
export default Admincategoryedit;