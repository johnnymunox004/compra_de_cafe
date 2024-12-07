import React, { useState } from 'react';
import '../utils/slider.css'

const ImageSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    {
      backgroundImage: 'https://i.ibb.co/qCkd9jS/img1.jpg',
      name: 'Switzerland',
      description: 'X-Dev, Transforming code into visual poetry..!'
    },
    {
      backgroundImage: 'https://i.ibb.co/jrRb11q/img2.jpg',
      name: 'Finland',
      description: 'X-Dev, Transforming code into visual poetry..!'
    },
    {
      backgroundImage: 'https://naturalezayviajes.com/wp-content/uploads/2016/07/aurora-boreal-3.jpg',
      name: 'Iceland',
      description: 'X-Dev, Transforming code into visual poetry..!'
    },
    {
      backgroundImage: 'https://i.ibb.co/Bq4Q0M8/img4.jpg',
      name: 'Australia',
      description: 'X-Dev, Transforming code into visual poetry..!'
    },
    {
      backgroundImage: 'https://i.ibb.co/jTQfmTq/img5.jpg',
      name: 'Netherland',
      description: 'X-Dev, Transforming code into visual poetry..!'
    },
    {
      backgroundImage: 'https://i.ibb.co/RNkk6L0/img6.jpg',
      name: 'Ireland',
      description: 'X-Dev, Transforming code into visual poetry..!'
    }
  ];

  const handleNext = () => {
    const newIndex = (activeIndex + 1) % slides.length;
    setActiveIndex(newIndex);
  };

  const handlePrev = () => {
    const newIndex = (activeIndex - 1 + slides.length) % slides.length;
    setActiveIndex(newIndex);
  };

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-[60vh] bg-gray-100 shadow-lg overflow-hidden">
      <div className="relative w-full h-full">
        {slides.map((slide, index) => {
          const position = (index - activeIndex + slides.length) % slides.length;
          
          return (
            <div 
              key={index} 
              className={`absolute top-1/2 -translate-y-1/2 w-[200px] h-[300px] rounded-xl shadow-2xl bg-cover bg-center transition-all duration-500 ${
                position === 0 || position === 1 
                  ? 'top-0 left-0 translate-y-0 w-full h-full rounded-none' 
                  : ''
              }`}
              style={{ 
                backgroundImage: `url(${slide.backgroundImage})`,
                left: getItemPosition(position),
                opacity: position === 5 ? 0 : 1
              }}
            >
              <div 
                className={`absolute top-1/2 left-[100px] -translate-y-1/2 w-[300px] text-left text-gray-100 font-system ${
                  position === 1 ? 'block' : 'hidden'
                }`}
              >
                <div 
                  className="text-4xl uppercase font-bold animate-slide-in"
                  style={{ 
                    animationDelay: '0s',
                    animationFillMode: 'forwards'
                  }}
                >
                  {slide.name}
                </div>
                <div 
                  className="mt-2.5 mb-5 animate-slide-in"
                  style={{ 
                    animationDelay: '0.3s',
                    animationFillMode: 'forwards'
                  }}
                >
                  {slide.description}
                </div>
                <button 
                  className="px-5 py-2.5 border-none cursor-pointer animate-slide-in"
                  style={{ 
                    animationDelay: '0.6s',
                    animationFillMode: 'forwards'
                  }}
                >
                  See More
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="absolute bottom-5 w-full text-center">
        <button 
          className="w-10 h-9 rounded-lg border border-black mx-1.5 hover:bg-gray-400 hover:text-white transition-colors"
          onClick={handlePrev}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <button 
          className="w-10 h-9 rounded-lg border border-black mx-1.5 hover:bg-gray-400 hover:text-white transition-colors"
          onClick={handleNext}
        >
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

const getItemPosition = (position) => {
  switch(position) {
    case 0:
    case 1:
      return '0';
    case 2:
      return '50%';
    case 3:
      return 'calc(50% + 220px)';
    case 4:
      return 'calc(50% + 440px)';
    case 5:
      return 'calc(50% + 660px)';
    default:
      return 'calc(50% + 660px)';
  }
};

export default ImageSlider;