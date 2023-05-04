import { getDocumentById, getDocuments, getDocByValue } from "../crud/GeneralCRUD";
import React, { useState, useEffect } from 'react';
import { Tabla } from "./words_table";
import { BrowserRouter, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { Sources } from "./../source_list/sources"
import { db } from "../../firebase-config";
import { doc, collection , updateDoc, deleteDoc, serverTimestamp ,deleteField, addDoc, Timestamp ,getDoc,getDocs, setDoc, FieldValue, FieldPath, query, where, arrayUnion, arrayRemove} from "firebase/firestore";
import { Navbar } from "../navbar/navbar";
import queryString from 'query-string';


export function Words(props){
    const {user, isLoading} = props;
    const location = useLocation(); 
    const { search } = useLocation();
    const { language } = queryString.parse(search);
    const languageValue = language || null;
    const [userWords, setUserWords] = useState([]);
    const [userContext, setUserContext] = useState([]);
    const [userSource, setUserSource] = useState([]);
    const [allLanguages, setLanguages] = useState([]);
    const [isLoadingPage, setLoadingPage] = useState(true);
    const [allTypes, setTypes] = useState([]);
    const [allSources, setSources] = useState([]);
    const [allContexts, setContexts] = useState([]);
     

    useEffect(() => {
        if(!isLoading){
            if(languageValue != null){
                const queryWords = async () => {
                    const languageReference = doc(db, 'Languages',languageValue);
                    const q = query(collection(db, "Users_Database",user.uid,"Words"), where("language", "==", languageReference));
                    const querySnapshot = await getDocs(q);
                    let words = [];
                    querySnapshot.forEach((doc) => {
                    words.push({ id: doc.id, ...doc.data() });
                    });
                    setUserWords(words); 
                }
                queryWords();
                
            }else{
                getDocuments("Users_Database/" + user.uid + "/Words")
                .then((result) => {
                setUserWords(result);
                })
                .catch((error) => {
                console.error(error);
                })
            }
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
                <Navbar></Navbar>
                <Link to="/dashboard/list/sources" state = {{allSources: allSources, uid: user.uid}}>Your Sources</Link>
                <Link to="/dashboard/list/context" state = {{allContexts: allContexts, uid: user.uid}}>Your Contexts</Link>
                <Link to="/dashboard/list/games" state = {{allContexts: allContexts, uid: user.uid}}>Games</Link>
                {userWords.length > 0 && userContext.length > 0 && userSource.length > 0 && allLanguages.length > 0 && allTypes.length > 0 && allContexts.length > 0 && allSources.length > 0 ? (
                <Tabla datos={userWords} contextos={userContext} origenes={userSource} languages={allLanguages} types={allTypes} allContexts={allContexts} allSources={allSources} uid={user.uid} ></Tabla>
                ) : (
                <p>No se pueden mostrar los datos debido a información faltante</p>
                )}
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