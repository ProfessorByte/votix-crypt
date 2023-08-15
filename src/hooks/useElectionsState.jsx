import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../services/database";

export const useElectionsState = () => {
  const [electionsStarted, setElectionsStarted] = useState(false);
  const [loadingElectionsData, setLoadingElectionsData] = useState(true);

  useEffect(() => {
    const queryElectoralAuth = query(
      collection(db, "users"),
      where("role", "==", "admin")
    );
    const unsuscribeElecStart = onSnapshot(
      queryElectoralAuth,
      (querySnapshot) => {
        let flagAuth = true;
        querySnapshot.forEach((doc) => {
          if (!doc.data().electoralAuthorization) {
            flagAuth = false;
          }
        });
        setElectionsStarted(flagAuth);
        setLoadingElectionsData(false);
      }
    );

    return unsuscribeElecStart;
  }, []);

  return { electionsStarted, loadingElectionsData };
};
