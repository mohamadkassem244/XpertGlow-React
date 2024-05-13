import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { useLocation } from 'react-router-dom';
import Header from "../Header/Header";
import Cards from "../Cards/Cards";
import './Search.css';

function Search(){

    const [searchResults, setSearchResults] = useState([]);
    const [cookies] = useCookies("access_token");
    const [favorites, setFavorites] = useState([]);
    const location = useLocation();

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

      useEffect(() => {
        const fetchData = async () => {

          try {
            const searchParams = new URLSearchParams(location.search);
            const query = searchParams.get('query') || '';
            const response = await axios.get('http://localhost:8000/api/search', {
              params: { q: query },
            });
            setSearchResults(response.data.products);
          } catch (error) {
            console.error('Error fetching Products:', error);
          } 
        };
    
        fetchData();
      }, [location.search]);

    return(
        <>
         <Header/>
         {
            searchResults && favorites && searchResults.length > 0 && (
            <div style={{ marginTop: "70px" }}>
            <Cards products={searchResults} favorites={favorites} />
            </div>)
        }
        </>
    );
}
export default Search;