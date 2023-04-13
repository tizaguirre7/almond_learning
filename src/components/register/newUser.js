// import translate from "translate";
import { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { db } from "../../firebase-config";
import { getFirestore } from "firebase/firestore";
import { collection} from "firebase/firestore";
import { doc, updateDoc, serverTimestamp ,deleteField, addDoc, Timestamp ,getDoc, setDoc, FieldValue, FieldPath, query, where, arrayUnion, arrayRemove} from "firebase/firestore";

async function newUser(email, uid, name, surname, birthdate) {
    const documentName = "Users_Database"; //Modificalo para tu documento

    try {
      const birthDateTimestamp = Timestamp.fromDate(new Date(birthdate));

      const addDoc = await setDoc(doc(db, documentName, uid), {
        email: email,
        name: name,
        surname: surname,
        birthDate: birthDateTimestamp,
      });

      addSubCollection(uid, "Context", "Default", "default");
      addSubCollection(uid, "Source", "Default", "default");
      addSubCollection(uid, "Words", "Default", "default");

      console.log("Usuario creado con éxito");
    } catch (e) {
      console.error("Error creando el documento: ", e);
    }
    //A la hora de crear el user no podemos añadirle aún las colecciones de contexto y origen ya que
    //Firebase no permite la creación de colecciones vacías, se crearán en su debido momento cuando
    //El usuario quiera añadir el contexto u origen a alguna palabra que quiera guardar.
  }

    export const addSubCollection = async (docId, subCollId, customSubDocId,docValue) => {
        try {
        // Aquí cambian User_db por la colección de la base de datos principal
        const mainCollectionRef = collection(db, "Users_Database");

        // En este parámetro le indicamos el nombre del documento (el uid del usuario)
        const parentDocRef = doc(mainCollectionRef, docId);
    
        // Aquí referenciamos a la subcolección (O "Context", o "Source")
        const subCollectionRef = collection(parentDocRef, subCollId);
    
        // Indicamos el nombre del documento del contexto o el origen 
        const subDocRef = doc(subCollectionRef, customSubDocId);

        await setDoc(subDocRef, {
            value: docValue 
        });
    
        console.log('Subdocument written with ID: ', subDocRef.id);
        } catch (error) {
        console.error('Error adding subdocument: ', error);
        }
        // PORFAVOR!!! el campo value siempre en minúscula, no solo ese si no en todos los docs 
    };