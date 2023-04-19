import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase-config";
import {
	doc,
	getDocs,
	collectionGroup,
	collection,
	getDoc,
} from "firebase/firestore";
import { useAuth } from "../auth/userSession";

import { getDocumentById } from "../crud/GeneralCRUD";

import Logo from "../../assets/Almond.png";

// import { getDocumentById } from "../crud/GeneralCRUD";

import { Button } from "react-bootstrap";
// import { userObj } from "../login/login";

export function Dashboard(props) {
	const navigate = useNavigate();

	const { user, isLoading } = props;
	// const [userLogged, setUserLogged] = useState({});

	let updatedUserLogged;

	const handleLogout = async () => {
		await signOut(auth);
		navigate("/");
	};


	if (!isLoading) {
		
		
		getDocumentById("Users_Database", user.uid)
			.then((value) => {
				updatedUserLogged = value;
			})
			.finally(() => {
				setTimeout(() => {
					getLanguages();
				}, 0);
			  });

			

			

		
	
			

		const getLanguages = async () => {
			
			const userRef = doc(db, "Users_Database", user.uid);

			// Get all the words for the user
			const wordsRef = collection(userRef, "Words");

			// Create an empty object to store the languages and their count
			const languages = {};

			// Iterate through all the words and count the number of unique languages
			getDocs(wordsRef).then(async (querySnapshot) => {
				for (const doc of querySnapshot.docs) {
					const languageRef = doc.data().language;
					// console.log(doc.data());
					const languageDoc = await getDoc(languageRef);
					// console.log(languageDoc.data());
					const language = languageDoc.data().code;

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

				console.log(
					`Total number of languages used: ${totalLanguages}`
				);
				console.log(`List of languages used: ${languageList}`);
			});
		};

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
					<Button variant="primary">Primary</Button>{" "}
					<Button variant="secondary">Secondary</Button>{" "}
					<Button variant="success">Success</Button>{" "}
					<Button variant="warning">Warning</Button>{" "}
					<Button variant="danger">Danger</Button>{" "}
					<Button variant="info">Info</Button>{" "}
					<Button variant="light">Light</Button> <hr />
				</div>
			</>
		);
	} else {
		return <p>ta cagando</p>;
	}

	if (!user) {
		return <p>no estas iniciado</p>;
	}
}
