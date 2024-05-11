import './Cards.css';
import { Link } from 'react-router-dom';

function Cards({ products, favorites }){
    return(
        <>
            <div className="products_container">
                {products.map(product => (
                    <div key={product.id} className="product_item">
                    <div className="add_to_favorite" data-id={product.id}>
                        <button className="favorite_button" >
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