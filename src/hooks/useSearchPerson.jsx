import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useRef, useState } from "react";
import { db } from "../services/database";

export const useSearchPerson = () => {
  const [currentPerson, setCurrentPerson] = useState(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const ciRef = useRef();

  const handleSearch = () => {
    const getPerson = async () => {
      setCurrentPerson(null);
      setLoadingSearch(true);
      const { value: ci } = ciRef.current;

      try {
        const queryPerson = query(
          collection(db, "users"),
          where("ci", "==", ci)
        );
        const personsSnapShot = await getDocs(queryPerson);

        if (!personsSnapShot.empty) {
          alert("La persona ya está registrada");
          setLoadingSearch(false);
          return;
        }

        const personRef = doc(db, "voter-data", ci);
        const personSnap = await getDoc(personRef);

        if (!personSnap.exists()) {
          alert("No se encontró a la persona");
        } else {
          setCurrentPerson({ ...personSnap.data(), ci: ci });
        }
      } catch (error) {
        alert("Error al buscar a la persona");
      }
      setLoadingSearch(false);
    };

    getPerson();
  };

  return {
    currentPerson,
    setCurrentPerson,
    loadingSearch,
    handleSearch,
    ciRef,
  };
};
