import react from "react";
import "../asset/css/card1.css";

const Card1 = () => {
  return (
    <div className="card1-container">
      <div className="card1">
        <img
          src="https://via.placeholder.com/300x200"
          alt="Card Image"
          className="card1-image"
        />
        <div className="intro">
          <h3 className="card1-title">Card Title</h3>
          <p className="card1-description">
            This is a description of the card content. It provides more details
            about the topic.
          </p>
          <button className="card1-button">Learn More</button>
        </div>
      </div>
    </div>
  );
};

export default Card1;
