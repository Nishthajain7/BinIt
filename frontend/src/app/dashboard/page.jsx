'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaArrowRight } from "react-icons/fa";
import { useRouter, useSearchParams } from 'next/navigation';

const MapComponent = () => {
    const [map, setMap] = useState(null);
    const [search, setSearch] = useState('');
   
    const searchParams = useSearchParams();
    const name = searchParams.get('name');

    

    useEffect(() => {
        if (typeof window !== 'undefined' && L) {
            const mapContainer = document.getElementById('map');
            if (mapContainer) {
                if (!mapContainer._leaflet_id) {
                    const map = L.map(mapContainer, {
                        center: [20.5937, 78.9629],
                        zoom: 12,
                        zoomControl: false,
                        dragging: false, // Prevent user dragging
                        scrollWheelZoom: false,
                        doubleClickZoom: false,
                        boxZoom: false,
                        keyboard: false,
                        fadeAnimation: true,
                        scrollWheelZoom: true,
                    });

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                        keepBuffer: 6,
                        updateWhenIdle: false,
                    }).addTo(map);

                    // Function to smoothly pan the map indefinitely
                    function startInfinitePan() {
                        setInterval(() => {
                            map.panBy([200000, 0], { animate: true, duration: 10000 }); // Move right smoothly
                        }, 1000); // Change position every second
                    }

                    startInfinitePan(); // Start the smooth panning
                }
            }
        }

        if (name === 'current' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, handleError);
        } else if (name) {
            searchPlace(name);
        }
    }, [name]);

    const showPosition = (position) => {
        const x = position.coords.latitude;
        const y = position.coords.longitude;
        initMap(x, y);
        addUserMarker(x, y);
    };

    const handleError = (error) => {
        console.error('Geolocation error:', error);
        initMap(20.5937, 78.9629);
    };

    const initMap = (lat, lng) => {
        const mapContainer = document.getElementById('map');
        if (!mapContainer._leaflet_id) {
            const map = L.map(mapContainer).setView([lat, lng], 15);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);

            const userIcon = L.divIcon({
                className: 'user-marker',
                html: `<div class="bg-blue-500 text-white font-bold text-xs flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 border-white"></div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16],
                popupAnchor: [0, -32],
            });

            L.marker([lat, lng], { icon: userIcon }).addTo(map).bindPopup('<b>You are here</b>');
        } else {
            map.setView([lat, lng], 15);
        }
    };

    const addUserMarker = (lat, lng) => {
        const userIcon = L.divIcon({
            className: 'user-marker',
            html: `<div class="bg-blue-500 text-white font-bold text-xs flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 border-white"></div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -32],
        });

        L.marker([lat, lng], { icon: userIcon }).addTo(map).bindPopup('<b>You are here</b>');
    };

    const searchPlace = async (query) => {
        if (!map || !query) return;

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
            );
            const data = await response.json();

            if (data.length > 0) {
                const { lat, lon, display_name } = data[0];
                initMap(lat, lon);

                L.marker([lat, lon])
                    .addTo(map)
                    .bindPopup(display_name)
                    .openPopup();
            } else {
                alert('Location not found!');
            }
        } catch (error) {
            console.error('Error searching for place:', error);
        }
    };

    return (
        <div className="relative w-full h-screen">
            <div className="absolute inset-0" id="map"></div>

            {/* Container for heading */}
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 text-3xl font-bold text-black">
                <h1 className="text-5xl">BinIt</h1>
                <span className="text-black">|</span>
                <h1>Username</h1>
            </div>
            <div className="absolute top-10 right-40 flex items-center">
                <Link href="/dashboard/current" className="bg-blue-500 w-48 h-16 rounded-2xl flex items-center hover:scale-105 hover:shadow-2xl justify-center shadow-lg px-4 text-white text-sm font-semibold gap-2">
                    <p>Your current location</p>
                    <div className="bg-white w-8 h-8 rotate-45 flex items-center justify-center rounded-md">
                        <FaArrowRight className="-rotate-45 text-blue-500" size={18} />
                    </div>
                </Link>
            </div>

            <p className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-transparent bg-opacity-100 backdrop-blur-md p-6 rounded-2xl shadow-lg w-full max-w-md text-black">
                A collaborative waste management initiative designed to make cities cleaner through community participation. Users can mark locations with trash, and volunteers or waste collectors can pick it up to earn rewards. By integrating maps, location tracking, and a points-based incentive system, BinIt encourages responsible waste disposal and fosters a cleaner, greener environment.
            </p>

            <SearchForm setSearch={setSearch} search={search}  />
        </div>
    );
};

const SearchForm = ({ setSearch, search, handleNavigate }) => {
    return (
        <form  className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-2xl shadow-lg w-full max-w-md max-h-[400px] overflow-hidden">

            <p className="text-2xl font-semibold tracking-tighter text-start text-gray-900">ENTER</p>
            <p className="text-2xl font-semibold tracking-tighter text-start -mt-2 text-gray-900">DETAILS</p>

            <div className="flex flex-col w-full mt-4">
                <label className="text-lg font-medium text-gray-800">Location:</label>
                <input
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    id="location"
                    placeholder="Enter location"
                    required
                    type="text"
                    className="bg-white w-full p-2 border-b border-gray-400 focus:outline-none focus:border-black"
                />
            </div>

            <div className="flex flex-col w-full mt-4">
                <label className="text-lg font-medium text-gray-800">What are you looking for?</label>
                <textarea
                    id="desc"
                    placeholder="Waste category"
                    className="bg-white w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:border-black h-24 resize-none"
                />
            </div>

		<Link href={`/dashboard/${search}`} type="submit" className="bg-black text-white font-medium text-lg rounded-xl w-full py-3 mt-6 hover:bg-gray-900 transition">
                SEARCH
            </Link>
        </form>
    );
};

export default MapComponent;
