import React, { useState, useEffect } from 'react';
import { addDocToCollection } from "../crud/GeneralCRUD";
import { auth, db } from "../../firebase-config";
import { doc, collection ,updateDoc, serverTimestamp ,deleteField, addDoc, Timestamp ,getDoc,getDocs, setDoc, FieldValue, FieldPath, query, where, arrayUnion, arrayRemove} from "firebase/firestore";


export function Tabla({ datos , contextos, origenes, languages, types, allContexts, allSources, uid }) {
  const [showModal, setShowModal] = useState(false);
  const usersDatabaseRef = collection(db, "Users_Database");
  const contextRef = collection(usersDatabaseRef, uid, "Context");
  const sourceRef = collection(usersDatabaseRef, uid, "Source");

  const modalStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    zIndex: "1",
    left: "0",
    top: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)"
  };

  const modalContentStyles = {
    padding: "20px",
    borderRadius: "10px",
    position: "relative",
    maxWidth: "500px",
    maxHeight: "80%",
    overflowY: "auto",
    backgroundColor: "white"
  };

  const closeStyles = {
    position: "absolute",
    top: "10px",
    right: "10px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#aaa",
    cursor: "pointer"
  };

  const formStyles = {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white"
  };

  const labelStyles = {
    marginBottom: "10px"
  };

  const inputStyles = {
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    marginBottom: "20px"
  };

  const buttonStyles = {
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  };

  
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Obtener la referencia de contexto seleccionada
    const contextId = data.context.id;
    console.log(contextId);
    const contextRef = doc(db, "Users_Database", uid, "Context", contextId.id);
    console.log(contextRef)
    data.context = contextRef;

    // Obtener la referencia de fuente seleccionada
    const sourceId = data.source;
    const sourceRef = doc(db, "Users_Database", uid, "Source", sourceId.id);
    data.source = sourceRef;

    addDocToCollection("Users_Database/"+uid+"/Words", data);
    handleCloseModal();
  }

  //--------------------------------------------------------------------------------//

    console.log(contextos); 
    return (
      <>
        <table>
        <thead>
          <tr>
            <th>Word</th>
            <th>Date</th>
            <th>Context</th>
            <th>Source</th>
            <th>Translation</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((dato, index) => (
            <tr key={dato.id}>
              <td>{dato.word}</td>
              <td>{new Date(dato.date.seconds * 1000).toLocaleString()}</td>
              <td>{contextos[index].value}</td>
              <td>{origenes[index].value}</td>
              <td>Aquí la traducción</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
      <button onClick={handleOpenModal}>Abrir formulario</button>
      {showModal ? (
        <div style={modalStyles}>
          <div style={modalContentStyles}>
            <span style={closeStyles} onClick={handleCloseModal}>
              &times;
            </span>
            <h2>Add a new word</h2>
            <form style={formStyles} onSubmit={handleSubmit}>
            <label style={labelStyles}>
                Word:<br/>
                <input style={inputStyles} type="text" name="word" />
            </label>
            <label style={labelStyles}>
                Context:<br/>
                <select name = "context">
                {allContexts.map((contexto) => (
                  <option key={contexto.value} value={doc(db,sourceRef+"/"+contexto.id).path}>{contexto.value}</option>
                ))}
                </select>
            </label>
            <label style={labelStyles}>
                Source:<br/>
                <select name = "source">
                {allSources.map((source) => (
                  <option key={source.id} value={doc(db,sourceRef+"/"+source.id).path}>{source.value}</option>
                ))}
                </select>
            </label>
            <label style={labelStyles}>
                Language:<br/>
                <select name = "language">
                {languages.map((language) => (
                  <option key={language.value} value={ doc(db,"Language/"+language.id).path}>{language.id}</option>
                ))}
                </select>
            </label>

            <label style={labelStyles}>
                Type:<br/>
                <select name = "type">
                {types.map((type) => (
                  <option value={doc(db,"Users_Database/"+uid+"/Type/"+type.id).path} key={type.type}>{type.type}</option>
                ))}
                </select>
            </label>

            <label style={labelStyles}>
                Example:<br/>
                <textarea name = "example"></textarea>
            </label>
              
              <button style={buttonStyles} type="submit">Enviar</button>
            </form>
          </div>
        </div>
      ) : null}
      </div>
      </>
    );
  }