import React, { useState, useEffect } from "react";

function Header() {
  const [roadImage, setRoadImage] = useState(null);

  const URL = "https://api.unsplash.com/photos/random?query=road&client_id=vujh45V855rZrOQOLJb5-OF8PTKXSBBglUhWZUEa1S8";
  
  useEffect(() => {
    fetch(URL)
      .then(res => res.json())
      .then(photo => {
        const roadImage = photo.urls.regular;
        setRoadImage(roadImage);
      })
  }, []);
  

  return (
    <div className="road-container">
      <img width="100%" height="250px" src={roadImage} alt="roadImage" />
    </div>
  );
}

export default Header;