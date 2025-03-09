"use client";

import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import Popup from '../../../components/popup';
import SubmitPopup from '../../../components/sidybar';
import { db } from "../../firebase"; // Adjust the path
import { doc, updateDoc, arrayUnion, GeoPoint, setDoc, getDoc } from "firebase/firestore";
import { desc } from "framer-motion/client";

const MapComponent = ({ params }) => {
    const [place, setPlace] = useState(params.id !== "current" ? params.id : "");
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [marker, setMarker] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);

    const [setdesc, SetDesc] = useState("");
    const [settype, SetType] = useState("");

    const [descOpen, setdescOpen] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const mapContainerRef = useRef(null);
    const userMarkerRef = useRef(null);
    const markerClusterGroup = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (!mapRef.current && mapContainerRef.current) {
            if (params.id === "current") {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(showPosition, handleError);
                } else {
                    initMap(20.5937, 78.9629);
                }
            } else {
                initMap(20.5937, 78.9629);
                searchPlace(params.id);
            }
        }
    }, [params]);




    function showPosition(position) {
        let x = position.coords.latitude;
        let y = position.coords.longitude;
        initMap(x, y);
        addUserMarker(x, y);
    }

    function handleError(error) {
        console.error("Geolocation error:", error);
        initMap(20.5937, 78.9629);
    }

    function initMap(lat, lng) {
        if (!mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current).setView([lat, lng], 15);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                keepBuffer: 6,
            }).addTo(mapRef.current);

            markerClusterGroup.current = L.markerClusterGroup();
            mapRef.current.addLayer(markerClusterGroup.current);

            mapRef.current.on('click', (e) => addMarker(e));
        } else {
            mapRef.current.setView([lat, lng], 15);
        }
    }




    function addMarker(e) {
        const latlng = e.latlng; // Ensure latlng is properly defined
        const customIcon = L.divIcon({
            className: "custom-marker",
            html: `<div class="bg-red-500 text-white font-bold text-xs flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 border-white">📍</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });
        const newMarker = L.marker(latlng, { icon: customIcon }).addTo(mapRef.current);
        newMarker.on('click', () => {
            setSelectedMarker(latlng);
            setPopupOpen(true);
            setMarker(latlng); // Fixed the setMarker call
        });
        markersRef.current.push(newMarker);
        if (markerClusterGroup.current) {
            markerClusterGroup.current.addLayer(newMarker);
        }
    }



    function storedata(latlng, desc,col) {
        console.log("Storing marker:", latlng, "with descriptions:", desc);
        const markerRef = doc(db, "Markers", "all");
        // Try to update both fields (`all` and `desc`) together
        updateDoc(markerRef, {
            all: arrayUnion(new GeoPoint(latlng.lat, latlng.lng)), // Append GeoPoint
            desc: arrayUnion(desc),
            type: arrayUnion(col), // Add the entire `desc` array as a single entry
        })
        .then(() => {
            console.log("Marker and descriptions updated successfully.");
        })
        .catch(async (error) => {
            if (error.code === "not-found") {
                // If the document doesn't exist, create it with both fields
                await setDoc(markerRef, {
                    all: [new GeoPoint(latlng.lat, latlng.lng)], // Initialize GeoPoints array
                    desc: [desc],
                    type: [col] // Store `desc` as an array of arrays
                });
                console.log("Document created and marker stored successfully.");
            } else {
                console.error("Error storing data:", error);
            }
        });
    }
    


    async function getdata() {
        const markerRef = doc(db, "Markers", "all");
        try {
            const docSnap = await getDoc(markerRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log("Document data:", data);
                if (data.all && data.desc && data.type) {
                    const allMarkers = data.all.map((geoPoint, index) => ({
                        point: geoPoint,
                        desc: data.desc[index],
                        type: data.type[index],
                    }));
                    return allMarkers;
                } else {
                    console.log("One or more fields ('all', 'desc', 'type') are missing in the document!");
                    return [];
                }
            } else {
                console.log("No such document exists in Firestore!");
                return [];
            }
        } catch (error) {
            console.error("Error fetching document:", error);
            return [];
        }
    }
    

    async function loadMarkers() {
        const geoPoints = await getdata();

        if (geoPoints && mapRef.current) {
            geoPoints.forEach(({ point, desc, type }) => {
                const lat = point.latitude;
                const lng = point.longitude;
                const customIcon = L.divIcon({
                    className: "custom-marker",
                    html: `<div class="bg-red-500 text-white font-bold text-xs flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 border-white">📍</div>`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32],
                });
                const marker = L.marker([lat, lng], { icon: customIcon }).addTo(mapRef.current);
                marker.on('click', () => {
                    SetDesc(desc); // Set description
                    SetType(type); // Set type
                    setdescOpen(true); // Open description popup
                });
                markersRef.current.push(marker);
            });
        }
    }

    useEffect(() => {
        if (!mapRef.current && mapContainerRef.current) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const { latitude, longitude } = position.coords;
                    initMap(latitude, longitude);
                    addUserMarker(latitude, longitude);
                    loadMarkers();
                }, handleError);
            } else {
                initMap(20.5937, 78.9629);
                loadMarkers();
            }
        }
    }, []);

    function addUserMarker(x, y) {
        const userIcon = L.divIcon({
            className: "user-marker",
            html: `<div class="bg-blue-500 text-white font-bold text-xs flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 border-white"></div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -32],
        });

        if (mapRef.current) {
            if (userMarkerRef.current) {
                userMarkerRef.current.setLatLng([x, y]);
            } else {
                userMarkerRef.current = L.marker([x, y], { icon: userIcon })
                    .addTo(mapRef.current)
                    .bindPopup("<b>You are here</b>");
                userMarkerRef.current.on("click", () => {
                    mapRef.current.setView([x, y], 15);
                });
            }
        }
    }

    const searchPlace = async (query) => {
        if (!mapRef.current || !query) return;

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
            );
            const data = await response.json();

            if (data.length > 0) {
                const { lat, lon } = data[0];
                mapRef.current.setView([lat, lon], 10);
                addMarker({ lat, lng: lon });
            } else {
                alert("Location not found!");
            }
        } catch (error) {
            console.error("Error searching for place:", error);
        }
    };

    useEffect(() => {
        if (params.id !== "current") {
            if (!place) return;
            if (searchTimeout) clearTimeout(searchTimeout);

            const timeout = setTimeout(() => {
                searchPlace(place);
            }, 500);

            setSearchTimeout(timeout);
            return () => clearTimeout(timeout);
        }
    }, [place, params.id]);

    return (
        <div className="w-full h-screen relative">
            {params.id !== "current" && (
                <input
                    type="text"
                    placeholder="Search for a place"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    className="absolute top-5 left-5 p-2 bg-white border rounded-md z-50"
                />
            )}
            <div ref={mapContainerRef} className="w-full h-full" id="map"></div>

            {popupOpen && (
                <Popup
                    onClose={() => setPopupOpen(false)}
                    onsubmit={(desc,col) => {
                        if (marker) {
                            storedata(marker,desc,col);
                            setPopupOpen(false);
                        }
                    }}
                />
            )}
            {descOpen && (
                <SubmitPopup
                    onClose={() => setdescOpen(false)}
                    desc={setdesc} // Pass only the description value
                    type={settype} // Pass only the type value
                />
            )}

        </div>
    );
};

export default MapComponent;
