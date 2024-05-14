import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { useNavigate ,Link } from 'react-router-dom';
import './Cards.css';
import Notification from '../Notification/Notification';

function Cards({products}){

    const [cookies] = useCookies(["access_token"]);
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();
    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState("");

    const closeNotification = () => {
        setShowNotification(false);
    };

    const addToFavoritesToggle = async (productId) => {
        await addToFavorites(productId);
        fetchFavorites();
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
                setMessage(response.data.message);
                setShowNotification(true);
              } catch (error) {
                console.error('Error adding to Favorites:', error);
              }
        }
        else{
            navigate('/login');
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    return(
        <>
            {showNotification && (
                <Notification message={message} onClose={closeNotification} />
            )}

            <div className="products_container">
                {products.map(product => (
                    <div key={product.id} className="product_item">
                    <div className="add_to_favorite" >
                        <button className="favorite_button" onClick={() => addToFavoritesToggle(product.id)}>
                        <i className= {favorites.find(favorite => favorite.product_id === product.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                        </button>
                    </div>
                    <div className="item_top">
                            <Link to={`/product/${product.id}`}>
                            {product.images && product.images.length > 0 ? (
                                <img src={require(`../../../images/products/${product.images[0].path}`)} alt={product.name} />
                            ) : (
                                <img src="" alt="No Image" />
                            )}
                            </Link>
                    </div>
                    <div className="item_bottom">
                        <div className="item_name">
                        <Link to={`/product/${product.id}`}>{product.name}</Link>
                        </div>
                        <div className="item_price">$ {product.price}</div>
                    </div>
                    </div>
                ))}
            </div>
        </>
    );
}
export default Cards;