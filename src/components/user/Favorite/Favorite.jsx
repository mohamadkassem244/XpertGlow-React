import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { useNavigate ,Link} from 'react-router-dom';
import Header from "../Header/Header";
import Cards from "../Cards/Cards";
import './Favorite.css';
import '../Utilities/No_results.css';

function Favorite(){
    document.title = "Your Favorite(s)";
    const [cookies] = useCookies("access_token");
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();

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
         <div style={{ marginTop: "70px" }}>
          <Cards products={favorites.map(favorite => favorite.product)}/>
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
