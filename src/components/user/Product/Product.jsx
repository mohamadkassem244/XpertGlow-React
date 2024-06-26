import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { useParams ,useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import Header from '../Header/Header';
import './Product.css';
import '../Utilities/No_results.css';
import Notification from '../Notification/Notification';

function Product(){

    const [cookies] = useCookies(["access_token"]);
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState([]);
    const [mainImage, setMainImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState("");

    const closeNotification = () => {
      setShowNotification(false);
  };

    const fetchProduct = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/products/${id}`);
          document.title = response.data.product.name;
          setProduct(response.data.product);
          setMainImage(response.data.product.images[0].path);
        } catch (error) {
          console.error('Error fetching Product:', error);
        }
    };

    const handleImageChange = (imagePath) => {
        setMainImage(imagePath);
    };

    const increaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prevQuantity => prevQuantity - 1);
        }
    };

    const addToCart = async () => {
        if (cookies.access_token) {
            try {
                const response = await axios.post(`http://localhost:8000/api/add_to_cart/${id}`, {
                quantity: quantity,
              }, {
                headers: {
                  'Authorization': `Bearer ${cookies.access_token}`,
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                }
              });
              setMessage(response.data.message);
              setShowNotification(true);
            } catch (error) {
              setMessage(error.response.data.error);
              setShowNotification(true);
            }
        }
        else {
            navigate('/login');
        }
    };

    const addToFavoritesToggle = async (productId) => {
        await addToFavorites(productId);
        fetchProduct();
        fetchFavorites();
    };

    const addToFavorites = async (productId) => {
        if (cookies.access_token) {
            try {
                const response = await axios.post(`http://localhost:8000/api/toggle_favorite/${productId}`, null, {
                  headers: {
                      'Authorization': `Bearer ${cookies.access_token}`,
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                    }
                });
              } catch (error) {
                console.error('Error adding to Favorites:', error);
              }
        }
        else{
            navigate('/login');
        }
    };

    const fetchFavorites = async () => {
        if (cookies.access_token) {
          try {
            const response = await axios.get('http://localhost:8000/api/all_favorites', {
              headers: {
                'Authorization': `Bearer ${cookies.access_token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            });
            setFavorites(response.data.favorites);
          } catch (error) {
            console.error('Error fetching favorites:', error);
          }
        } 
      };

    useEffect(() => {
       fetchProduct();
    }, [id]);

    useEffect(() => {
        fetchFavorites();
      }, []);

    return(
        <>
        {showNotification && (
            <Notification message={message} onClose={closeNotification} />
        )}
        <Header/>
        {Object.keys(product).length > 0 ?
        <div className="product_wrapper">

        <div className="add_to_favorite">
            <button className="favorite_button" onClick={() => addToFavoritesToggle(product.id)}>
                <i className= {favorites.find(favorite => favorite.product_id === product.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
            </button>
        </div>

        <div className="images_container">
            <div className="image_display_container">
                <div className="image_display">
                {product.images && product.images.length > 0 &&
                <img id="main_image" src={require(`../../../images/products/${mainImage}`)} alt="Main Image" />
                }
                </div>
            </div>
            <div className="image_select">
                {product.images && product.images.map(image => (
                <button key={image.id} onClick={() => handleImageChange(image.path)}>
                <img src={require(`../../../images/products/${image.path}`)} alt="Thumbnail Image" />
                </button>
                ))}
            </div>
        </div>

        <div className="content_container">
            <div className="content_top">
                <div className="top_name">{product.name}</div>
                <div className="top_price">${product.price}</div>
                <div className="middle_description">{product.description}</div>
            </div>
            <div className="content_input">
                <div className="input_container">
                    <button id="decrease" onClick={decreaseQuantity}>-</button>
                    <input type="number" id="quantity" value={quantity} min="1" readOnly={true}/>
                    <button id="increase" onClick={increaseQuantity}>+</button>
                </div>
                <button id="addToCart" onClick={addToCart}>Add to Cart</button>
            </div>
        </div>
        </div>
        :
        <div className="no_results">
            <div className="no_results_i"><i className="fa-solid fa-ban"></i></div>
            <div className="no_results_text">This Product Not found</div>
        </div> 
        }
        </>
    );
}
export default Product;
