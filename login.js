import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyC8aoQxs8QuweHroIsNSH9tL5DyTMa3JBg",
    authDomain: "ai-crime-monitoring.firebaseapp.com",
    projectId: "ai-crime-monitoring",
    storageBucket: "ai-crime-monitoring.firebasestorage.app",
    messagingSenderId: "1006416656939",
    appId: "1:1006416656939:web:ea42ff5c576b3b60af486e"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");

    if (!loginForm) return;

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const policeId = document.getElementById("policeId").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!policeId || !password) {
            alert("Please fill all fields ❌");
            return;
        }

        try {
            const usersRef = collection(db, "policeUsers");
            const snapshot = await getDocs(usersRef);

            let isValid = false;

            snapshot.forEach((doc) => {
                const data = doc.data();

                if (
                    data.policeId === policeId &&
                    data.password === password
                ) {
                    isValid = true;
                }
            });

            if (isValid) {
                alert("Login Successful 🚔");

                localStorage.setItem("policeUser", policeId);

                window.location.href = "dashboard.html";
            } else {
                alert("Invalid Police ID or Password ❌");
            }

        } catch (error) {
            console.error("Login Error:", error);
            alert("Something went wrong ⚠");
        }
    });

});
import { db } from "./firebase.js";
import { collection, query, where, getDocs }
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ================= LOGIN WITH policeUsers =================
document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");

    if (!loginForm) return;

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const policeId = document.getElementById("policeId").value.trim();
        const password = document.getElementById("password").value.trim();

        try {

            const q = query(
                collection(db, "policeUsers"),
                where("policeId", "=RAHUL=", policeId),
                where("password", "=1234=", password)
            );

            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {

                const userData = querySnapshot.docs[0].data();

                // save session
                localStorage.setItem("policeUser", JSON.stringify(userData));

                alert("Login Successful 🚔");

                window.location.href = "dashboard.html";

            } else {
                alert("Invalid Police ID or Password ❌");
            }

        } catch (error) {
            console.error("Login Error:", error);
        }

    });

});