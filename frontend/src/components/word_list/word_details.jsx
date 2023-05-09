import React, { useState, useEffect } from 'react';
import { addDocToCollection,deleteDocumentById,updateCollectionDoc,getDocumentById } from "./../crud/GeneralCRUD";
import { auth, db } from "../../firebase-config";
import { doc, collection ,updateDoc, serverTimestamp ,deleteField, addDoc, Timestamp ,getDoc,getDocs, setDoc, FieldValue, FieldPath, query, where, arrayUnion, arrayRemove} from "firebase/firestore";
import { BrowserRouter, Route, Link, useLocation } from "react-router-dom";
import { Navbar } from "../navbar/navbar";
import queryString from 'query-string';

export function Details(){ 
    const [isLoadingPage, setLoadingPage] = useState(true);
    const [wordDetails, setWordDetails] = useState({});
    const [wordSource, setWordSource] = useState({});
    const [wordContext, setWordContext] = useState({});
    const { search } = useLocation();
    const { word,uid } = queryString.parse(search);

    useEffect(() => {
      let isMounted = true;
    
      const fetchData = async () => {
        try {
          let docWord = await getDocumentById("/Users_Database/"+uid+"/Words/"+word); 
          if (isMounted) {
            setWordDetails(docWord);
            setLoadingPage(false);
          }
        } catch (error) {
          console.log(error);
        }
      };
    
      fetchData();
    
      return () => {
        isMounted = false;
      };
    }, []);
    
    useEffect(() => {
      const getSubCollections = async () =>{
        if (wordDetails && Object.keys(wordDetails).length > 0) {
          let docContext = await getDocumentById("/Users_Database/"+uid+"/Context/"+wordDetails.context.id);
          let docSource = await getDocumentById("/Users_Database/"+uid+"/Source/"+wordDetails.source.id);
          setWordContext(docContext); 
          setWordSource(docSource);
        }
      }

      getSubCollections(); 
    }, [wordDetails])
    

    if(!isLoadingPage){
      return(
        <>
        <Navbar></Navbar>
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <h1>{wordDetails.word}</h1>
              <hr/>
              <div class="row">
                <div class="col-md-6">
                  <h2>Details</h2>
                  <p><strong>Language:</strong> {wordDetails.language.id}</p>
                  <p><strong>Example:</strong> {wordDetails.example}</p>
                  <p><strong>Type:</strong> {wordDetails.type.id}</p>
                </div>
                <div class="col-md-6">
                  <h2>Source</h2>
                  <p><strong>Context:</strong> {wordContext.value}</p>
                  <p><strong>Source:</strong> {wordSource.value}</p>
                </div>
              </div>
            </div>
          </div>
      </div>
        </>
      );
    }else{
        <h1>Cargando Manito</h1>
    }
}