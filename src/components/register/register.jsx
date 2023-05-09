import React from "react";
import { useState } from "react";
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
} from "firebase/auth";
import { db } from "../../firebase-config.jsx";
import { auth } from "../../firebase-config";
import { Link, useNavigate } from "react-router-dom";
import "./register.css"

import { doc, setDoc } from "firebase/firestore";

import { addDocToCollection } from "../crud/GeneralCRUD.js";

import { addSubCollection } from './newUser.js'

export function Register() {
	const navigate = useNavigate();

	const [registerName, setRegisterName] = useState("");
	const [registerSurname, setRegisterSurname] = useState("");

	const [registerDate, setRegisterDate] = useState("");
	const dateObj = new Date(registerDate);

	const [registerEmail, setRegisterEmail] = useState("");
	const [registerPassword, setRegisterPassword] = useState("");

	const [user, setUser] = useState({});

	async function createUserRegistration(uid, email, name, surname, date) {
		const userRef = doc(db, "Users_Database", uid); // create a document reference with user ID as document ID
		await setDoc(userRef, { name: name, surname: surname, birthDate: date, email: email });
		 // set the document data with user's email
		addSubCollection(uid, "Context", "Default", "default");
      	addSubCollection(uid, "Source", "Default", "default");
      	addSubCollection(uid, "Words", "Default", "default");
	}

	const register = async () => {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				registerEmail,
				registerPassword
			);
			const user = userCredential.user;
			console.log("User registered successfully:", user);
			

			// Create a document for the new user in the "users" collection
			createUserRegistration(user.uid, user.email, registerName, registerSurname, dateObj);
			

			navigate("/");
		} catch (error) {
			console.error("Error registering user:", error);
		}
	};

	// const register = async () => {
	// 	try {
	// 		const user = await createUserWithEmailAndPassword(
	// 			auth,
	// 			registerEmail,
	// 			registerPassword
	// 		);
	// 		setUser(user);
	//         console.log(user);
	// 		navigate("/");

	// 	} catch (error) {
	// 		console.log(error.message);
	// 	}
	// };

	return (
		<div className="register-form">
		<h3> Register User </h3>
		<input
			className="register-input"
			placeholder="Name..."
			onChange={(event) => {
			setRegisterName(event.target.value);
			}}
		/>
		<br />
		<input
			className="register-input"
			placeholder="Surname..."
			onChange={(event) => {
			setRegisterSurname(event.target.value);
			}}
		/>
		<br />
		<input
			className="register-input"
			type="date"
			placeholder="Password..."
			onChange={(event) => {
			setRegisterDate(event.target.value);
			}}
		/>
		<br />
		<input
			className="register-input"
			placeholder="Email..."
			onChange={(event) => {
			setRegisterEmail(event.target.value);
			}}
		/>
		<br />
		<input
			className="register-input"
			type="password"
			placeholder="Password..."
			onChange={(event) => {
			setRegisterPassword(event.target.value);
			}}
		/>
		<br />
		<button className="register-button" onClick={register}> Create User</button>
		</div>
	);
}
