import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import Header from "../Header/Header";
import './Favorite.css';

function Favorite(){

    const [cookies] = useCookies("access_token");
    const [favorites, setFavorites] = useState([]);
    
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
        fetchFavorites();
    }, []);

    return(
        <>
        <Header/>
        <div className="products_container" style={{marginTop: "70px"}}>
            {favorites.map(favorite => (
                <div key={favorite.product.id} className="product_item">
                    <div className="add_to_favorite" data-id={favorite.product.id}>
                        <button className="favorite_button" >
                            <i className= "fa-solid fa-heart"></i>
                        </button>
                    </div>
                    <div className="item_top">
                        <a href="#">
                            {favorite.product.images && favorite.product.images.length > 0 &&
                                <img src={require(`../../../images/products/${favorite.product.images[0].path}`)} alt={favorite.product.name} />
                            }
                        </a>
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
        </>
    );
}

export default Favorite;
