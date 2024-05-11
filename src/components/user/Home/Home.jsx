import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import Carousel from "../Carousel/Carousel";
import Header from "../Header/Header";
import Cards from "../Cards/Cards";
import './Home.css';

function Home(){

    const [cookies] = useCookies("access_token");
    const [products, setProducts] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchProducts = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/products');
          const reversedProducts = response.data.products.slice(-8).reverse();
          setProducts(reversedProducts);
          setLoading(false);
        } catch (error) {
          setLoading(false);
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
        fetchProducts();
        fetchFavorites();
      }, []);

    if (loading) return <div>Loading...</div>;

    return(
        <>
        <Header/>
        <Carousel/>
        <div className="new_arrivals_text">New Arrivals</div>
        <Cards products={products} favorites={favorites}/>
        </>
    );
}
export default Home;
