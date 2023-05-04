import React, { useState, useEffect } from 'react';
import { addDocToCollection,deleteDocumentById,updateCollectionDoc } from "./../crud/GeneralCRUD";
import { auth, db } from "../../firebase-config";
import { doc, collection ,updateDoc, serverTimestamp ,deleteField, addDoc, Timestamp ,getDoc,getDocs, setDoc, FieldValue, FieldPath, query, where, arrayUnion, arrayRemove} from "firebase/firestore";
import { BrowserRouter, Route, Link, useNavigate } from "react-router-dom";
import {ButtonContext} from "./buttons/addContext"
import {ButtonSource} from "./buttons/addSource"
import {ButtonWord} from "./buttons/addWord"
import queryString from 'query-string';

import { Navbar } from "../navbar/navbar";

export function Tabla({ datos , contextos, origenes, languages, types, allContexts, allSources, uid }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const navigate = useNavigate(); 

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

  const handleDelete = async (id) => {
    const collectionPath = `Users_Database/${uid}/Words/${id}`;
    console.log(collectionPath);
    await deleteDocumentById(collectionPath); 
    window.location.reload()
  };

  const handleEdit = async (word) => {
    setSelectedWord(word);
    console.log(word) ;
    handleOpenModal();
  };


  const handleSubmit = async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData.entries());
  
      // Obtener la referencia de contexto seleccionada
      const contextId = data.context;
      const contextRef = doc(db, "Users_Database", uid, "Context", contextId);
      data.context = contextRef;
  
      // Obtener la referencia de fuente seleccionada
      const sourceId = data.source;
      const sourceRef = doc(db, "Users_Database", uid, "Source", sourceId);
      data.source = sourceRef;
  
      const languageId = data.language;
      const languageRef = doc(db, "Languages",languageId);
      data.language = languageRef;
  
      const typeId = data.type;
      const typeRef = doc(db, "Word_type", typeId);
      data.type = typeRef;

      console.log(data); 

      await updateCollectionDoc("Users_Database/"+uid+"/Words/"+selectedWord.id, data);
      handleCloseModal();
      window.location.reload(); 
  }

  function handleDetails(dato){
    const query = queryString.stringify({ word: dato.id, uid: uid});
    navigate(`/dashboard/list/word?${query}`);
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
              <td>
                <button onClick={() => handleEdit(dato,dato.id)}>Editar</button>
                <button onClick={() => handleDelete(dato.id)}>Eliminar</button>
                <button onClick={() => handleDetails(dato)}>Detalles</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
            {showModal ? (
                <div style={modalStyles}>
                <div style={modalContentStyles}>
                    <span style={closeStyles} onClick={handleCloseModal}>
                    &times;
                    </span>
                    <h2>Edit a new word</h2>
                    <form style={formStyles} onSubmit={handleSubmit}>
                    <label style={labelStyles}>
                        Word:<br/>
                        <input style={inputStyles} type="text" name="word" defaultValue= {selectedWord.word}  />
                    </label>
                    <label style={labelStyles}>
                        Context:<br/>
                        <select name = "context" defaultValue={selectedWord.context.id} onChange={(event) => setSelectedWord({ ...selectedWord, context: event.target.value })}>
                          {allContexts.map((contexto) => (
                          <option key={contexto.value} value={contexto.id}>{contexto.value}</option>
                          ))}
                        </select>
                    </label>
                    <label style={labelStyles}>
                        Source:<br/>
                          <select name = "source" defaultValue={selectedWord.source.id} onChange={(event) => setSelectedWord({ ...selectedWord, source: event.target.value })}>
                          {allSources.map((source) => (
                          <option key={source.id} value={source.id}>{source.value}</option>
                          ))}
                          </select>
                    </label>
                    <label style={labelStyles}>
                        Language:<br/>
                          <select name = "language" defaultValue={selectedWord.language.id} onChange={(event) => setSelectedWord({ ...selectedWord, language: event.target.value })}>
                          {languages.map((language) => (
                          <option key={language.value} value={ language.id}>{language.id}</option>
                          ))}
                          </select>
                    </label>

                    <label style={labelStyles}>
                        Type:<br/>
                          <select name = "type" defaultValue={selectedWord.type.id} onChange={(event) => setSelectedWord({ ...selectedWord, type: event.target.value })}>
                          {types.map((type) => (
                          <option value={type.id} key={type.type}>{type.type}</option>
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

      <ButtonContext uid = {uid}></ButtonContext>
      <ButtonSource uid = {uid}></ButtonSource>
      <ButtonWord uid = {uid} allContexts = {allContexts} languages = {languages} allSources = {allSources} types = {types}></ButtonWord>
      </>
    );
  }