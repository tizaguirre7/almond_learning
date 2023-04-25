import React from 'react';
import { BrowserRouter, Route, Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { deleteDocumentById } from '../crud/GeneralCRUD';
import { useState} from 'react';
import { useEffect } from 'react';

export function Sources(){
    const location = useLocation(); 
    const [sources, setSources] = useState([]);
    const [isLoadingPage, setLoadingPage] = useState(true);
    const uid = location.state.uid; 

    useEffect(() => {
        if(isLoadingPage){
            setSources(location.state.allSources)
            setLoadingPage(false);
        }
    }, [])
    
    console.log(sources);

    const handleDelete = async (id) => {
        const collectionPath = `Users_Database/${uid}/Source/${id}`;
        await deleteDocumentById(collectionPath); 
        const allSources = sources.filter((source) => source.id !== id);
        console.log(allSources);
        setSources(allSources);
    };

    if(!isLoadingPage){
        return(
            <>
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
                            <button onClick={() => handleEdit(source.id)}>Editar</button>
                            <button onClick={() => handleDelete(source.id)}>Eliminar</button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
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