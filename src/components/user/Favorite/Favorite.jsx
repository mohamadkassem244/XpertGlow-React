import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { useNavigate ,Link} from 'react-router-dom';
import Header from "../Header/Header";
import './Favorite.css';
import '../Utilities/No_results.css';

function Favorite(){
    document.title = "Your Favorite(s)";
    const [cookies] = useCookies("access_token");
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();

    const addToFavoritesToggle = (productId) => {
        addToFavorites(productId);
    };

    const addToFavorites = async (productId) => {
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
    };
    
    const fetchFavorites = async () => {
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
    };

    useEffect(() => {
      if (!cookies.access_token) {
        navigate('/');
      }
    }, [cookies.access_token]);
    
    useEffect(() => {
        fetchFavorites();
    }, []);

    return(
        <>
        <Header/>
        {Object.keys(favorites).length > 0 ?
        <div className="products_container" style={{marginTop: "70px"}}>
        {favorites.map(favorite => (
            <div key={favorite.product.id} className="product_item">
                <div className="add_to_favorite">
                    <button className="favorite_button" onClick={() => addToFavoritesToggle(favorite.product.id)}>
                        <i className= "fa-solid fa-heart"></i>
                    </button>
                </div>
                <div className="item_top">
                    <Link to={`/product/${favorite.product.id}`}>
                            {favorite.product.images && favorite.product.images.length > 0 ? (
                                <img src={require(`../../../images/products/${favorite.product.images[0].path}`)} alt={favorite.product.name} />
                            ) : (
                              <img src="" alt="No Image" />
                            )}
                    </Link>
                </div>
                <div className="item_bottom">
                    <div className="item_name">
                        <a href="#">{favorite.product.name}</a>
                    </div>
                    <div className="item_price">$ {favorite.product.price}</div>
                </div>
            </div>
        ))}
        </div>
        :
        <div className="no_results">
            <div className="no_results_i"><i className="fa-solid fa-heart-crack"></i></div>
            <div className="no_results_text">Your Favorites is Empty</div>
        </div> 
        }
        </>
    );
}

export default Favorite;
