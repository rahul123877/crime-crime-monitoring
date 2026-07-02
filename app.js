import { db } from "./firebase.js";

import {
    addDoc,
    collection
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Live Date & Time
// ===============================

function updateDateTime() {

    const now = new Date();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    const date = now.toLocaleDateString("en-IN", options);

    const time = now.toLocaleTimeString();

    const dateElement = document.getElementById("date");
    const timeElement = document.getElementById("time");

    if (dateElement) dateElement.innerHTML = date;
    if (timeElement) timeElement.innerHTML = time;

}

setInterval(updateDateTime, 1000);

updateDateTime();
// Dashboard Counter

function counter(id, target) {

    let count = 0;

    let speed = target / 100;

    let interval = setInterval(() => {

        count += Math.ceil(speed);

        if (count >= target) {

            count = target;

            clearInterval(interval);

        }

        let element = document.getElementById(id);

        if (element) {

            element.innerHTML = count;

        }

    }, 20);

}

counter("totalCrime", 1524);

counter("solvedCase", 1280);

counter("pendingCase", 244);

counter("aiAlert", 18);

// ===============================
// Dark / Light Mode
// ===============================

const themeBtn = document.getElementById("themeBtn");

if (themeBtn) {

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("light-mode");

        if (document.body.classList.contains("light-mode")) {

            themeBtn.innerHTML = "🌞 Light Mode";

        } else {

            themeBtn.innerHTML = "🌙 Dark Mode";

        }

    });

}
const bell = document.querySelector(".notification");
const panel = document.getElementById("notificationPanel");

if (bell && panel) {

    bell.addEventListener("click", () => {

        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }

    });

}
// ===============================
// Crime Report Save in Firebase
// ===============================

const reportForm = document.getElementById("crimeForm");

if (reportForm) {

    reportForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const data = {

            name: document.getElementById("name").value,

            mobile: document.getElementById("mobile").value,

            email: document.getElementById("email").value,

            crime: document.getElementById("crime").value,

            date: document.getElementById("crimeDate").value,

            time: document.getElementById("crimeTime").value,

            location: document.getElementById("location").value,

            description: document.getElementById("description").value,

            createdAt: new Date()

        };

        try {

            await addDoc(collection(db, "crimeReports"), data);

            alert("✅ Crime Report Submitted Successfully");

            reportForm.reset();

        }

        catch (error) {

            console.log(error);

            alert("❌ Error Saving Report");

        }

    });

}