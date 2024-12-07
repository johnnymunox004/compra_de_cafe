import React, { useState } from "react";
import "./xdev.css"; // Asegúrate de que este archivo contenga tus estilos.
import "@fortawesome/fontawesome-free/css/all.min.css";


const Slider = () => {
  const slides = [
    { name: "Switzerland", img: "https://i.ibb.co/qCkd9jS/img1.jpg" },
    { name: "Finland", img: "https://i.ibb.co/jrRb11q/img2.jpg" },
    { name: "Iceland", img: "https://naturalezayviajes.com/wp-content/uploads/2016/07/aurora-boreal-3.jpg" },
    { name: "Australia", img: "https://i.ibb.co/Bq4Q0M8/img4.jpg" },
    { name: "Netherland", img: "https://i.ibb.co/jTQfmTq/img5.jpg" },
    { name: "Ireland", img: "https://i.ibb.co/RNkk6L0/img6.jpg" },
  ];

  const [currentSlides, setCurrentSlides] = useState(slides);

  const handleNext = () => {
    setCurrentSlides((prev) => {
      const [first, ...rest] = prev; // Toma el primer elemento y el resto
      return [...rest, first]; // Mueve el primer elemento al final
    });
  };

  const handlePrev = () => {
    setCurrentSlides((prev) => {
      const last = prev[prev.length - 1]; // Toma el último elemento
      const rest = prev.slice(0, -1); // El resto de los elementos sin el último
      return [last, ...rest]; // Mueve el último elemento al principio
    });
  };

  return (
    <div className="container">
      <div className="slide">
        {currentSlides.map((slide, index) => (
          <div
            className={`item ${index === 0 ? "active" : ""}`} // Solo el primer slide será activo
            key={index}
            style={{
              backgroundImage: `url(${slide.img})`,
              transform: `translateX(${(index - 1) * 100}%)`, // Calcula la posición
              transition: "transform 0.5s ease-in-out",
            }}
          >
            <div className="content">
              <div className="name">{slide.name}</div>
              <div className="des">X-Dev, Transforming code into visual poetry..!</div>
              <button>See More</button>
            </div>
          </div>
        ))}
      </div>
      <div className="button">
        <button className="prev" onClick={handlePrev}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <button className="next" onClick={handleNext}>
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Slider;
