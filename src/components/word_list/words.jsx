import { getDocumentById, getDocuments } from "../crud/GeneralCRUD";
import React, { useState, useEffect } from 'react';
import { Tabla } from "./words_table";

export function Words(props){
    const {user, isLoading} = props;
    const [userWords, setUserWords] = useState([]);
    const [userContext, setUserContext] = useState([]);
    const [userSource, setUserSource] = useState([]);
    const [allLanguages, setLanguages] = useState([]);
    const [isLoadingPage, setLoadingPage] = useState(true);
    const [allTypes, setTypes] = useState([]);
    const [allSources, setSources] = useState([]);
    const [allContexts, setContexts] = useState([]);

    useEffect(() => {
        if (!isLoading) {
            getDocuments("Users_Database/" + user.uid + "/Words")
            .then((result) => {
              setUserWords(result);
            })
            .catch((error) => {
              console.error(error);
            })
        }
      }, [user]);

      useEffect(() => {
        if(userWords.length > 0){
            Promise.all(
                userWords.map((word) => {
                    return getDocumentById(word.context.path)
                })
            ).then((results) => {
                setUserContext(results);
            }).catch((error) => {
                console.error(error);
            });
        }
    }, [userWords]);

    useEffect(() => {
        if(userWords.length > 0){
            Promise.all(
                userWords.map((word) => {
                    return getDocumentById(word.source.path)
                })
            ).then((results) => {
                setUserSource(results);
            }).catch((error) => {
                console.error(error);
            });
        }
    }, [userWords]);

    useEffect(() => {
        if (!isLoading) {
            getDocuments("Languages")
            .then((result) => {
              setLanguages(result);
            })
            .catch((error) => {
              console.error(error);
            })
        }
    }, [userWords]);

    useEffect(() => {
        if (!isLoading) {
            getDocuments("Word_type")
            .then((result) => {
              setTypes(result);
            })
            .catch((error) => {
              console.error(error);
            })
        }
    }, [userWords]);

    useEffect(() => {
        if (!isLoading) {
            getDocuments("Users_Database/"+user.uid+"/Context")
            .then((result) => {
              setContexts(result);
            })
            .catch((error) => {
              console.error(error);
            })

            getDocuments("Users_Database/"+user.uid+"/Source")
            .then((result) => {
              setSources(result);
              setLoadingPage(false);
            })
            .catch((error) => {
              console.error(error);
            })
        }
    }, [userWords]);

    if(!isLoadingPage){  

        return(
            <>
                <h1> Esto es una mierda {}</h1>
                <h2> NO ME GUSTA TU NOMBRE {}</h2>

                <Tabla datos={userWords} contextos = {userContext} origenes = {userSource} languages = {allLanguages} types = {allTypes} allContexts = {allContexts} allSources = {allSources} uid = {user.uid} ></Tabla>
            </>
        )
    }else{
        return(
            <>
                <h1>Cargando Manito</h1>
            </>
        )
    }

    
}