import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MS_ID,
  appId: process.env.REACT_APP_AID,
};

const main = firebase.initializeApp(firebaseConfig);
const secondary = firebase.initializeApp(firebaseConfig, "secondary");


const storage = main.storage();
const database = main.firestore();
const auth = main.auth();
const authSecondary = secondary.auth();

export { storage, database, auth, authSecondary, firebase as default };
