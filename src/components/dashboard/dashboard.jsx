import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase-config";
import { doc, getDocs, collectionGroup, collection, getDoc } from "firebase/firestore";
import { useAuth } from "../auth/userSession";

import Logo from "../../assets/Almond.png";

import { getDocumentById } from "../crud/GeneralCRUD"

import { Button } from 'react-bootstrap';

export function Dashboard(props) {
	const navigate = useNavigate();	
	const {user, isLoading} = props;

	console.log(user);
	
	// const userObj = getDocumentById("Users_Database", user.id);

	const handleLogout = async () => {
		await signOut(auth);
		navigate("/");
	};

	// const getLanguages = () => {
	// 	const userRef = doc(db, "Users_Database", userObj.id);

	// 	// Get all the words for the user
	// 	const wordsRef = collection(userRef, "Words");

	// 	// Create an empty object to store the languages and their count
	// 	const languages = {};

	// 	// Iterate through all the words and count the number of unique languages
	// 	getDocs(wordsRef).then(async (querySnapshot) => {
    //   for (const doc of querySnapshot.docs) {
    //     const languageRef = doc.data().language;
    //     console.log(doc.data())
    //     const languageDoc = await getDoc(languageRef);
    //     console.log(languageDoc.data());
    //     const language = languageDoc.data().code;
        
    //     if (language in languages) {
    //       languages[language] += 1;
    //     } else {
    //       languages[language] = 1;
    //     }
    //   }
      
    //   // Get the total count of languages
    //   const totalLanguages = Object.keys(languages).length;
      
    //   // Get the list of languages used by the user
    //   const languageList = Object.keys(languages);
      
    //   console.log(`Total number of languages used: ${totalLanguages}`);
    //   console.log(`List of languages used: ${languageList}`);
    // });
	// };

	// getLanguages();
	// console.log(userObj);
	// console.log(userDashboard);

	if(!isLoading){
		const userObj = getDocumentById("Users_Database", user.uid);



		return (
			<>
				<div className="min-h-full">
					
	
					<main>
						<div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
							{/* Your content */}
						</div>
					</main>
	
					<h1>bienvenido {user.email}</h1>
	
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
	
					<button onClick={handleLogout}>Sign out</button>
	
					<Button variant="primary">Primary</Button>{' '}
					<Button variant="secondary">Secondary</Button>{' '}
					<Button variant="success">Success</Button>{' '}
					<Button variant="warning">Warning</Button>{' '}
					<Button variant="danger">Danger</Button>{' '}
					<Button variant="info">Info</Button>{' '}
					<Button variant="light">Light</Button>{' '}
					
	
					<hr />
				</div>
			</>
		);
	}else{
		return(
			<>
				<h1>cargando</h1>
			</>
		);
	}



	
}
