import React, { useEffect, useRef, useState } from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Webcam from "react-webcam";
import { addPhoto, GetPhotoSrc } from "../db.js";


//TAKE PHOTO
const WebcamCapture = (props) => {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const [imgId, setImgId] = React.useState(null);
  const [photoSave, setPhotoSave] = React.useState(null);

  useEffect(() => {
    if (photoSave) {
      //console.log("useEffect detected photoSave");
      props.photoedPothole(imgId);
      setPhotoSave(false);
    }
  });
  //console.log("WebCamCapture", props.id);
  const capture = React.useCallback((id) => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    //console.log("capture", imageSrc.length, id);
  },
    [webcamRef, setImgSrc]);
  const savePhoto = (id, imgSrc) => {
    //console.log("savePhoto", imgSrc.length, id);
    console.log("save photo detected");
    addPhoto(id, imgSrc);
    console.log("photo added");
    setImgId(id);
    console.log("photoid has been set");
    setPhotoSave(true);
    console.log("photo saved");
  }
  const cancelPhoto = (id, imgSrc) => {
    //console.log("cancelPhoto", imgSrc.length, id);
    window.location.href = '/'
  }

  //WEBCAM TO TAKE PHOTO
  return (
    <>
      {!imgSrc && (<Webcam
        audio={false}
        ref={webcamRef}
        height={350}
        width={350}
        screenshotFormat="image/jpeg"
      />)}
      {imgSrc && (
        <img
          src={imgSrc}
        />
      )}


      {/* PHOTO BUTTONS */}
      <div className="btn-group">

        {/* CAPTURE PHOTO */}
        {!imgSrc && (
          <button
            type="button"
            className="btn"
            onClick={() => capture(props.id)}
          >
            Capture Photo
          </button>
        )}

        {/* SAVE PHOTO */}
        {imgSrc && (
          <button
            type="button"
            className="btn"
            onClick={() => savePhoto(props.id, imgSrc)}
          >
            Save Photo
          </button>
        )}

        {/* CANCEL PHOTO */}
        <button
          type="button"
          className="btn todo-cancel"
          onClick={() => cancelPhoto(props.id, imgSrc)}
        >
          Close
        </button>
      </div>
    </>
  );
};

//VIEW PHOTO
const ViewPhoto = (props) => {
  const photoSrc = GetPhotoSrc(props.id);

  const closePhoto = (id, imgSrc) => {
    //console.log("cancelPhoto", imgSrc.length, id);
    window.location.href = '/'
  }

  return (
    <>
      <div>
        <img src={photoSrc} alt={props.name} />

        <button
          type="button"
          className="btn todo-cancel"
          onClick={() => closePhoto(props.id, photoSrc)}
        >
          Close
        </button>
      </div>
    </>
  )
};


export default function Todo(props) {

  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');

  function handleChange(e) {
    setNewName(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!newName.trim()) {
      return;
    }
    props.editPothole(props.id, newName);
    setNewName("");
    setEditing(false);
  }

  //EDIT POTHOLE NAME
  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="todo-label" htmlFor={props.id}>
          New name for {props.name}
        </label>
        <input
          id={props.id}
          className="todo-text"
          type="text"
          onChange={handleChange}
        />
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn todo-cancel"
          onClick={() => setEditing(false)}>
          Cancel
          <span className="visually-hidden">renaming {props.name}</span>
        </button>
        <button type="submit" className="btn btn__primary todo-edit">
          Save
          <span className="visually-hidden">new name for {props.name}</span>
        </button>
      </div>
    </form>
  );

  //POTHOLE DATA + EDIT, PHOTO AND DELETE BUTTON
  const viewTemplate = (
    <div className="stack-small">
      <div className="c-cb">
        <input
          id={props.id}
          type="checkbox"
          defaultChecked={props.completed}
          onChange={() => props.togglePotholeCompleted(props.id)}
        />
        <label className="todo-label" htmlFor={props.id}>{props.name}
          &nbsp; | &nbsp;
          <a target="_blank" rel="noopener noreferrer" href={props.location.mapURL}>(map)</a>
          &nbsp; | &nbsp;
          {/* <a href={props.location.smsURL}>(sms)</a> */}
        </label>

        {/* //RATING */}
        <h3>
          Severity Rating: <h2>{props.rating}</h2>
        </h3>

      </div>
      <div className="btn-group">
        <button type="button" className="btn" onClick={() => setEditing(true)}>
          Edit <span className="visually-hidden">{props.name}</span>
        </button>

        <Popup trigger={<button type="button" className="btn"> Take Photo </button>} modal>
          <div><WebcamCapture id={props.id} photoedPothole={props.photoedPothole} /></div>
        </Popup>

        <Popup trigger={<button type="button" className="btn"> View Photo </button>} modal>
          <div><ViewPhoto id={props.id} alt={props.name} /></div>
        </Popup>

        <button
          type="button"
          className="btn btn__danger"
          onClick={() => props.deletePothole(props.id)}>
          Delete <span className="visually-hidden">{props.name}</span>
        </button>
      </div>
    </div>
  );

  return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>;

}
