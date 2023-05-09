import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBCmdBXg4CvGly4Ywzu8VjDiFBigpd3DI8",
  authDomain: "db-edushakers.firebaseapp.com",
  databaseURL: "https://db-edushakers-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "db-edushakers",
  storageBucket: "db-edushakers.appspot.com",
  messagingSenderId: "1074487927747",
  appId: "1:1074487927747:web:84107480f397f8ba44d376",
  measurementId: "G-K6G71S1G2N"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
