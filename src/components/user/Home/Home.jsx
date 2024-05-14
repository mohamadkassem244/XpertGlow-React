import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Carousel from "../Carousel/Carousel";
import Header from "../Header/Header";
import Cards from "../Cards/Cards";
import './Home.css';

function Home(){
    document.title = "Welcome To XpertGlow";
    const [products, setProducts] = useState([]);
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

    useEffect(() => {
        fetchProducts();
      }, []);

    if (loading) return <div>Loading...</div>;

    return(
        <>
        <Header/>
        <Carousel/>
        <div className="new_arrivals_text">New Arrivals</div>
        <Cards products={products}/>
        </>
    );
}
export default Home;
