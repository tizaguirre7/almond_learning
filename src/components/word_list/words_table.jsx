import React, { useState, useEffect } from 'react';
import { addDocToCollection,deleteDocumentById } from "./../crud/GeneralCRUD";
import { auth, db } from "../../firebase-config";
import { doc, collection ,updateDoc, serverTimestamp ,deleteField, addDoc, Timestamp ,getDoc,getDocs, setDoc, FieldValue, FieldPath, query, where, arrayUnion, arrayRemove} from "firebase/firestore";
import {ButtonContext} from "./buttons/addContext"
import {ButtonSource} from "./buttons/addSource"
import {ButtonWord} from "./buttons/addWord"

export function Tabla({ datos , contextos, origenes, languages, types, allContexts, allSources, uid }) {

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

  const handleDelete = async (id) => {
    const collectionPath = `Users_Database/${uid}/Words/${id}`;
    console.log(collectionPath);
    await deleteDocumentById(collectionPath); 
    location.reload()
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Obtener la referencia de contexto seleccionada
    const contextId = data.context;
    console.log(contextId);
    const contextRef = doc(db, "Users_Database", uid, "Context", contextId);
    console.log(contextRef)
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

    data.mistakes = 0; 
    data.date = serverTimestamp(); 

    addDocToCollection("Users_Database/"+uid+"/Words", data);
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
                <button onClick={() => handleEdit(dato.id)}>Editar</button>
                <button onClick={() => handleDelete(dato.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ButtonContext uid = {uid}></ButtonContext>
      <ButtonSource uid = {uid}></ButtonSource>
      <ButtonWord uid = {uid} allContexts = {allContexts} languages = {languages} allSources = {allSources} types = {types}></ButtonWord>
      
      </>
    );
  }