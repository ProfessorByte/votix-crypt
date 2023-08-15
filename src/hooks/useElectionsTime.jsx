import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { ADMINISTRATOR } from "../consts/roles";
import { useElectionsState } from "./useElectionsState";
import {
  collection,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../services/database";

export const useElectionsTime = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { userData } = useAuth();
  const { electionsStarted } = useElectionsState();

  useEffect(() => {
    if (electionsStarted) {
      const getElectionsData = async () => {
        const queryCurrentElections = query(
          collection(db, "elections"),
          where("current", "==", true),
          limit(1)
        );
        const queryCurrentElectionsSnapshot = await getDocs(
          queryCurrentElections
        );
        try {
          const electionData = queryCurrentElectionsSnapshot.docs[0].data();
          setTimeLeft(
            electionData.startTimestamp + 8 * 60 * 60 * 1000 - Date.now()
          );
          if (
            userData.role === ADMINISTRATOR &&
            electionData.startTimestamp === -1
          ) {
            const currentTime = Date.now();
            await updateDoc(queryCurrentElectionsSnapshot.docs[0].ref, {
              startTimestamp: currentTime,
            });
            setTimeLeft(currentTime + 8 * 60 * 60 * 1000 - Date.now());
          }
        } catch (error) {
          console.log(error);
        }
      };

      getElectionsData();
    }
  }, [electionsStarted]);

  return { timeLeft };
};
