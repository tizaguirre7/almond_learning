import "./dashboard.css";
import { Fragment } from "react";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../../firebase-config";
import { doc, getDocs, collection, getDoc } from "firebase/firestore";
import { useAuth } from "../auth/userSession";

import queryString from "query-string";

import { Navbar } from "../navbar/navbar";

import Logo from "../../assets/Almond.png";

import { getDocumentById } from "../crud/GeneralCRUD";

import { Button, Row, Col } from "react-bootstrap";
import { Loader } from "../loader/loader";

export function Dashboard(props) {
	const navigate = useNavigate();
	const { user, isLoading } = props;
	const [userLoaded, setUserLoaded] = useState({});
	const [userLanguages, setUserLanguages] = useState([]);
	const [languagesLoaded, setLanguagesLoaded] = useState(true);

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

			console.log(languages);

			setUserLanguages(languageList);
			setLanguagesLoaded(false);
		});
	};

	function filterLanguage(language) {
		const query = queryString.stringify({ language: language });
		navigate(`/dashboard/list?${query}`);
	}

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
					<h1>Welcome {userLoaded.name}</h1>
					<br />
					<br />
					<br />
					<h5>
						Your vocab list {" "}
						<Link className="text-primary" to="../dashboard/list">
							Here
						</Link>
					</h5>
					<br />
					{languagesLoaded ? (
						<Loader></Loader>
					) : (
						<Row xs={1} sm={2} md={3} lg={4} className="g-4">
							{userLanguages.map((language, index) => (
								<Col key={index}>
									<Button
										className="btn-language"
										variant="primary"
										onClick={() => filterLanguage(language)}
									>
										<span className="span-flag">
											<img
												className="flag-icon"
												src={`https://res.cloudinary.com/tomas0707/image/upload/v1682331388/Almond%20Learning/languages/${language}.png`}
												alt=""
											/>
										</span>
										{language}
									</Button>
								</Col>
							))}
							<Col>
								<Button
									className="btn-language"
									variant="primary"
								>
									+
								</Button>
							</Col>
						</Row>
					)}
					<br />
					<br />
				</div>
			</>
		);
	} else {
		return (
			<>
				<Loader></Loader>
			</>
		);
	}
}
