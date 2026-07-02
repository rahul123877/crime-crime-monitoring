let firs = JSON.parse(localStorage.getItem("firs")) || [];

function renderFIR() {
    let list = document.getElementById("firList");
    list.innerHTML = "";

    firs.forEach((fir, index) => {
        list.innerHTML += `
      <li>
        ${fir}
        <button onclick="deleteFIR(${index})">Delete</button>
      </li>
    `;
    });
}

function addFIR() {
    let input = document.getElementById("firInput").value;

    if (input === "") return;

    firs.push(input);
    localStorage.setItem("firs", JSON.stringify(firs));

    document.getElementById("firInput").value = "";
    renderFIR();
}

function deleteFIR(index) {
    firs.splice(index, 1);
    localStorage.setItem("firs", JSON.stringify(firs));
    renderFIR();
}

renderFIR();
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBegLDQ4UQn-WfTAQs6jXYBbkv6NMJKUUg",
    authDomain: "crime-monitering.firebaseapp.com",
    projectId: "crime-monitering",
    storageBucket: "crime-monitering.firebasestorage.app",
    messagingSenderId: "158442658246",
    appId: "1:158442658246:web:22044be4cbb700cae73ac7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.addFIR = async function () {
    const input = document.getElementById("firInput").value;

    if (input.trim() === "") {
        alert("FIR Details लिखें");
        return;
    }

    await addDoc(collection(db, "firs"), {
        details: input,
        createdAt: new Date()
    });

    alert("✅ FIR Successfully Saved");

    document.getElementById("firInput").value = "";
};
import { db } from "./firebase.js";
import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const form = document.getElementById("crimeForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const data = {
        name: form[0].value,
        mobile: form[1].value,
        email: form[2].value,
        crime: form[3].value,
        date: form[4].value,
        time: form[5].value,
        location: form[6].value,
        description: form[7].value,
        createdAt: new Date()
    };

    try {

        await addDoc(collection(db, "crimeReports"), data);

        alert("✅ Crime Report Submitted Successfully");

        form.reset();

    } catch (error) {

        alert("Error : " + error.message);

    }

});