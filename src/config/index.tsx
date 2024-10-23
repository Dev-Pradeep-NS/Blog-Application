import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getEnvVariable } from "../utils/helpers/getEnvVariable";

const firebaseConfig = {
	apiKey: getEnvVariable('REACT_APP_FIREBASE_APIKEY') || undefined,
	authDomain: getEnvVariable('REACT_APP_FIREBASE_AUTHDOMAIN') || undefined,
	projectId: getEnvVariable('REACT_APP_FIREBASE_PROJECTID') || undefined,
	storageBucket: getEnvVariable('REACT_APP_FIREBASE_STORAGEBUCKET') || undefined,
	messagingSenderId: getEnvVariable('REACT_APP_FIREBASE_MESSAGINGSENDERID') || undefined,
	appId: getEnvVariable('REACT_APP_FIREBASE_APPID') || undefined,
	measurementId: getEnvVariable('REACT_APP_FIREBASE_MEASUREMENTID') || undefined,
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
