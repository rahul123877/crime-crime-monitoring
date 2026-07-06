// 🔥 Firebase v10+ Modular SDK (CLEAN CORE FILE)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
    getFirestore,
    collection,
    onSnapshot,
    deleteDoc,
    updateDoc,
    doc,
    query,
    orderBy,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    getStorage
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// 🔥 Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyC8aoQxs8QuweHroIsNSH9tL5DyTMa3JBg",
    authDomain: "ai-crime-monitoring.firebaseapp.com",
    projectId: "ai-crime-monitoring",
    storageBucket: "ai-crime-monitoring.firebasestorage.app",
    messagingSenderId: "1006416656939",
    appId: "1:1006416656939:web:ea42ff5c576b3b60af486e",
    measurementId: "G-8J2VBLW3LX"
};

// 🚀 INIT FIREBASE
const app = initializeApp(firebaseConfig);

// 📊 SERVICES
export const db = getFirestore(app);
export const storage = getStorage(app);

// ===============================
// 📌 COLLECTIONS (CENTRALIZED)
// ===============================
export const reportsRef = collection(db, "reports");
export const usersRef = collection(db, "policeUsers");

// ===============================
// 📡 REAL-TIME REPORTS LISTENER
// ===============================
export const listenReports = (callback) => {
    const q = query(reportsRef, orderBy("time", "desc"));
    return onSnapshot(q, callback);
};

// ===============================
// 🗑 DELETE REPORT
// ===============================
export const deleteReport = async (id) => {
    try {
        await deleteDoc(doc(db, "reports", id));
        return true;
    } catch (error) {
        console.error("Delete Error:", error);
        return false;
    }
};

// ===============================
// ✔ UPDATE STATUS
// ===============================
export const updateStatus = async (id, status) => {
    try {
        await updateDoc(doc(db, "reports", id), {
            status: status
        });
        return true;
    } catch (error) {
        console.error("Update Error:", error);
        return false;
    }
};

// ===============================
// 🔐 LOGIN CHECK (FOR FUTURE USE)
// ===============================
export const getUsers = async () => {
    try {
        const snapshot = await getDocs(usersRef);
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error("User Fetch Error:", error);
        return [];
    }
};