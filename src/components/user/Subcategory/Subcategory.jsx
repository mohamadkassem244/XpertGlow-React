import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useCookies } from "react-cookie";
import Header from "../Header/Header";
import Cards from "../Cards/Cards";
import './Subcategory.css';

function Subcategory(){

    const { id } = useParams();
    const [cookies] = useCookies("access_token");
    const [subcategory, setSubcategory] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchSubcategory = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/subcategories/${id}`);
          setSubcategory(response.data.subcategory);
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
        fetchSubcategory();
        fetchFavorites();
      }, []);

    if (loading) return <div>Loading...</div>;
    return(
        <>
        <Header/>
        <div style={{ marginTop: "70px" }}>
            <Cards products={subcategory.products} favorites={favorites} />
        </div>
        </>
    );
}
export default Subcategory;
