{ initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBegLDQ4UQn-WfTAQs6jXYBbkv6NMJKUUg",
    authDomain: "crime-monitering.firebaseapp.com",
    projectId: "crime-monitering",
    storageBucket: "crime-monitering.firebasestorage.app",
    messagingSenderId: "158442658246",
    appId: "1:158442658246:web:22044be4cbb700cae73ac7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
