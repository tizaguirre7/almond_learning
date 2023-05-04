import React from 'react';
import { BrowserRouter, Route, Link } from "react-router-dom";
import { deleteDocumentById,updateCollectionDoc } from '../crud/GeneralCRUD';
import { useState} from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from "../navbar/navbar";


export function Sources() {
  const location = useLocation();
  const [sources, setSources] = useState(location.state?.allSources ?? []);
  const [showModal, setShowModal] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [isLoadingPage, setLoadingPage] = useState(!sources.length);
  const uid = location.state?.uid ?? '';
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

  useEffect(() => {
    if (isLoadingPage) {
      setSources(location.state?.allSources ?? []);
      setLoadingPage(false);
    }
  }, []);

  const handleOpenModal = (source) => {
    setShowModal(true);
    setSelectedSource(source);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    const collectionPath = `Users_Database/${uid}/Source/${id}`;
    await deleteDocumentById(collectionPath);
    const allSources = sources.filter((source) => source.id !== id);
    setSources(allSources);
    const updatedLocationState = { ...location.state, allSources };
    navigate(location.pathname, { state: updatedLocationState });
  };

  const handleSubmit = async (event) => {

    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
  
    // Actualizar el contexto en la base de datos
    await updateCollectionDoc("Users_Database/"+uid+"/Source/"+selectedSource.id, data);
  
    // Actualizar la lista de contextos en el estado del componente
    const updatedSources = sources.map((source) => {
      if (source.id === selectedSource.id) {
        return { ...source, ...data };
      }
      return source;
    });
    setSources(updatedSources);
  
    // Actualizar el location.state con la lista de contextos actualizada
    const updatedLocationState = { ...location.state, allSources: updatedSources };
    navigate(location.pathname, { state: updatedLocationState });
  
    handleCloseModal();
  }

    if(!isLoadingPage){
        
        return(
            <>
            <Navbar></Navbar>
                <table>
                    <thead>
                        <tr>
                            <th>Sources</th>
                        </tr>
                    </thead>
                    <tbody>
                    {sources.map((source) => (
                        <tr key={source.id}>
                        <td>{source.value}</td>
                        <td>
                            <button onClick={() => handleOpenModal(source)}>Editar</button>
                            <button onClick={() => handleDelete(source.id)}>Eliminar</button>
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
                            <h2>Edit Context</h2>
                            <form style={formStyles} onSubmit={handleSubmit}>
                            <label style={labelStyles}>
                                Context:<br/>
                                <input style={inputStyles} type="text" name="value" defaultValue={selectedSource.value} />
                            </label>
                            <button style={buttonStyles} type="submit">Enviar</button>
                            </form>
                        </div>
                        </div>
                    ) : null}
                </div>
            </>
        );
    }else{
        return(
            <>
                <h1>Cargando Manito</h1>
            </>
        );
    }
}
