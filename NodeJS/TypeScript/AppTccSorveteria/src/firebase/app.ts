import { initializeApp as InitializeApp } from "firebase/app"
import { config as Dotenv } from "dotenv"
Dotenv()

const FIREBASE_CONFIG = {
	apiKey: process.env.apiKey,
	authDomain: process.env.authDomain,
	databaseURL: process.env.databaseURL,
	projectId: process.env.projectId,
	storageBucket: process.env.storageBucket,
	messagingSenderId: process.env.messagingSenderId,
	appId: process.env.appId,
	measurementId: process.env.measurementId,
}

/**
 * Inicialização do App Firebase
 */ 
export default InitializeApp( FIREBASE_CONFIG )