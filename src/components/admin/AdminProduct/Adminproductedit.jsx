import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { useParams} from 'react-router-dom';
import Adminheader from "../AdminHeader/Adminheader";

function Adminproductedit(){

    document.title = "Update Product";
    const [cookies] = useCookies("access_token");
    const { id } = useParams();
    const [product,setProduct] = useState([]);
    const [subcategories,setSubcategories] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [messageType, setMessageType] = useState("success");
    const [message, setMessage] = useState("");
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({
      name: "",
      description: "",
      code: "",
      quantity: "",
      price: "",
      sub_category_id: ""
  });

    const fetchProduct = async () => {
        try {
          const response =  await axios.get(
            `http://localhost:8000/api/products/${id}`,
            {},
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
          const product = response.data.product;
            setFormData({
                name: product.name,
                description: product.description,
                code: product.code,
                quantity: product.quantity,
                price: product.price,
                sub_category_id: product.sub_category_id
            });
            setProduct(response.data.product);
        } catch (error) {
          console.error("Error Fetching Product", error);
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

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const updateProduct = async (event) => {
      event.preventDefault();
      try {
          const response = await axios.put(
              `http://localhost:8000/api/products/${product.id}`,
              formData,
              {
                  headers: {
                      Authorization: `Bearer ${cookies.access_token}`,
                      Accept: "application/json",
                      "Content-Type": "application/json",
                  },
              }
          );
          fetchProduct();
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

      const uploadImage = async () => {
        try {

            const formData = new FormData();
            formData.append('image', image);
            formData.append('imageable_id', product.id);
            formData.append('imageable_type', 'App\\Models\\Product');

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
            fetchProduct();
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
            fetchProduct();
        } catch (error) {
            console.error("Error Deleting Image", error);
        }
    };

    const handleImageChange = (event) => {
      setImage(event.target.files[0]);
    };

    useEffect(() => {
        fetchProduct();
        fetchSubcategories();
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
                <h2 className="text-center">Update Product</h2>
                <form onSubmit={updateProduct}>

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

                <label htmlFor="sub_category_id" className="form-label mt-3"><b>Product Subcategory:</b></label><br/>
                    <select 
                    name="sub_category_id" 
                    className="form-select" 
                    value={formData.sub_category_id}
                    onChange={handleInputChange}
                    required >
                    {subcategories.map( subcategory=> (
                        <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                    ))}
                    </select>
                    
                <div className="d-grid pt-3">
                    <button type="submit" className="btn btn-success btn-lg">Save</button>
                </div>

                </form>
              </div>

              <div className="border border-dark border-3 p-3 m-3">

                <h3 className="text-center">Add Image for Product</h3>

                <div className="d-grid">
                    <label htmlFor="image" className="form-label"><b>Choose an image:</b></label>
                    <input type="file" name="image" className="form-control" required accept="image/*" onChange={handleImageChange}/>
                    <button onClick={uploadImage} className="btn btn-success btn-lg mt-3">Upload</button>
                </div>

                <h3 className="text-center pt-3">All Images</h3>

                {product.images && product.images.length > 0 ?
                 (
                    <div className="row">
                    {product.images.map(image => (
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
export default Adminproductedit;