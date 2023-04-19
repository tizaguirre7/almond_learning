import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect, useRef } from 'react';
import { auth } from "../../firebase-config";



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
  const isFirstRender = useRef(true);

  useEffect(() => {
    async function loadUser() {
      const user = await waitForAuthStateChange(auth);
      setUser(user);
      setIsLoading(false);
    }

    if (!isFirstRender.current) {
      loadUser();
    } else {
      isFirstRender.current = false;
    }
  }, []);

  return { user, isLoading };
}



