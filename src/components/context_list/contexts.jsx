import React from 'react';
import { BrowserRouter, Route, Link } from "react-router-dom";
import { deleteDocumentById, updateCollectionDoc } from '../crud/GeneralCRUD';
import { useState} from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function Context() {
  const location = useLocation();
  const [contexts, setContexts] = useState(location.state?.allContexts ?? []);
  const [showModal, setShowModal] = useState(false);
  const [selectedContext, setSelectedContext] = useState(null);
  const [isLoadingPage, setLoadingPage] = useState(!contexts.length);
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

  const handleOpenModal = (context) => {
    setShowModal(true);
    setSelectedContext(context);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (isLoadingPage) {
      setContexts(location.state?.allContexts ?? []);
      setLoadingPage(false);
    }
  }, []);

  const handleDelete = async (id) => {
    const collectionPath = `Users_Database/${uid}/Context/${id}`;
    await deleteDocumentById(collectionPath);
    const allContexts = contexts.filter((context) => context.id !== id);
    setContexts(allContexts);
    const updatedLocationState = { ...location.state, allContexts };
    navigate(location.pathname, { state: updatedLocationState });
  };

  const handleSubmit = async (event) => {

    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
  
    // Actualizar el contexto en la base de datos
    await updateCollectionDoc("Users_Database/"+uid+"/Context/"+selectedContext.id, data);
  
    // Actualizar la lista de contextos en el estado del componente
    const updatedContexts = contexts.map((context) => {
      if (context.id === selectedContext.id) {
        return { ...context, ...data };
      }
      return context;
    });
    setContexts(updatedContexts);
  
    // Actualizar el location.state con la lista de contextos actualizada
    const updatedLocationState = { ...location.state, allContexts: updatedContexts };
    navigate(location.pathname, { state: updatedLocationState });
  
    handleCloseModal();
  }

    if(!isLoadingPage){
        console.log(contexts); 
        return(
            <>
                <table>
                    <thead>
                        <tr>
                            <th>Contexts</th>
                        </tr>
                    </thead>
                    <tbody>
                    {contexts.map((context) => (
                        <tr key={context.id}>
                        <td>{context.value}</td>
                        <td>
                            <button onClick={() => handleOpenModal(context)}>Editar</button>
                            <button onClick={() => handleDelete(context.id)}>Eliminar</button>
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
                                <input style={inputStyles} type="text" name="value" defaultValue={selectedContext.value} />
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
