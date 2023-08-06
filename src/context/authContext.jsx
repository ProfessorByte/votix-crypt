import { createContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth, db } from "../services/database";
import { doc, getDoc } from "firebase/firestore";

export const authContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const getUserData = async () => {
        const userDataSnap = await getDoc(doc(db, "users", currentUser.uid));
        if (userDataSnap.exists()) {
          setUserData(userDataSnap.data());
        }

        setUser(currentUser);
        setLoading(false);
      };

      if (currentUser) {
        getUserData();
        return;
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => {
    setUser(null);
    setUserData(null);
    signOut(auth);
  };

  return (
    <authContext.Provider value={{ login, logout, loading, user, userData }}>
      {children}
    </authContext.Provider>
  );
};
