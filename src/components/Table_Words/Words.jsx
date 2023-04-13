import React from "react";
import { useState } from "react";
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
} from "firebase/auth";
import { db } from "../../firebase-config.jsx";
import { auth } from "../../firebase-config.jsx";
import { Link, useNavigate } from "react-router-dom";

import { doc, setDoc } from "firebase/firestore";
import { getDocuments } from "../crud/GeneralCRUD.js";

export function ShowWords(userUID){
    console.log(userUID);

	return(
		<div>
			<h2>Hijo de remilputa</h2>
		</div>
	);
}


