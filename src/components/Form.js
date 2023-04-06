import React, { useEffect, useState } from "react";

function Form(props) {
  
  const [addition, setAddition] = useState(false);
  const [name, setName] = useState('');

  //RATING
  const [rating, setRating] = useState("Moderate");


  //RATING CHANGE RADIO BUTTON
  function ratingChange(e) {
    setRating(e.target.value);
    console.log(e.target.value);
  }


  useEffect(() => {
    if (addition) {
      console.log("useEffect detected addition");
      props.geoFindMe();
      setAddition(false);
    }
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }
    setAddition(true);
    props.addPothole(name);
    //reset inputs in form
    setName("");
    setRating("Moderate");
  }

  function handleChange(e) {
    setName(e.target.value);
  }

  //ADD POTHOLE FORM
  return (
    <form onSubmit={handleSubmit}>
      <h2 className="label-wrapper">
        <label htmlFor="new-todo-input" className="label__lg">
          Enable your location.&nbsp; | &nbsp;
          Enter the street name.&nbsp; | &nbsp;
          Take a photo of the pothole.
        </label>
      </h2>
      <input
        type="text"
        id="new-todo-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
        value={name}
        onChange={handleChange}
      />







      {/* SEVERITY RATING */}
      <h3>How Severe is the Pothole?</h3>

      <input
        type="radio"
        value="Minor"
        name="rating"
        id="minor"
        checked={rating === 'Minor'}
        onChange={ratingChange} />
      <label>Minor</label>
      &nbsp; | &nbsp;
      <input
        type="radio"
        value="Moderate"
        name="rating"
        id="moderate"
        checked={rating=== 'Moderate'}
        onChange={ratingChange} />
      <label>Moderate</label>
      &nbsp; | &nbsp;
      <input
        type="radio"
        value="Major"
        name="rating"
        id="major"
        checked={rating === 'Major'}
        onChange={ratingChange} />
      <label>Major</label>









      <button type="submit" className="btn btn__primary btn__lg">
        Add
      </button>
    </form>
  );
}

export default Form;