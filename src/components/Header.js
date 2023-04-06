import React, { useState, useEffect } from "react";

function Header() {
  const [roadImage, setRoadImage] = useState(null);
  
  useEffect(() => {
    fetch('https://api.unsplash.com/photos/random?query=road&client_id=tWMsP5MQbHpQpd9ioizhGs5KcrWay_dHysoPk8LzOjA')
      .then(response => response.json())
      .then(data => {
        const roadImage = data.urls.regular;
        setRoadImage(roadImage);
      })
      .catch(error => {
        console.log("Unsplash API error:", error);
      });
  }, []);

  return (
    <div className="road-container">
      <img width="500px" height="150px" src={roadImage} alt="road" />
    </div>
  );
}

export default Header;