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
import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
// ===============================
// Login Check
// ===============================

if (window.location.pathname.includes("dashboard.html")) {

    onAuthStateChanged(auth, (user) => {

        if (!user) {

            window.location = "login.html";

        }

    });

}
const logout = document.getElementById("logoutBtn");

if (logout) {

    logout.addEventListener("click", async () => {

        await signOut(auth);

        alert("Logout Successful");

        window.location = "login.html";

    });

}
function liveSearch() {
    let input = document.getElementById("searchBox").value.toLowerCase();
    let table = document.querySelector("table");
    let tr = table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) {
        let text = tr[i].innerText.toLowerCase();

        if (text.includes(input)) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}
import { db } from "./firebase.js";
import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const crimeForm = document.getElementById("crimeForm");

if (crimeForm) {

    crimeForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const name = document.getElementById("name").value;
        const crime = document.getElementById("crimeType").value;
        const location = document.getElementById("location").value;

        await addDoc(collection(db, "reports"), {
            name,
            crime,
            location,
            time: new Date()
        });

        alert("Report Submitted");

        crimeForm.reset();

    });

}
function predictCrime() {

    const level = document.getElementById("crimeLevel").value;

    const result = document.getElementById("result");

    if (level === "high") {
        result.innerHTML = "⚠ High Crime Risk Area";
    }
    else if (level === "medium") {
        result.innerHTML = "⚡ Medium Risk Area";
    }
    else {
        result.innerHTML = "✅ Safe Area";
    }

}
const ctx = document.getElementById("crimeChart");

if (ctx) {

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Theft", "Murder", "Cyber", "Kidnap"],
            datasets: [{
                label: "Crime Reports",
                data: [120, 40, 90, 30]
            }]
        }
    });

}
function sendMessage(async function sendMessage() {

    const input = document.getElementById("userInput").value;

    const chatBox = document.getElementById("chatBox");

    chatBox.innerHTML += `
<div class="message user">${input}</div>
`;

    const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer YOUR_OPENAI_API_KEY"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are an AI Police Crime Assistant."
                    },
                    {
                        role: "user",
                        content: input
                    }
                ]
            })
        }
    );

    const data = await response.json();

    const reply = data.choices[0].message.content;

    chatBox.innerHTML += `
<div class="message ai">${reply}</div>
`;

    document.getElementById("userInput").value = "";

}) {

    let input = document.getElementById("userInput").value;
    let chatBox = document.getElementById("chatBox");

    chatBox.innerHTML += `<div class="message user">${input}</div>`;

    let reply = "I am AI Police Assistant";

    if (input.toLowerCase().includes("crime")) {
        reply = "Please report crime immediately.";
    }

    chatBox.innerHTML += `<div class="message ai">${reply}</div>`;

    document.getElementById("userInput").value = "";

}
function initMap() {

    const center = {
        lat: 26.8467,
        lng: 80.9462
    };

    const map = new google.maps.Map(
        document.getElementById("map"),
        {
            zoom: 8,
            center: center
        }
    );

    const crimes = [
        { lat: 26.8467, lng: 80.9462 },
        { lat: 26.4499, lng: 80.3319 },
        { lat: 28.5355, lng: 77.3910 }
    ];

    crimes.forEach((crime) => {

        new google.maps.Marker({
            position: crime,
            map: map,
            title: "Crime Area"
        });

    });

}
import { db } from "./firebase.js";

import {
    collection,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const reportTable = document.getElementById("reportTable");

if (reportTable) {

    onSnapshot(collection(db, "reports"), (snapshot) => {

        reportTable.innerHTML = "";

        snapshot.forEach((doc) => {

            let data = doc.data();

            reportTable.innerHTML += `
<tr>
<td>${data.name}</td>
<td>${data.crime}</td>
<td>${data.location}</td>
<td>${new Date(data.time.seconds * 1000).toLocaleString()}</td>
</tr>
`;

        });

    });

}
import {
    doc,
    deleteDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { storage } from "./firebase.js";

import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";
const criminalList = document.getElementById("criminalList");

if (criminalList) {

    onSnapshot(collection(db, "criminals"), (snapshot) => {

        criminalList.innerHTML = "";

        snapshot.forEach((doc) => {

            let data = doc.data();

            criminalList.innerHTML += `
<div class="suspect-card">
<img src="${data.image}">
<h2>${data.name}</h2>
<p>${data.crime}</p>
</div>
`;

        });

    });

}
const criminalForm = document.getElementById("criminalForm");

if (criminalForm) {

    criminalForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const name = document.getElementById("criminalName").value;
        const crime = document.getElementById("criminalCrime").value;
        const image = document.getElementById("criminalImage").files[0];

        const storageRef = ref(storage, "criminals/" + image.name);

        await uploadBytes(storageRef, image);

        const imageURL = await getDownloadURL(storageRef);

        await addDoc(collection(db, "criminals"), {
            name,
            crime,
            image: imageURL
        });

        alert("Criminal Added");

        criminalForm.reset();

    });

}
const sosBtn = document.getElementById("sosBtn");

if (sosBtn) {

    sosBtn.addEventListener("click", () => {

        navigator.geolocation.getCurrentPosition(async (position) => {

            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            await addDoc(collection(db, "sos"), {
                latitude: lat,
                longitude: lng,
                time: new Date(),
                status: "Emergency"
            });

            document.getElementById("sosStatus").innerHTML =
                "🚨 SOS Sent Successfully";

        });

    });

}
const sosTable = document.getElementById("sosTable");

if (sosTable) {

    onSnapshot(collection(db, "sos"), (snapshot) => {

        sosTable.innerHTML = "";

        snapshot.forEach((doc) => {

            let data = doc.data();

            sosTable.innerHTML += `
<tr>
<td>${data.latitude}</td>
<td>${data.longitude}</td>
<td>${data.status}</td>
</tr>
`;

        });

    });

}
async function sendMessage() {

    const input = document.getElementById("userInput").value;

    const chatBox = document.getElementById("chatBox");

    chatBox.innerHTML += `
<div class="message user">${input}</div>
`;

    const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer YOUR_OPENAI_API_KEY"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are an AI Police Crime Assistant."
                    },
                    {
                        role: "user",
                        content: input
                    }
                ]
            })
        }
    );

    const data = await response.json();

    const reply = data.choices[0].message.content;

    chatBox.innerHTML += `
<div class="message ai">${reply}</div>
`;

    document.getElementById("userInput").value = "";

}
const crimeChart = document.getElementById("crimeTypeChart");

if (crimeChart) {

    new Chart(crimeChart, {
        type: "pie",
        data: {
            labels: ["Theft", "Robbery", "Murder", "Cyber Crime"],
            datasets: [{
                data: [40, 25, 15, 20]
            }]
        }
    });

}
const caseChart = document.getElementById("caseStatusChart");

if (caseChart) {

    new Chart(caseChart, {
        type: "doughnut",
        data: {
            labels: ["Solved", "Pending"],
            datasets: [{
                data: [70, 30]
            }]
        }
    });

}
const monthlyChart = document.getElementById("monthlyCrimeChart");

if (monthlyChart) {

    new Chart(monthlyChart, {
        type: "line",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [{
                label: "Crime Reports",
                data: [10, 15, 20, 12, 30, 18]
            }]
        }
    });

} async function loadDashboard() {
    const querySnapshot = await getDocs(collection(db, "crimeReports"));

    let total = querySnapshot.size;
    let solved = 0;
    let pending = 0;

    allCrimes = [];

    const table = document.getElementById("crimeTable");
    table.innerHTML = "";

    querySnapshot.forEach((doc) => {
        const data = doc.data();

        allCrimes.push({
            id: doc.id,
            ...data
        });

        if (data.status === "Solved") solved++;
        else pending++;

        table.innerHTML += `
            <tr>
                <td>${doc.id}</td>
                <td>${data.crimeType}</td>
                <td>${data.location}</td>
                <td>${data.status}</td>
            </tr>
        `;
    });

    document.getElementById("totalCrime").innerText = total;
    document.getElementById("solvedCase").innerText = solved;
    document.getElementById("pendingCase").innerText = pending;
    document.getElementById("aiAlert").innerText = pending;
}
window.liveSearch = function () {
    const searchValue = document
        .getElementById("searchBox")
        .value
        .toLowerCase();

    const table = document.getElementById("crimeTable");
    table.innerHTML = "";

    const filtered = allCrimes.filter(crime =>
        crime.crimeType.toLowerCase().includes(searchValue) ||
        crime.location.toLowerCase().includes(searchValue) ||
        crime.id.toLowerCase().includes(searchValue)
    );

    filtered.forEach(crime => {
        table.innerHTML += `
            <tr>
                <td>${crime.id}</td>
                <td>${crime.crimeType}</td>
                <td>${crime.location}</td>
                <td>${crime.status}</td>
            </tr>
        `;
    });
};
await addDoc(collection(db, "crimeReports"), {
    fullName,
    mobile,
    email,
    crimeType,
    location,
    description,
    latitude,
    longitude,
    status: "Pending",
    createdAt: new Date()
});
// ==========================
// CRIME HEAT MAP
// ==========================

const map = L.map('map').setView([26.8467, 80.9462], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Demo Crime Data (Lucknow Area)
const crimeData = [
    [26.8467, 80.9462, 1.0],
    [26.8500, 80.9400, 0.8],
    [26.8400, 80.9500, 0.7],
    [26.8600, 80.9550, 0.9],
    [26.8450, 80.9300, 0.6]
];

L.heatLayer(crimeData, {
    radius: 30,
    blur: 20,
    maxZoom: 17
}).addTo(map);
async function updateTopWeather() {
    const apiKey = '9bec9a103cc0cd6c3521d75b2c2c041d';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Lucknow&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const temp = Math.round(data.main.temp);

        // 
        document.getElementById('tempText').innerText = `${temp}°C • Lucknow`;
    } catch (error) {
        document.getElementById('tempText').innerText = "Weather N/A";
    }
}

updateTopWeather();
document.getElementById("loginForm").addEventListener("submit", function (e) {

    e.preventDefault();

    let id = document.getElementById("policeId").value;
    let pass = document.getElementById("password").value;

    if (id === "RAHUL" && pass === "7607784267") {

        alert("Login Successful 🚔");

        localStorage.setItem("policeUser", "RAHUL");

        window.location.href = "dashboard.html";

    } else {

        alert("Invalid Police ID or Password ❌");

    }

});
const criminalList = document.getElementById("criminalList");

if (criminalList) {
    onSnapshot(collection(db, "criminals"), (snapshot) => {
        criminalList.innerHTML = "";

        snapshot.forEach((doc) => {
            let data = doc.data();

            criminalList.innerHTML += `
            <div class="suspect-card">
                <img src="${data.image}" alt="${data.name}">
                <h3>${data.name}</h3>
                <p><strong>Crime:</strong> ${data.crime}</p>
                <p><strong>Status:</strong> Wanted</p>
            </div>
            `;
        });
    });
}
let map;
let userMarker;

function initMap() {

    const defaultLocation = { lat: 28.6139, lng: 77.2090 }; // Delhi

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: defaultLocation
    });

    userMarker = new google.maps.Marker({
        position: defaultLocation,
        map: map,
        title: "Police Vehicle"
    });
}

// 📍 Live GPS Tracking
function findNearestPolice() {

    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(function (position) {

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const userPos = { lat, lng };

        map.setCenter(userPos);
        userMarker.setPosition(userPos);

        document.getElementById("nearestStation").innerText =
            `Nearest Station Found near Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;

        // Fake live update for vehicles
        document.getElementById("loc1").innerText = "Location: Nearby Area Tracking...";
        document.getElementById("loc2").innerText = "Location: Sector Movement Detected";

    }, function (error) {
        alert("Location access denied");
    }, {
        enableHighAccuracy: true
    });
}