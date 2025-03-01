import React, { useState, useEffect } from "react";
import Card from "./CardType.jsx";
import "./css/Carousel.css";

const Carousel = () => {
  const [cards, setCards] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  // Fetch card data from the backend when the component mounts
  useEffect(() => {
    fetch("http://localhost:5000/products/cards")
      .then((response) => response.json())
      .then((data) => setCards(data))
      .catch((error) => console.error("Error fetching card data:", error));
  }, []);

  // Move to the next set of cards every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prevIndex) => (prevIndex + 1) % cards.length);
    }, 3000); // Adjust timing as needed

    return () => clearInterval(interval);
  }, [cards.length]);

  const next = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const prev = () => {
    setStartIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };

  // Ensure correct slicing of cards array
  const visibleCards = cards
    .slice(startIndex, startIndex + 6)
    .concat(cards.slice(0, Math.max(0, startIndex + 6 - cards.length)));

  return (
    <div className="carousel">
      <button onClick={prev} className="arrow">
        ◀
      </button>
      <div className="carousel-container">
        {visibleCards.map((card) => (
          <Card key={card.id} {...card} /> // Use destructuring to pass individual properties to Card
        ))}
      </div>
      <button onClick={next} className="arrow">
        ▶
      </button>
    </div>
  );
};

export default Carousel;
