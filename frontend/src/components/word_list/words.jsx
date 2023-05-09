import { getDocumentById, getDocuments, getDocByValue } from "../crud/GeneralCRUD";
import React, { useState, useEffect } from 'react';
import { Tabla } from "./words_table";
import { Loader } from '../loader/loader'
import { Navbar } from "../navbar/navbar";
import { BrowserRouter, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { db } from "../../firebase-config";
import { doc, collection , collectionGroup, updateDoc, deleteDoc, serverTimestamp ,deleteField, addDoc, Timestamp ,getDoc,getDocs, setDoc, FieldValue, FieldPath, query, where, arrayUnion, arrayRemove} from "firebase/firestore";
import queryString from 'query-string';
import "./css/words.css"


export function Words(props){
    const {user, isLoading} = props;
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
    const [selectedType, setSelectedType] = useState(null);
    const [selectedContext, setSelectedContext] = useState(null);
    const [selectedSource, setSelectedSource] = useState(null);
    const [backUpData, setBackUpData] = useState();

     

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
                    setBackUpData(words); 
                }
                queryWords();
                
            }else{
                getDocuments("Users_Database/" + user.uid + "/Words")
                .then((result) => {
                setUserWords(result);
                setBackUpData(result);
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

    const handleSubmit = async (event) => {
        event.preventDefault();
  
        let q = query(collection(db, "Users_Database", user.uid, "Words"));
        
        if (selectedContext != null) {
            const contextRef = doc(db, "Users_Database", user.uid, "Context", selectedContext);
            q = query(q, where("context", "==", contextRef));
        }
        
        if (selectedSource != null) {
            const sourceRef = doc(db, "Users_Database", user.uid, "Source", selectedSource);
            q = query(q, where("source", "==", sourceRef));
        }
        
        if (selectedType != null) {
            const typeRef = doc(db, "Word_type", selectedType);
            q = query(q, where("type", "==", typeRef));
        }

        if (language != null){
            const languageRef= doc(db,"Languages",languageValue); 
            q = query(q, where("language","==",languageRef))
        }
        const querySnapshot = await getDocs(q);

        const filteredData = [];

        querySnapshot.forEach((doc) => {
        const docData = doc.data();
        docData.id = doc.id;
        filteredData.push(docData);
        });

        if(filteredData.length > 0){
            setUserWords(filteredData);
            setLoadingPage(true);
        }

        setSelectedContext(null);
        setSelectedSource(null);
        setSelectedType(null);
    }

    // console.log(userWords)

    if(!isLoadingPage){  

        return(
            <>
                <Navbar></Navbar>

                <form class="filter-form" onSubmit={handleSubmit}>
                <select class="filter-select" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                    <option disabled selected>Select a Word Type</option>
                    {allTypes.map((type) => (
                    <option key={type.type} value={type.id}>{type.type}</option>
                    ))}
                </select>

                <select class="filter-select" value={selectedContext} onChange={(e) => setSelectedContext(e.target.value)}>
                    <option disabled selected>Select a Context</option>
                    {allContexts.map((context) => (
                    <option key={context.value} value={context.id}>{context.value}</option>
                    ))}
                </select>

                <select class="filter-select" value={selectedSource} onChange={(e) => setSelectedSource(e.target.value)}>
                    <option disabled selected value="">Select a Word Type</option>
                    {allSources.map((sources) => (
                    <option key={sources.value} value={sources.id}>{sources.value}</option>
                    ))}
                </select>

                <button class="filter-btn" type="submit">Filter</button>
                </form>

                <Link to="/dashboard/list/sources" class="your-sources-link text-primary" state={{allSources: allSources, uid: user.uid}}>Your Sources</Link>
                <Link to="/dashboard/list/context" class="your-contexts-link text-primary" state={{allContexts: allContexts, uid: user.uid}}>Your Contexts</Link>
                {userWords.length > 0 && userContext.length > 0 && userSource.length > 0 && allLanguages.length > 0 && allTypes.length > 0 && allContexts.length > 0 && allSources.length > 0 ? (
                <Tabla datos={userWords} contextos={userContext} origenes={userSource} languages={allLanguages} types={allTypes} allContexts={allContexts} allSources={allSources} uid={user.uid} ></Tabla>
                ) : (
                <p></p>
                )}
            </> 
        )
    }else{
        return(
            <>
                <Navbar></Navbar>
                <Loader></Loader>
            </>
        )
    }
}