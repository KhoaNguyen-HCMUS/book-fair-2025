import React from 'react';
import { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import './home.scss';

// Import images
import img1 from '../../assets/images/instructions/1.png';
import img3 from '../../assets/images/instructions/3.png';
import img4 from '../../assets/images/instructions/4.png';
import img5 from '../../assets/images/instructions/5.png';
import img6 from '../../assets/images/instructions/6.png';
import img7 from '../../assets/images/instructions/7.png';
import img8 from '../../assets/images/instructions/8.png';
import img9 from '../../assets/images/instructions/9.png';
import img10 from '../../assets/images/instructions/10.png';
import img11 from '../../assets/images/instructions/11.png';
import img12 from '../../assets/images/instructions/12.png';
import img13 from '../../assets/images/instructions/13.png';
import img14 from '../../assets/images/instructions/14.png';
import img15 from '../../assets/images/instructions/15.png';
import img16 from '../../assets/images/instructions/16.png';
import img17 from '../../assets/images/instructions/17.png';

const slideImages = [
  img1,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  img12,
  img13,
  img14,
  img15,
  img16,
  img17,
];

const Home = () => {
  const sliderRef = useRef(null);

  // Auto-play functionality

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true, // Disable default arrows
  };

  return (
    <div className='home-container'>
      <h1 className='home-title'>Quy trình nhận và nhập sách!</h1>
      <Slider ref={sliderRef} {...settings}>
        {slideImages.map((img, index) => (
          <div key={index} className='home-slide'>
            <img src={img} alt={`Slide ${index + 1}`} className='home-slide-image' />
          </div>
        ))}
      </Slider>
      <div className='home-controls'>
        <button onClick={() => sliderRef.current.slickPrev()} className='control-button'>
          Trước
        </button>
        <button onClick={() => sliderRef.current.slickNext()} className='control-button'>
          Sau
        </button>
      </div>
    </div>
  );
};

export default Home;
