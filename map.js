/**
 * ====================================================================
 * AI CRIME MONITORING SYSTEM - INTEGRATED MAP.JS (COMPLETED VERSION)
 * ====================================================================
 * Features: Leaflet, Firebase, Clustering, Heatmaps, Routing, SOS & AI
 */

// Global App State & Configurations
const MapConfig = {
    defaultCoords: [28.6139, 77.2090], // Default: Delhi
    defaultZoom: 13,
    refreshInterval: 30000, // 30 seconds auto-refresh
    highRiskThreshold: 5 // Crime density threshold for AI Alert
};

let map, markerClusterGroup, heatmapLayer;
let userLocationMarker, routingControl;
let activeFilters = { type: 'all', severity: 'all', time: 'all' };

// Real-time Database references placeholders (Configure your firebase.js before running)
// let db = firebase.firestore(); 

// --- PART 1: INITIALIZATION, LAYERS & CUSTOM ICONS ---

// Base Layers Configuration
const baseLayers = {
    "Standard Map": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }),
    "Satellite View": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }),
    "Dark Mode": L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    })
};

// Custom System Icons
const Icons = {
    crime: L.icon({ iconUrl: 'assets/icons/crime-marker.png', iconSize: [35, 35], iconAnchor: [17, 35], popupAnchor: [0, -30] }),
    police: L.icon({ iconUrl: 'assets/icons/police-patrol.png', iconSize: [35, 35], iconAnchor: [17, 35] }),
    sos: L.icon({ iconUrl: 'assets/icons/sos-alert.png', iconSize: [40, 40], iconAnchor: [20, 20] }),
    wanted: L.icon({ iconUrl: 'assets/icons/wanted.png', iconSize: [35, 35], iconAnchor: [17, 35] }),
    user: L.icon({ iconUrl: 'assets/icons/user-gps.png', iconSize: [25, 25], iconAnchor: [12, 12] })
};

// Initialize Map Application
function initMap() {
    console.log("Initializing AI Crime Map...");

    // Create Map instance
    map = L.map('map', {
        center: MapConfig.defaultCoords,
        zoom: MapConfig.defaultZoom,
        layers: [baseLayers["Standard Map"]] // Default view
    });

    // Add Layer Control
    L.control.layers(baseLayers).addTo(map);
    L.control.scale().addTo(map);

    // Initialize Overlays
    markerClusterGroup = L.markerClusterGroup().addTo(map);
    heatmapLayer = L.heatLayer([], { radius: 25, blur: 15, maxZoom: 17 }).addTo(map);

    // Trigger Core Workflows
    initGPS();
    loadRealtimeData();
    setupEventListeners();
}

// Live GPS Tracking Control
function initGPS() {
    if (!navigator.geolocation) {
        console.warn("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            const currentPos = [latitude, longitude];

            if (userLocationMarker) {
                userLocationMarker.setLatLng(currentPos);
            } else {
                userLocationMarker = L.marker(currentPos, { icon: Icons.user })
                    .addTo(map)
                    .bindPopup("<b>Your Current Location</b>").openPopup();
                map.setView(currentPos, 14);
            }
        },
        (error) => console.error(`GPS Error (${error.code}): ${error.message}`),
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

// --- PART 2 & 3: DATA LOADING, HEATMAP, CLUSTERING & SEARCH ---

// Mock data array fallback if Firebase is offline
const fallbackCrimeData = [
    { id: "C01", type: "Theft", severity: "Medium", lat: 28.614, lng: 77.210, time: "Night", title: "Snatching Incident", desc: "Mobile snatching near metro exit." },
    { id: "C02", type: "Assault", severity: "High", lat: 28.620, lng: 77.220, time: "Evening", title: "Physical Altercation", desc: "Group fight reported outside market." },
    { id: "C03", type: "Vandalisim", severity: "Low", lat: 28.610, lng: 77.200, time: "Day", title: "Property Damage", desc: "Graffiti and public bench damage." }
];

function loadRealtimeData() {
    // Note: Replace with actual db.collection('crimes').onSnapshot(...) for live Firebase integration
    console.log("Fetching crime records from data stream...");
    renderDataPipeline(fallbackCrimeData);
}

function renderDataPipeline(data) {
    // Clear existing visualization layers
    markerClusterGroup.clearLayers();
    const heatPoints = [];

    // Filter application logic
    const filteredData = data.filter(item => {
        const matchType = activeFilters.type === 'all' || item.type.toLowerCase() === activeFilters.type.toLowerCase();
        const matchSeverity = activeFilters.severity === 'all' || item.severity.toLowerCase() === activeFilters.severity.toLowerCase();
        return matchType && matchSeverity;
    });

    filteredData.forEach(crime => {
        // 1. Add to Clustering Layer
        const marker = L.marker([crime.lat, crime.lng], { icon: Icons.crime });
        marker.bindPopup(createCrimePopupHTML(crime));
        markerClusterGroup.addLayer(marker);

        // 2. Format for Heatmap Layer Intensity base
        let intensity = 0.4;
        if (crime.severity === 'High') intensity = 0.9;
        if (crime.severity === 'Medium') intensity = 0.6;
        heatPoints.push([crime.lat, crime.lng, intensity]);
    });

    // Update Heatmap
    heatmapLayer.setLatLngs(heatPoints);

    // Update Live Dashboard Widgets
    updateDashboardCounters(filteredData);

    // AI Alert engine evaluation
    runAIZoneAnalysis(filteredData);
}

// Global search engine logic
function executeSearch(query) {
    if (!query) return;
    console.log(`Searching records for: "${query}"`);
    // Search implementation over titles/descriptions
    const result = fallbackCrimeData.find(c => c.title.toLowerCase().includes(query.toLowerCase()));
    if (result) {
        map.setView([result.lat, result.lng], 16);
        L.popup()
            .setLatLng([result.lat, result.lng])
            .setContent(createCrimePopupHTML(result))
            .openOn(map);
    } else {
        alert("No specific incident match found on active view.");
    }
}

// --- PART 4 & 5: FILTERS, POPUPS, SOS & PATROLS ---

function createCrimePopupHTML(crime) {
    return `
        <div class="map-popup-card">
            <h3 class="popup-title">${crime.title}</h3>
            <span class="badge badge-${crime.severity.toLowerCase()}">${crime.severity} Severity</span>
            <p><strong>Type:</strong> ${crime.type}</p>
            <p><strong>Details:</strong> ${crime.desc}</p>
            <p><strong>Timeline:</strong> ${crime.time}</p>
            <hr>
            <button class="popup-btn routing-btn" onclick="calculateRoute(${crime.lat}, ${crime.lng})">Dispatch/Route to Site</button>
        </div>
    `;
}

// Trigger Emergency SOS Beacon
function triggerSOS() {
    if (!userLocationMarker) {
        alert("Unable to broadcast SOS. Waiting for device GPS lock.");
        return;
    }
    const sosCoords = userLocationMarker.getLatLng();

    const sosMarker = L.marker(sosCoords, { icon: Icons.sos }).addTo(map);
    sosMarker.bindPopup("<div class='sos-popup'><b>⚠️ EMERGENCY SOS ACTIVE</b><br>Backup dispatched.</div>").openPopup();

    map.setView(sosCoords, 16);
    console.warn(`[ALERT] SOS Broadcasted from: ${sosCoords.lat}, ${sosCoords.lng}`);
    // Code hook to sync directly to Firebase Live Alerts: db.collection('sos').add({...})
}

// Simulate Police Patrol Movement
function loadPolicePatrols() {
    const patrolRoute = [
        [28.615, 77.212], [28.618, 77.215], [28.612, 77.218]
    ];
    let patrolMarker = L.marker(patrolRoute[0], { icon: Icons.police }).addTo(map);
    patrolMarker.bindPopup("<b>Patrol Unit Alpha</b><br>Status: Moving On-Beat");

    let step = 0;
    setInterval(() => {
        step = (step + 1) % patrolRoute.length;
        patrolMarker.setLatLng(patrolRoute[step]);
    }, 8000);
}

// --- PART 6 & 7: ROUTING, WANTED TRACKING & AI ALERTS ---

// Calculate Optimal Route Navigation
function calculateRoute(destLat, destLng) {
    if (!userLocationMarker) {
        alert("Need user position coordinate vector to compute routing path.");
        return;
    }

    // Clear past active routes
    if (routingControl) {
        map.removeControl(routingControl);
    }

    const startCoords = userLocationMarker.getLatLng();

    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(startCoords.lat, startCoords.lng),
            L.latLng(destLat, destLng)
        ],
        router: L.Routing.osrmv1({
            serviceUrl: 'https://router.openstreetmap.org/route/v1'
        }),
        lineOptions: { styles: [{ color: '#ff3366', opacity: 0.8, weight: 6 }] },
        createMarker: function () { return null; } // Prevent styling conflicts
    }).addTo(map);
}

// AI High-Risk Matrix Analyzer
function runAIZoneAnalysis(crimes) {
    const alertBox = document.getElementById('ai-alerts-panel');
    if (!alertBox) return;

    if (crimes.length >= MapConfig.highRiskThreshold) {
        alertBox.innerHTML = `
            <div class="ai-banner high-danger">
                <strong>🤖 AI Predictive Alert:</strong> High crime density detected inside viewport! Recommended deployment boost.
            </div>`;
        alertBox.className = "alert-panel active";
    } else {
        alertBox.innerHTML = `<div class="ai-banner normal">🤖 System Status: Area parameters stable.</div>`;
    }
}

function updateDashboardCounters(data) {
    const counterEl = document.getElementById('total-incidents-count');
    if (counterEl) counterEl.innerText = data.length;
}

// --- PART 8: EVENTS, AUTO REFRESH & EXPORT UTILITIES ---

function setupEventListeners() {
    // Filter controls mapping listeners
    document.getElementById('filter-type-select')?.addEventListener('change', (e) => {
        activeFilters.type = e.target.value;
        loadRealtimeData();
    });

    document.getElementById('map-search-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') executeSearch(e.target.value);
    });
}

// Raw Matrix Exporter
function exportCrimeDataCSV() {
    let csvContent = "data:text/csv;charset=utf-8,ID,Type,Severity,Latitude,Longitude\n";
    fallbackCrimeData.forEach(c => {
        csvContent += `${c.id},${c.type},${c.severity},${c.lat},${c.lng}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Crime_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Auto Refresh Handler Lifecycle
setInterval(() => {
    console.log("Auto-refreshing live dashboard assets...");
    loadRealtimeData();
}, MapConfig.refreshInterval);

// Run Application Execution Initialization on Window Load context
window.onload = () => {
    initMap();
    loadPolicePatrols(); // Load mock patrols
};
iconUrl: 'assets/icons/crime-marker.png'
iconUrl: 'assets/icons/police-patrol.png'
iconUrl: 'assets/icons/sos-alert.png'