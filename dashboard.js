import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    query,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

async function loadDashboard() {

    const snapshot = await getDocs(collection(db, "crimeReports"));

    document.getElementById("totalCrime").innerHTML = snapshot.size;

    let table = document.getElementById("recentReports");

    table.innerHTML = "";

    const q = query(
        collection(db, "crimeReports"),
        orderBy("createdAt", "desc"),
        limit(10)
    );

    const docs = await getDocs(q);

    docs.forEach((doc) => {

        const d = doc.data();

        table.innerHTML += `

<tr>

<td>${d.name}</td>

<td>${d.crime}</td>

<td>${d.location}</td>

<td>${d.date}</td>

</tr>

`;

    });

}

loadDashboard();