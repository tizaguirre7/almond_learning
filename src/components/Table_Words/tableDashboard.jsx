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
import { login } from "../login"
import { getDocuments } from "../crud/GeneralCRUD.js";