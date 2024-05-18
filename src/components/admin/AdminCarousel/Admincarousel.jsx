import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import Adminheader from "../AdminHeader/Adminheader";

function Admincarousel() {
  document.title = "Manage Carousels";
  const [cookies] = useCookies(["access_token"]);
  const [carousels, setCarousels] = useState([]);
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [messageType, setMessageType] = useState("success");
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    carouselable_type: "",
    carouselable_id: "",
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const fetchCarousels = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/carousels`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      setCarousels(response.data.carousels.reverse());
    } catch (error) {
      console.error("Error Fetching Carousels", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/products`,
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

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/subcategories`,
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

  const handleFormSubmit = async (e, type, carouselableType) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append("carouselable_type", carouselableType);
    formDataObj.append("carouselable_id", formData.carouselable_id);
    formDataObj.append("image", formData.image);

    try {
      await axios.post(`http://localhost:8000/api/carousels`, formDataObj, {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      setMessageType("success");
      setMessage(`${type} Carousel created successfully.`);
      setShowNotification(true);
      fetchCarousels();
    } catch (error) {
      setMessageType("danger");
      setMessage(`Error creating ${type} Carousel.`);
      setShowNotification(true);
      console.error(`Error creating ${type} Carousel`, error);
    }
  };

  const deleteCarousel = async (carouselId) => {
    try {
        const response = await axios.delete(
        `http://localhost:8000/api/carousels/${carouselId}`,
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
        fetchCarousels();
    } catch (error) {
        console.error("Error Deleting Carousel", error);
    }
};

  useEffect(() => {
    fetchCarousels();
    fetchProducts();
    fetchSubcategories();
  }, []);

  return (
    <>
      <Adminheader />
      <div className="container">
        {showNotification && (
          <div
            className={`alert alert-${messageType} alert-dismissible fade show m-3`}
            role="alert"
          >
            <strong>{message}</strong>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
            ></button>
          </div>
        )}

        <div className="border border-dark border-3 p-3 m-3">
          <form
            className="border border-dark border-2 p-3 m-3"
            onSubmit={(e) => handleFormSubmit(e, "Product", "App\\Models\\Product")}
          >
            <h3 className="text-center">Product Carousel</h3>

            <div className="d-grid">
              <label htmlFor="product" className="form-label mt-3">
                <b>Product Carousel:</b>
              </label>

              <select
                name="carouselable_id"
                className="form-select"
                required
                onChange={handleInputChange}
              >
                <option value="" disabled selected>
                  Select a Product
                </option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>

              <label htmlFor="image" className="form-label mt-3">
                <b>Choose an image:</b>
              </label>
              <input
                type="file"
                name="image"
                className="form-control"
                required
                accept="image/*"
                onChange={handleInputChange}
              />
              <input
                className="btn btn-success btn-lg mt-3"
                type="submit"
                value="Create"
              />
            </div>
          </form>

          <form
            className="border border-dark border-2 p-3 m-3"
            onSubmit={(e) => handleFormSubmit(e, "Subcategory", "App\\Models\\SubCategory")}
          >
            <div className="d-grid">
              <label htmlFor="subcategory" className="form-label mt-3">
                <b>Subcategory Carousel:</b>
              </label>
              <select
                name="carouselable_id"
                className="form-select"
                required
                onChange={handleInputChange}
              >
                <option value="" disabled selected>
                  Select a Subcategory
                </option>
                {subcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
              <label htmlFor="image" className="form-label mt-3">
                <b>Choose an image:</b>
              </label>
              <input
                type="file"
                name="image"
                className="form-control"
                required
                accept="image/*"
                onChange={handleInputChange}
              />
              <input
                className="btn btn-success btn-lg mt-3"
                type="submit"
                value="Create"
              />
            </div>
          </form>
        </div>

        <div className="border border-dark border-3 p-3 m-3">
        <h2 className="text-center">All Carousels</h2>
        <div className="row">
  
        {carousels.map(carousel => (
          <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3 p-3">
                    <div className="card bg-dark text-bg-danger"> 
                        <img className="card-img-top" src="" alt="Card image"/>
                        <div className="card-body">
                            <h4 className="card-title"><b>Carousel ID : </b>{carousel.id}</h4>
                            <div className="d-grid gap-2">
                                <button onClick={() => deleteCarousel(carousel.id)} className="btn btn-danger">Delete</button>
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

export default Admincarousel;
