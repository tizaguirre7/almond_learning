import React, { useEffect } from "react";
import { useState } from "react";
import {
	signInWithEmailAndPassword,
	onAuthStateChanged,
	signOut,
} from "firebase/auth";
import { auth, db } from "../../firebase-config";
import { Link, useNavigate } from "react-router-dom";

import almondImage from "../../assets/Almond.png";

import { getDocumentById } from '../crud/GeneralCRUD';

// export const user = user;

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
			console.log(user);
			navigate("/dashboard");

		} catch (error) {
			console.log(error.message);
		}
	};

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
			{user?.uid}

			<button onClick={handleLogout}> Sign Out </button>
		</div>
	);
}

// export const user2 = user;

// export const user = user.data();
