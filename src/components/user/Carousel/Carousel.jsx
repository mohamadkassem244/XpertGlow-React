import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Carousel.css';

function Carousel() {
  const [carousels, setCarousels] = useState([]);
  const [counter, setCounter] = useState(0);
  const intervalTime = 5000;

  useEffect(() => {
    const fetchCarousels = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/carousels');
        setCarousels(response.data.carousels);
      } catch (error) {
        console.error('Error fetching carousels:', error);
      }
    };

    fetchCarousels();
  }, []);

  useEffect(() => {
        const slideInterval = setInterval(() => {
        setCounter((prevCounter) => (prevCounter + 1) % carousels.length);
        }, intervalTime);

        return () => clearInterval(slideInterval);
  }, [intervalTime, carousels.length]);

  const showNextSlide = () => {
    setCounter((prevCounter) => (prevCounter + 1) % carousels.length);
  };

  const showPrevSlide = () => {
    setCounter((prevCounter) => (prevCounter === 0 ? carousels.length - 1 : prevCounter - 1));
  };

  return (
    <div className="carousel_container">
      <button id="prevBtn" className="prevButton" onClick={showPrevSlide}>
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      <div className="carousel_slide" style={{ width: `${100 * carousels.length}%`, transform: `translateX(-${counter * (100 / carousels.length)}%)` }}>
        {carousels.map((carousel) => (
          <a href="" key={carousel.id}>
            <img src={require(`../../../images/carousels/${carousel.image.path}`)}/>
          </a>
        ))}
      </div>
      <button id="nextBtn" className="nextButton" onClick={showNextSlide}>
        <i className="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  );
}

export default Carousel;
