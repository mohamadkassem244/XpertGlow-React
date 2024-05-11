import Header from '../Header/Header';
import './Product.css';

function Product(){
    return(
        <>
        <Header/>
            <div class="product_wrapper">

                <div class="add_to_favorite" data-id="{{ $product->id }}">
                    <button class="favorite_button" data-in-favorites="{{ $isFavorited===true ? 'true' : 'false' }}">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                </div>

                <div class="images_container">
                    <div class="image_display_container">
                        <div class="image_display">
                                <img id="main_image" src="{{ asset('storage/images/products/' . $images->first()->path) }}" alt="Product Image"/>
                        </div>
                    </div>
                    <div class="image_select">
                            <button data-src="{{ asset('storage/images/products/' . $image->path) }}">
                                <img src="{{ asset('storage/images/products/' . $image->path) }}" alt="Thumbnail Image"/>
                            </button>
                    </div>
                </div>

                <div class="content_container">
                    <div class="content_top">
                        <div class="top_name"></div>
                        <div class="top_price">$</div>
                        <div class="middle_description"></div>
                    </div>
                    <div class="content_input">
                        <div class="input_container">
                            <button id="decrease">-</button>
                            <input type="number" id="quantity" value="1" min="1" readonly/>
                            <button id="increase">+</button>
                        </div>
                        <button id="addToCart" data-id="{{ $product->id }}">Add to Cart</button>
                    </div>
                </div>
        </div>
        
        </>
    );
}
export default Product;
