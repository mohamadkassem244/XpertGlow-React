import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from "../Header/Header";
import Cards from "../Cards/Cards";
import './Subcategory.css';
import '../Utilities/No_results.css';

function Subcategory(){

    const { id } = useParams();
    const [subcategory, setSubcategory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSubcategory = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/subcategories/${id}`);
          document.title = response.data.subcategory.name;
          setSubcategory(response.data.subcategory);
          setLoading(false);
          console.log(response.data.subcategory.products);
        } catch (error) {
          setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubcategory();
      }, [id]);

    if (loading) return <div>Loading...</div>;
    return(
        <>
        <Header/>
        {Object.keys(subcategory).length > 0 ?
        <div style={{ marginTop: "70px" }}>
            {Object.keys(subcategory.products).length > 0 ? 
              <Cards products={subcategory.products}/>
              :
              <div className="no_results">
                        <div className="no_results_i"><i className="fa-solid fa-ban"></i></div>
                        <div className="no_results_text">No Products found for {subcategory.name}</div>
              </div> 
            }
        </div>
        :
        <div className="no_results">
            <div className="no_results_i"><i className="fa-solid fa-ban"></i></div>
            <div className="no_results_text">This Subcategory Not found</div>
        </div> 
        }
        </>
    );
}
export default Subcategory;
