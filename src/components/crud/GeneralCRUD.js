
// import translate from "translate";
import { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { db } from "../../firebase-config.jsx";
import { getFirestore } from "firebase/firestore";
import { collection} from "firebase/firestore";
import { doc, updateDoc, serverTimestamp ,deleteField, addDoc, Timestamp ,getDoc, setDoc, FieldValue, FieldPath, query, where, arrayUnion, arrayRemove} from "firebase/firestore";

    export async function addDocToCollection(collectionPath, data) {
      // El collectionPath es una variable que guarda la referencia o ruta de la colección
      // a la que quieres añadir el documento
      try {
        const docRef = await addDoc(collection(db, collectionPath), data);
        console.log(`Documento con ID ${docRef.id} ha sido añadido exitosamente `);
      } catch (e) {
        console.error("Error al añadir el documento: ", e);
      }
    }

    //Buscar documentos en language, Word_Type o información concreta de un usuario (Email, nombre etc...)
    async function getDocByValue(collectionPath, fieldSearch, valueToFind) {
      // El collectionPath es el nombre de la colección inicial que quieres ver (User_db, Language o Word_Type), la uid
      // Es el id del documento a buscar, el fieldSearch es el nombre del campo del documento y el valueToFind es el valor
      // Del campo que queremos buscar para que nos devuelva el documento entero 

      try {
        const querySnapshot = await getDocs(
          query(collection(db, collectionPath), where(fieldSearch, '==', valueToFind))
        );
        const matchingDoc = querySnapshot.docs[0];
        if (matchingDoc) {
          console.log('Valor encontrado: ', matchingDoc.id);
          return matchingDoc.id;
        } else {
          console.log(`No hay ningún documento con el valor ${valueToFind}.`);
        }
      } catch (e) {
        console.error('Error al coger los documentos:', e);
      }
    }

    export const getDocumentById = async (collectionPath, id) => { 
      const docRef = doc(db, collectionPath, id);
      const docSnapshot = await getDoc(docRef);
      
      console.log(docSnapshot.data());
      if (!docSnapshot.exists()) {
        console.log(`No se ha encontrado ningún documento con el id ${id}.`);
        return null; // No se encontró ningún usuario con el ID especificado
      } else {
        const documentData = docSnapshot.data();
        return documentData;
      }
    };

    async function getDocuments(collectionPath) {
      const collectionRef = collection(db, collectionPath); // Crear referencia a la colección
      const docsSnapshot = await getDocs(collectionRef); // Obtener todos los documentos de la colección
      const documents = docsSnapshot.docs.map((doc) => {
        console.log(doc.data());
        return {
          id: doc.id,
          ...doc.data(),
        };
      }); // Mapear los documentos y sus IDs
      return documents;
    }

    async function deleteDocumentById(collectionPath,docId) {
      // Fácil, el uid es la id del usuario (El que esta conectado actualmente), luego la colección a la que quermos borrar un documento
      // Y luego le pasamos la id del documento a borrar

      try {
        const docRef = doc(collection(db, collectionPath), docId);
        await deleteDoc(docRef);
        console.log(`El documento con ID ${docId} fue borrado con éxito.`);
      } catch (e) {
        console.error('Error al borrar el documento: ', e);
      }
    }

    async function updateCollectionDoc(collectionPath,docId,updateData) {
      //Le pasamos la ruta de la subcolección con la id del documento a actualizar y el objeto (si solo quieres actualizar
      // un solo campo del objeto simplemento crea un objeto con el unico campo que quieres modificar y pasaselo a la función)
      // Esta función no se aplica a las colecciones Language y Word_Type ya que estas son fijas y no se van a cambiar.
      // Por eso no tienen CRUD.

      const collectionRef = collection(db,collectionPath);
      try {
        const docRef = doc(collectionRef, docId);
    
        if (updateData) {
          await updateDoc(docRef, updateData);
          console.log('Documento actualizado correctamente');
        } else {
          console.log('No se le ha pasado ninguna información para actualizar el documento');
        }
      } catch (e) {
        console.error('Error al actualizar el documento: ', e);
      }
    }

