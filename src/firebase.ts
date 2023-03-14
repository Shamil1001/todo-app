import { initializeApp } from "firebase/app";
import {getDatabase} from 'firebase/database'
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCKUurZtC_UnnaByvPySoV43NansIMqObI",
  authDomain: "todo-list-9aa1b.firebaseapp.com",
  databaseURL: "https://todo-list-9aa1b-default-rtdb.firebaseio.com",
  projectId: "todo-list-9aa1b",
  storageBucket: "todo-list-9aa1b.appspot.com",
  messagingSenderId: "237638838892",
  appId: "1:237638838892:web:c439e307a798e57d988649"
};


const app = initializeApp(firebaseConfig);
export const db =getDatabase(app)
export const auth = getAuth()

