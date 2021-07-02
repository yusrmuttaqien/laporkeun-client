import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MS_ID,
  appId: process.env.REACT_APP_AID,
};

const main = initializeApp(firebaseConfig);
const secondary = initializeApp(firebaseConfig, "secondary");

const storage = getStorage(main);
const database = getFirestore(main);
const auth = getAuth(main);
const authSecondary = getAuth(secondary);

export { storage, database, auth, authSecondary };
