import "./dashboard.css";
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

import { Navbar } from "../navbar/navbar";

import Logo from "../../assets/Almond.png";

import { getDocumentById } from "../crud/GeneralCRUD";

import { Button, Row, Col } from "react-bootstrap";

export function Dashboard(props) {
	const navigate = useNavigate();
	const { user, isLoading } = props;
	const [userLoaded, setUserLoaded] = useState({});
	const [userLanguages, setUserLanguages] = useState([]);

	useEffect(() => {
		if (!isLoading) {
			getDocumentById("Users_Database/" + user.uid)
				.then((result) => {
					setUserLoaded(result);
					getLanguages();
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}, [user, isLoading]);

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
		return (
			<>
				<Navbar></Navbar>
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
						<Link className="text-primary" to="../dashboard/list">
							Aqui
						</Link>
					</h5>
					<br />
					<Row xs={1} sm={2} md={3} lg={4} className="g-4">
						{userLanguages.map((language, index) => (
							<Col key={index}>
								<Button
									className="btn-language"
									variant="primary"
								>
									<span className="span-flag">
										<img
											className="flag-icon"
											src={
												"https://res.cloudinary.com/tomas0707/image/upload/v1682331388/Almond%20Learning/languages/" +
												language +
												".png"
											}
											alt=""
										/>
									</span>
									{language}
								</Button>
							</Col>
						))}
						<Col>
							<Button className="btn-language" variant="primary">
								+
							</Button>
						</Col>
					</Row>
					<br />
					<br />
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
