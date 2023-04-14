import React, { useEffect } from "react";
import { useState } from "react";
import {
	signInWithEmailAndPassword,
	onAuthStateChanged,
	signOut,
} from "firebase/auth";
import { auth, db } from "../../firebase-config";
import { Link, useNavigate } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";

import almondImage from "../../assets/Almond.png";

import { getDocumentById } from "../crud/GeneralCRUD";

export let userObj;

export function Login() {
	const navigate = useNavigate();

	const [loginEmail, setLoginEmail] = useState("");
	const [loginPassword, setLoginPassword] = useState("");

	const [user, setUser] = useState({});

	const login = async () => {
		try {
			const user = await signInWithEmailAndPassword(
				auth,
				loginEmail,
				loginPassword
			);
			setUser(user);
			

			// Get the Firestore DocumentReference object for the user
			const userRef = doc(db, "Users_Database", user.user.uid);

			// Fetch the document data using the getDoc() function
			const docSnap = await getDoc(userRef);

			if (docSnap.exists()) {
				// const userDoc = docSnap.data();
				userObj = docSnap;
				// console.log(userDoc);
				// console.log(userObj);
				navigate("/dashboard");
			} else {
				console.log("No such document!");
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleLogout = async () => {
		await signOut(auth);
		navigate("/");
	};

	return (
		<div>
			<img src={almondImage} alt="imagen no disponible"></img>

			<div>
				<h3> Login </h3>
				<input
					placeholder="Email..."
					onChange={(event) => {
						setLoginEmail(event.target.value);
					}}
				/>
				<input
					placeholder="Password..."
					onChange={(event) => {
						setLoginPassword(event.target.value);
					}}
				/>

				<button onClick={login}> Login</button>
			</div>

			<h4>Don't have an account?</h4>
			<h5>
				Register <Link to="../register">here</Link>
			</h5>

			<h4> User Logged In: </h4>
			{user?.uid}

			<button onClick={handleLogout}> Sign Out </button>
		</div>
	);
}
