import React, { useState, useEffect } from 'react';
import { addDocToCollection } from "./../../crud/GeneralCRUD";
import { auth, db } from "../../../firebase-config";
import { doc, collection ,updateDoc, serverTimestamp ,deleteField, addDoc, Timestamp ,getDoc,getDocs, setDoc, FieldValue, FieldPath, query, where, arrayUnion, arrayRemove} from "firebase/firestore";
import "./../css/words.css"

export function ButtonWord({ uid, allContexts, languages, allSources, types }){
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
    
        data.mistakes = 0; 
        data.date = serverTimestamp(); 
    
        await addDocToCollection("Users_Database/"+uid+"/Words", data);
        handleCloseModal();
        window.location.reload(); 
    }

    return(
        <>
        <div>
            <button class = "buttonAdd" onClick={handleOpenModal}>Add word</button>
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
                        <option key={contexto.value} value={contexto.id}>{contexto.value}</option>
                        ))}
                        </select>
                    </label>
                    <label style={labelStyles}>
                        Source:<br/>
                        <select name = "source">
                        {allSources.map((source) => (
                        <option key={source.id} value={source.id}>{source.value}</option>
                        ))}
                        </select>
                    </label>
                    <label style={labelStyles}>
                        Language:<br/>
                        <select name = "language">
                        {languages.map((language) => (
                        <option key={language.value} value={ language.id}>{language.id}</option>
                        ))}
                        </select>
                    </label>

                    <label style={labelStyles}>
                        Type:<br/>
                        <select name = "type">
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
        </>
    ); 
}