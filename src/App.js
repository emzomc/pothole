import React, { useState, useRef, useEffect } from "react";
import './App.css';
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import { nanoid } from "nanoid";

//FILTER BUTTONS
const FILTER_MAP = {
  All: () => true,
  Active: (pothole) => !pothole.completed,
  Repaired: (pothole) => pothole.completed
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {

  //GEO LOCATION
  function geoFindMe() {
    console.log("geoFindMe", lastInsertedId);
    function success(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      console.log(`Latitude: ${latitude}°, Longitude: ${longitude}°`);
      locatePothole(lastInsertedId,
        {
          latitude: latitude,
          longitude: longitude,
          error: "",
          mapURL: `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`,
          //smsURL: `sms://00447700900xxxx?body=https://maps.google.com/?q=${latitude},${longitude}`
        });
    }
    function error() {
      console.log('Unable to retrieve your location');
    }
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
    } else {
      console.log('Locating...');
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }




  function usePersistedState(key, defaultValue) {
    const [state, setState] = React.useState(
      () => JSON.parse(localStorage.getItem(key)) || defaultValue
    );
    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);
    return [state, setState];
  }


  const [potholes, setPotholes] = usePersistedState('potholes', []);
  const [filter, setFilter] = useState('All');
  const [lastInsertedId, setLastInsertedId] = useState('');

  function togglePotholeCompleted(id) {
    const updatedPotholes = potholes.map((pothole) => {
      // if this pothole has the same ID as the edited pothole
      if (id === pothole.id) {
        // use object spread to make a new object
        // whose `completed` prop has been inverted
        return { ...pothole, completed: !pothole.completed }
      }
      return pothole;
    });
    setPotholes(updatedPotholes);
  }


  //DELETE POTHOLE
  function deletePothole(id) {
    const remainingPotholes = potholes.filter((pothole) => id !== pothole.id);
    setPotholes(remainingPotholes);
  }

  //EDIT POTHOLE
  function editPothole(id, newName) {
    //console.log("editPothole before");
    //console.log(potholes);

    const editedPotholeList = potholes.map(pothole => {
      // if this pothole has the same ID as the edited pothole
      if (id === pothole.id) {
        //
        return { ...pothole, name: newName }
      }
      return pothole;
    });
    setPotholes(editedPotholeList);
  }


  //LOCATE POTHOLE
  function locatePothole(id, location) {
    console.log("locate Pothole", id, " before");
    console.log(location, potholes);
    const locatedPotholeList = potholes.map(pothole => {
      // if this pothole has the same ID as the edited pothole
      if (id === pothole.id) {
        //
        return { ...pothole, location: location }
      }
      return pothole;
    });
    console.log(locatedPotholeList);
    setPotholes(locatedPotholeList);
  }


  function photoedPothole(id) {
    //console.log("photoedPothole", id);
    const photoedPotholeList = potholes.map(pothole => {
      // if this pothole has the same ID as the edited pothole
      if (id === pothole.id) {
        //
        return { ...pothole, photo: true }
      }
      return pothole;
    });
    //console.log(photoedPotholeList);
    setPotholes(photoedPotholeList);
  }


  const potholeList = potholes
    .filter(FILTER_MAP[filter])
    .map((pothole) => (
      <Todo
        id={pothole.id}
        name={pothole.name}
        completed={pothole.completed}
        key={pothole.id}
        location={pothole.location}
        togglePotholeCompleted={togglePotholeCompleted}
        photoedPothole={photoedPothole}
        deletePothole={deletePothole}
        editPothole={editPothole}
      />
    ));

//FILTER BUTTONS
  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  //ADD POTHOLE
  function addPothole(name) {
    const id = "todo-" + nanoid();
    const newPothole = { id: id, name: name, completed: false, location: { latitude: "##", longitude: "##", error: "##" } };
    setLastInsertedId(id);
    setPotholes([...potholes, newPothole]);
  }

  //POTHOLES REMAINING HEADER
  const potholesNoun = potholeList.length !== 1 ? 'potholes' : 'pothole';
  const headingText = `${potholeList.length} ${potholesNoun} remaining`;


  return (
    <div className="todoapp stack-large">
      <h1>Pothole Reporter</h1>
      <Form addPothole={addPothole} geoFindMe={geoFindMe} />
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading">
        {headingText}
      </h2>
      <ul
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {potholeList}
      </ul>
    </div>
  );
}

export default App;
