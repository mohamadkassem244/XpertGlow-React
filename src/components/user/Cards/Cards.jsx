import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import './Cards.css';
import { Link } from 'react-router-dom';

function Cards({ products, favorites }){

    const [cookies] = useCookies(["access_token"]);

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

    return(
        <>
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
                            <img src={require(`../../../images/products/${product.images[0].path}`)} />
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