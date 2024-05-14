import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { useNavigate ,Link} from 'react-router-dom';
import './Header.css';

function Header(){

    const [isLogin, setIsLogin] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isCategoriesOpen, setCategoriesOpen] = useState(false);
    const [isUserOptionsOpen, setUserOptions] = useState(false);
    const [isSearchOpen, setSearchOpen] = useState(false);
    const [isLoginOptionsOpen, setLoginOptionsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openCategory, setOpenCategory] = useState(null);

    const openCategories = () => {setCategoriesOpen(true);setUserOptions(false);};
    const closeCategories = () => {setCategoriesOpen(false);};
    const openUserOptions = () => {setUserOptions(true);setCategoriesOpen(false);};
    const closeUserOptions = () => {setUserOptions(false);};
    const openSearch = () => {setSearchOpen(true);};
    const closeSearch = () => {setSearchOpen(false);};
    const toggleLoginOptions = () => {setLoginOptionsOpen(!isLoginOptionsOpen);};
    const openOneCategory = (category) => {
        setOpenCategory(openCategory === category.id ? null : category.id);
    };

    const[cookies , setCookies] = useCookies("access_token");
    const navigate = useNavigate();
    
    const removeCookies = async () =>{
        try {
          const response = await axios.post('http://localhost:8000/api/logout', {}, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${cookies.access_token}`
            }
          });
  
          if (response.status === 200) {
            setCookies("access_token", "");
            window.localStorage.removeItem("UserID");
            window.localStorage.removeItem("UserName");
            window.localStorage.removeItem("UserEmail");
            navigate('/login');
          } else {
            console.error('Logout request failed');
          }
        } catch (error) {
          console.error('Network error', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/categories');
            setCategories(response.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSearchInputChange = async (e) => {
        const q = e.target.value.trim();
        setSearchQuery(q);
        if (q.length > 0) {
            setSearchResults([]);
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8000/api/search', {
                    params: { q: q }
                });
                setSearchResults(response.data.products);
            } catch (error) {
                console.error('Error fetching Products:', error);
            }
            finally {
                setLoading(false);
            }
        }
        else {
            setSearchResults([]);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery) {
            navigate(`/search?query=${searchQuery}`);
        }
    };

    useEffect(() => {
        fetchCategories();
        if (cookies.access_token) {
            setIsLogin(true);
          } else {
            setIsLogin(false);
        }
      }, []);

      useEffect(() => {
        function check_width_for_search() {
          var width = window.innerWidth;
          if (width > 768) {
            closeSearch();
          }
        }
        check_width_for_search();
        window.addEventListener('resize', check_width_for_search);
        return () => {
          window.removeEventListener('resize', check_width_for_search);
        };
      }, []);

    return(
    <>
    <div className="xpertglow_nav_1">
            <div className={isSearchOpen ? "nav_left close" : "nav_left"}>
                <div className="nav_left_list">
                    <button onClick={openCategories}>
                        <i className="fa-solid fa-bars"></i>
                    </button>
                </div>
                <a href="/" className="nav_left_logo">
                    XpertGlow
                </a>
            </div>

            
            <div className={isSearchOpen ? "nav_mid open" : "nav_mid"}>
                <button className={isSearchOpen ? "close_search block" : "close_search"} onClick={closeSearch}>
                    <i className="fa-solid fa-arrow-right fa-rotate-180"></i>
                </button>

                <div className="search_container">
                    <form onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        id="searchInput"
                        name="query"
                        required
                        placeholder="Search for Products"
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                    />
                    <input type="submit" value="Search" />
                    </form>
             </div>
            
                <div className={searchQuery ? "search_results block" : "search_results"}>
                    <ul id="searchResults">
                        {!loading &&
                           searchResults.map((product) => (
                           <li key={product.id}>
                              <a href={`/product/${product.id}`}>{product.name}</a>
                           </li>
                        ))}
                        {!loading && searchQuery && searchResults.length === 0 && <li>No results found</li>}
                    </ul>
                    {loading && <div className="loader block"><i className="fa-solid fa-spinner"></i></div>}
                </div>
             
            </div>

            <div className={isSearchOpen ? "nav_right close" : "nav_right"}>

                    <button className={isSearchOpen ? "nav_right_search close" : "nav_right_search"} onClick={openSearch}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>

                    {isLogin ? (
                        <>
                        <a href="/favorite">
                        <button className="nav_right_favorite">
                            <i className="fa-solid fa-heart"></i>
                        </button>
                        </a>
                    
                        <a href="/cart">
                        <button className="nav_right_cart">
                            <i className="fa-solid fa-cart-shopping"></i>
                        </button>
                        </a>

                        <button className="nav_right_user" onClick={openUserOptions}>
                        <i className="fa-solid fa-user"></i>
                        </button>
                        </>
                    ):(
                        <button className="nav_right_login" onClick={toggleLoginOptions}>
                            <i className="fa-solid fa-right-to-bracket"></i>
                        </button>
                    )
                    }

                    <div id="login_options" className={isLoginOptionsOpen ? "login_options block" : "login_options"}>
                        <h3>Welcome to XpertGlow</h3>
                        <a href="/login">login</a>
                        <a href="/register">register</a>
                    </div>
          
            </div>
        </div>

        <div id="xpertglow_nav_2" className={isCategoriesOpen ? "xpertglow_nav_2 opennav" : "xpertglow_nav_2"}>
            <div className="close_btn"><button onClick={closeCategories}><i className="fa-solid fa-xmark"></i></button></div>
            <div id="categories_container" className={isCategoriesOpen ? "categories_container block" : "categories_container close"}>
                {categories.map(category => (
                    <div key={category.id} className="category" onClick={() => openOneCategory(category)}>
                    <button>{category.name}<i className={`fa-solid fa-arrow-${openCategory === category.id ? 'up' : 'down'}`}></i></button>
                    {openCategory === category.id && (
                        (category.subcategories.map(subcategory => (
                            <Link key={subcategory.id} to={`/subcategory/${subcategory.id}`} className="sub_category">{subcategory.name}</Link>
                        ))
                        )
                    )}
                    </div>
                ))}
            </div>
        </div>

        <div id="xpertglow_nav_3" className={isUserOptionsOpen ? "xpertglow_nav_3 opennav" : "xpertglow_nav_3"}>
            <div className="close_btn"><button onClick={closeUserOptions}><i className="fa-solid fa-xmark"></i></button></div>
            <div id="user_options_container" className={isUserOptionsOpen ? "user_options_container open" : "user_options_container close"}>
                <a href="/account" className="user_option">
                    <button><i className="fa-solid fa-gears"></i>Account</button>
                </a>
                <a href="/order" className="user_option">
                    <button><i className="fa-solid fa-truck"></i>Orders</button>
                </a>
                <a className="user_option">
                    <button onClick={removeCookies}><i className="fa-solid fa-right-from-bracket"></i>Logout</button>
                </a>
            </div>
        </div>
    </>
    );
}

export default Header;