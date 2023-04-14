import React, { useEffect } from "react";
import { useState } from "react";
import {
	signInWithEmailAndPassword,
	onAuthStateChanged,
	signOut,
} from "firebase/auth";
import { auth, db } from "../../firebase-config";
import { Link, useNavigate } from "react-router-dom";
import { ShowWords } from "../Table_Words/Words";
import { doc,getDoc } from "firebase/firestore";
import {Route, Routes} from "react-router-dom"

import almondImage from "../../assets/Almond.png";
import { getDocumentById } from '../crud/GeneralCRUD';
import { Dashboard } from "../dashboard/dashboard";

// export const user = user;

<<<<<<< Updated upstream
export let loggedUser ;
=======
export let uid;
>>>>>>> Stashed changes

export function Login() {
	const navigate = useNavigate();

	const [loginEmail, setLoginEmail] = useState("");
	const [loginPassword, setLoginPassword] = useState("");

	const [loggingUser, setLogginUser] = useState({});

	const login = async () => {
		try {
<<<<<<< Updated upstream
			const signIn_User = await signInWithEmailAndPassword(
=======
			const loggingUser = await signInWithEmailAndPassword(
>>>>>>> Stashed changes
				auth,
				loginEmail,
				loginPassword
			);
<<<<<<< Updated upstream

			const userRef = doc(db, "Users_Database", signIn_User.user.uid);
=======
			setLogginUser(loggingUser);

			// Get the Firestore DocumentReference object for the user
			const userRef = doc(db, "Users_Database", loggingUser.user.uid);
>>>>>>> Stashed changes

			// Fetch the document data using the getDoc() function
			const docSnap = await getDoc(userRef);

			if (docSnap.exists()) {
<<<<<<< Updated upstream
				loggedUser = docSnap.data(); 
				console.log(loggedUser);
=======
>>>>>>> Stashed changes
				navigate("/dashboard");
			} else {
				console.log("No such document!");
			}

		} catch (error) {
			console.log(error.message);
		}
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
		  if (user) {
			setUser(user);
		  } else {
			setUser({});
		  }
		});
	  
		return () => unsubscribe();
	}, []);
	  

	const handleLogout = async () => {
		await signOut(auth);
		navigate('/');	
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
<<<<<<< Updated upstream

=======
			{loggingUser?.uid}
>>>>>>> Stashed changes

			<button onClick={handleLogout}> Sign Out </button>

		</div>
	);
}