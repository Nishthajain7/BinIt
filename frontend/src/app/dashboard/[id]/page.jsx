"use client";
import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import axios from 'axios';
import Popup from '../../../components/popup';
import { db } from "../../firebase"; // Adjust the path
import { doc, updateDoc, arrayUnion, GeoPoint, setDoc, getDoc } from "firebase/firestore";

const MapComponent = ({ params }) => {
    const [place, setPlace] = useState(params.id !== "current" ? params.id : "");
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
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
        const customIcon = L.divIcon({
            className: "custom-marker",
            html: `<div class="bg-red-500 text-white font-bold text-xs flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 border-white">📍</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });

        const newMarker = L.marker(e.latlng, { icon: customIcon }).addTo(mapRef.current);
        newMarker.on('click', () => {
            setSelectedMarker(e.latlng);
            setPopupOpen(true);
        });
        storedata(e.latlng);
        markersRef.current.push(newMarker);
        setMarkers([...markersRef.current]);
        markerClusterGroup.current.addLayer(newMarker);
    }

    function storedata(latlng) {
        console.log(latlng);
        const markerRef = doc(db, "Markers", "all");
        updateDoc(markerRef, {
            all: arrayUnion(new GeoPoint(latlng.lat, latlng.lng))
        }).catch(async (error) => {
            if (error.code === "not-found") {
                await setDoc(markerRef, {
                    all: [new GeoPoint(latlng.lat, latlng.lng)]
                });
                console.log("Done");
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
                if (data.all) {
                    const allMarkers = data.all;
                    return allMarkers;
                } else {
                    console.log("'all' array not found in the document!");
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
            geoPoints.forEach((geoPoint) => {
                const lat = geoPoint.latitude;
                const lng = geoPoint.longitude;
                const customIcon = L.divIcon({
                    className: "custom-marker",
                    html: `<div class="bg-red-500 text-white font-bold text-xs flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 border-white">📍</div>`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32]
                });
                const marker = L.marker([lat, lng], { icon: customIcon }).addTo(mapRef.current);
                markersRef.current.push(marker);
            });

            setMarkers([...markersRef.current]);
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
                const { lat, lon, display_name } = data[0];

                mapRef.current.setView([lat, lon], 10);

                markersRef.current.forEach(marker => mapRef.current.removeLayer(marker));
                markersRef.current = [];

                const newMarker = L.marker([lat, lon])
                    .addTo(mapRef.current)
                    .bindPopup(display_name)
                    .openPopup();

                markersRef.current.push(newMarker);
                setMarkers([...markersRef.current]);
                
                if (markerClusterGroup.current) {
                    markerClusterGroup.current.addLayer(newMarker);
                }
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

            {popupOpen && <Popup onClose={() => setPopupOpen(false)} />}
        </div>
    );
};

export default MapComponent;
