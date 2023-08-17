import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../services/database";

export const useCurrentElection = () => {
  const [currentElection, setCurrentElection] = useState(null);

  useEffect(() => {
    const unsuscribeElecAuth = onSnapshot(
      query(collection(db, "elections"), where("current", "==", true)),
      (querySnapshot) => {
        setCurrentElection(querySnapshot.docs[0]?.data());
      }
    );

    return unsuscribeElecAuth;
  }, []);

  return { currentElection };
};
