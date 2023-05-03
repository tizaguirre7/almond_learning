import { Fragment } from "react";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../../firebase-config";
import {
	doc,
	getDocs,
	collection,
	getDoc,
} from "firebase/firestore";
import { useAuth } from "../auth/userSession";
import { Navbar } from "../navbar/navbar";
import Logo from "../../assets/Almond.png";
import { getDocumentById } from "../crud/GeneralCRUD";
import { Button, Row, Col } from "react-bootstrap";
import { useLocation} from 'react-router-dom';


export function Filter(){
    const [contexts, setContexts] = useState();
    const [uid, setUid] = useState();
    const [userLanguages, setUserLanguages] = useState();
    const [isLoadingPage, setLoadingPage] = useState(true); 
    const location = useLocation(); 

    useEffect(() => {
        if (isLoadingPage) {
            setContexts(location.state.allContexts);
            setUid(location.state.uid); 
            setLoadingPage(false);
        }
    },[]);

    const getLanguages = () => {

		const userRef = doc(db, "Users_Database", uid);

		// Get all the words for the user
		const wordsRef = collection(userRef, "Words");

		// Create an empty object to store the languages and their count
		const languages = {};

		// Iterate through all the words and count the number of unique languages
		getDocs(wordsRef).then(async (querySnapshot) => {
			for (const doc of querySnapshot.docs) {
				const languageRef = doc.data().language;
				// console.log(doc.data())
				const languageDoc = await getDoc(languageRef);
				// console.log(languageDoc.data());
				const language = languageDoc.id;

				if (language in languages) {
					languages[language] += 1;
				} else {
					languages[language] = 1;
				}
			}

			// Get the total count of languages
			const totalLanguages = Object.keys(languages).length;

			// Get the list of languages used by the user
			const languageList = Object.keys(languages);
			setUserLanguages(languageList);
		});
	}; 

    if(!isLoadingPage){
        
        // setUserLanguages(getLanguages());
        return (
            <form>
              <label htmlFor="contexts">Contexts:</label>
              <select id="contexts" >
                <option disabled>Choose a Context</option>
                {contexts.map((context) => (
                    <option key={context.id} value={context.id}>{context.value}</option>
                ))}
              </select>
        
              <label htmlFor="language">Language:</label>
              <select id="language" >
                <option disabled>Choose a Language</option>
                {userLanguages.map((language) => (
                    <option key={language} value={language}>{language}</option>
                ))}
              </select>
        
              <label htmlFor="number">Number:</label>
              <input type="number" id="number" />
        
              <button type="submit">Submit</button>
            </form>
          );
    }else{
        return(
            <h1>Cargando Manito</h1>
        );
    }


}
   