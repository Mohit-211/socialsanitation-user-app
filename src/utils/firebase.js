import { initializeApp } from '@react-native-firebase/app';
import database from '@react-native-firebase/database';

const firebaseConfig = {
  apiKey: "REDACTED",
  authDomain: "REDACTED",
  databaseURL: "REDACTED",
  projectId: "REDACTED",
  storageBucket: "REDACTED",
  messagingSenderId: "REDACTED",
  appId: "REDACTED",
  measurementId: "REDACTED"
};

const app = initializeApp(firebaseConfig);
const db = database();
export { db };
