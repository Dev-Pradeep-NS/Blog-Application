import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
	apiKey: process.env.REACT_FIREBASE_APIKEY,
	authDomain: process.env.REACT_FIREBASE_AUTHDOMAIN,
	projectId: process.env.REACT_FIREBASE_PROJECTID,
	storageBucket: process.env.REACT_FIREBASE_STORAGEBUCKET,
	messagingSenderId: process.env.REACT_FIREBASE_MESSAGINGSENDERID,
	appId: process.env.REACT_FIREBASE_APPID,
	measurementId: process.env.REACT_FIREBASE_MEASUREMENTID
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
