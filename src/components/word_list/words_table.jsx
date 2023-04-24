import React, { useState, useEffect } from 'react';
import { addDocToCollection } from "../crud/GeneralCRUD";
import { auth, db } from "../../firebase-config";

export function Tabla({ datos , contextos, origenes, languages, types, allContexts, allSources, uid }) {
  const [showModal, setShowModal] = useState(false);
  const contextRef = db.ref(`Users_Database/${uid}/Context`);
  const sourceRef = db.ref(`Users_Database/${uid}/Source`);
  const uniqueContexts = Array.from(new Set(contextos.map((contexto) => contexto.value)));
  const uniqueSources = Array.from(new Set(origenes.map((origen) => origen.value)));

  

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
    console.log(data);

    addDocToCollection("Users_Database//Words",data);
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
                  <option key={contexto.value} value={contextRef.child(contexto.id)}>{contexto}</option>
                ))}
                </select>
            </label>
            <label style={labelStyles}>
                Source:<br/>
                <select name = "source">
                {allSources.map((source) => (
                  <option key={source} value={sourceRef.child(source.id)}>{source}</option>
                ))}
                </select>
            </label>
            <label style={labelStyles}>
                Language:<br/>
                <select name = "language">
                {languages.map((language) => (
                  <option key={language.value} value={"Language/"+language.id}>{language.id}</option>
                ))}
                </select>
            </label>

            <label style={labelStyles}>
                Type:<br/>
                <select name = "type">
                {types.map((type) => (
                  <option value={"Word_type/"+type.type} key={type.type}>{type.type}</option>
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