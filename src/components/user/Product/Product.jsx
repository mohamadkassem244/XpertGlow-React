import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useCookies } from "react-cookie";
import Header from '../Header/Header';
import './Product.css';

function Product(){

    const { id } = useParams();
    const [product, setProduct] = useState([]);
    const [mainImage, setMainImage] = useState('');
    const [quantity, setQuantity] = useState(1);

    const fetchProduct = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/products/${id}`);
          setProduct(response.data.product);
          setMainImage(response.data.product.images[0].path);
        } catch (error) {
          console.error('Error fetching Product:', error);
        }
    };

      useEffect(() => {
        fetchProduct();
      }, [id]);

    const handleImageChange = (imagePath) => {
        setMainImage(imagePath);
    };

    const increaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prevQuantity => prevQuantity - 1);
        }
    };

    return(
        <>
        <Header/>
            <div class="product_wrapper">

                <div class="add_to_favorite" data-id="">
                    <button class="favorite_button" data-in-favorites="">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                </div>

                <div class="images_container">
                    <div class="image_display_container">
                        <div class="image_display">
                        {product.images && product.images.length > 0 &&
                        <img id="main_image" src={require(`../../../images/products/${mainImage}`)} alt="Main Image" />
                        }
                        </div>
                    </div>
                    <div className="image_select">
                        {product.images && product.images.map(image => (
                        <button key={image.id} onClick={() => handleImageChange(image.path)}>
                        <img src={require(`../../../images/products/${image.path}`)} alt="Thumbnail Image" />
                        </button>
                        ))}
                    </div>
                </div>

                <div class="content_container">
                    <div class="content_top">
                        <div class="top_name">{product.name}</div>
                        <div class="top_price">${product.price}</div>
                        <div class="middle_description">{product.description}</div>
                    </div>
                    <div class="content_input">
                        <div class="input_container">
                            <button id="decrease" onClick={decreaseQuantity}>-</button>
                            <input type="number" id="quantity" value={quantity} min="1" readonly/>
                            <button id="increase" onClick={increaseQuantity}>+</button>
                        </div>
                        <button id="addToCart" data-id="{{ $product->id }}">Add to Cart</button>
                    </div>
                </div>
        </div>
        </>
    );
}
export default Product;
