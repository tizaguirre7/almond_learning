import React, { useState, useEffect } from 'react';
import { addDocToCollection } from "./../../crud/GeneralCRUD";
import { auth, db } from "../../../firebase-config";
import { doc, collection ,updateDoc, serverTimestamp ,deleteField, addDoc, Timestamp ,getDoc,getDocs, setDoc, FieldValue, FieldPath, query, where, arrayUnion, arrayRemove} from "firebase/firestore";


export function ButtonContext({uid}){
    const [showModal, setShowModal] = useState(false);

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
    
        addDocToCollection("Users_Database/"+uid+"/Context", data);
        handleCloseModal();
      }

    return(
        <>
        <div>
            <button onClick={handleOpenModal}>Añadir contexto</button>
            {showModal ? (
                <div style={modalStyles}>
                <div style={modalContentStyles}>
                    <span style={closeStyles} onClick={handleCloseModal}>
                    &times;
                    </span>
                    <h2>Add a new Context</h2>
                    <form style={formStyles} onSubmit={handleSubmit}>
                    <label style={labelStyles}>
                        Context:<br/>
                        <input style={inputStyles} type="text" name="value" />
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