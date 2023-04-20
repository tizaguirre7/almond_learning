import { Fragment } from "react";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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

import Logo from "../../assets/Almond.png";

import { getDocumentById } from "../crud/GeneralCRUD";

import { Button } from "react-bootstrap";

export function Dashboard(props) {
	const navigate = useNavigate();
	const { user, isLoading } = props;
	const [userLoaded, setUserLoaded] = useState({});
	const [userLanguages, setUserLanguages] = useState([]);

	useEffect(() => {
		if (!isLoading) {
			getDocumentById("Users_Database", user.uid)
				.then((result) => {
					setUserLoaded(result);
					getLanguages();
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}, [user, isLoading]);

	const handleLogout = async () => {
		await signOut(auth);
		navigate("/");
	};

	const getLanguages = () => {
		const userRef = doc(db, "Users_Database", user.uid);

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

	if (!isLoading) {
		// console.log(userLoaded);
		// console.log(userLangauges)

		return (
			<>
				<div className="min-h-full">
					<main>
						<div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
							{/* Your content */}
						</div>
					</main>
					<h1>bienvenido {userLoaded.name}</h1>
					<br />
					<br />
					<br />
					<h5>
						Tu lista de palabras{" "}
						<Link to="../dashboard/list">Aqui</Link>
					</h5>
					<br />
					{userLanguages.map((language, index) => (
						<div className="grid">
							<Button className="bg-danger" key={index} variant="primary">
								{language}
							</Button>
						</div>
					))}
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
		return (
			<>
				<h1>cargando</h1>
			</>
		);
	}
}
