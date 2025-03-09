'use client';

import React, { useState } from 'react';
import { IoMdClose } from "react-icons/io";


function SubmitPopup({ onClose , desc , type }) {
  const [selectedColor, setSelectedColor] = useState(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleRemoveFile = () => {
    setFile(null);
    document.getElementById('fileUpload').value = ''; // Reset input field
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-lg z-50">
      <div className="relative w-96 bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center border border-gray-300">
        
        {/* Image Section */}
        <img
          className="rounded-2xl w-full object-cover h-48"
          src="https://static.vecteezy.com/system/resources/previews/008/086/278/non_2x/plastic-trash-bin-bags-of-garbage-on-the-pavement-in-park-clean-environment-concept-free-photo.jpg"
          alt="Garbage on pavement"
        />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-700 bg-gray-200 hover:bg-red-500 hover:text-white transition-all duration-300"
        >
          <IoMdClose size={24} />
        </button>
  
        {/* Type Section with Dynamic Styling */}
        <span
          className={`px-4 py-2 rounded-full text-white text-sm font-semibold mt-4 ${
            type === "yellow" ? "bg-yellow-500" :
            type === "red" ? "bg-red-500" :
            type === "green" ? "bg-green-500" :
            "bg-gray-300"
          }`}
        >
          {type === "yellow" ? "Organic" :
           type === "red" ? "Hazardous" :
           type === "green" ? "Recyclable" :
           "Unknown"}
        </span>
  
        {/* Description Section */}
        <h2 className="text-lg font-medium text-gray-800 mt-4">Description:</h2>
        <p className="text-center font-medium text-green-800 text-md mt-2 px-4">
          {desc}
        </p>
  
        {/* Cleaned Up Button */}
        <button
          onClick={() => console.log('Cleaned up!')}
          className="mt-6 bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-all duration-300"
        >
          Cleaned Up
        </button>
      </div>
    </div>
  );
  
  
}

export default SubmitPopup;