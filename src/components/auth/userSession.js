import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth } from "../../firebase-config";


// export function useAuth() {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {

//     // Escuchar cambios en el estado de autenticación del usuario
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user);
//       setIsLoading(false);
//     });

//     // Devolver una función para limpiar el listener cuando el componente se desmonte
//     return unsubscribe;
//   }, []);

//   return { user, isLoading };
// }

async function waitForAuthStateChange(auth) {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const user = await waitForAuthStateChange(auth);
      setUser(user);
      setIsLoading(false);
    }

    loadUser();
  }, []);

  return { user, isLoading };
}



