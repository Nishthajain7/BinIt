'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { heroDetails } from "@/data/hero";
import Link from "next/link";

const Hero: React.FC = () => {
  const [points, setPoints] = useState<{ x: number; y: number; delay: number }[]>([]);
  const locationPoints = [
    // North America (Shifted more to the left)
    { x: 15, y: 15 }, { x: 18, y: 18 }, { x: 22, y: 22 },
    
    // South America (Shifted more to the left)
    { x: 25, y: 50 }, { x: 28, y: 58 }, { x: 30, y: 65 },
    
    // Europe (Unchanged)
    { x: 55, y: 15 }, { x: 60, y: 18 }, { x: 53, y: 20 },
    
    // Africa (Unchanged)
    { x: 48, y: 35 }, { x: 45, y: 42 }, { x: 50, y: 48 },
  
    // Asia (Unchanged)
    { x: 65, y: 20 }, { x: 70, y: 25 }, { x: 75, y: 30 },
  
    // Australia (Unchanged)
    { x: 78, y: 70 }, { x: 82, y: 75 }, { x: 80, y: 80 },
  
    // Polar regions (Unchanged)
    { x: 50, y: 5 }, // Arctic
    { x: 50, y: 95 }, // Antarctic
  ]
  

  useEffect(() => {
    // Shuffle and add random delays for staggered animations
    const randomizedPoints = locationPoints.map((point) => ({
      ...point,
      delay: Math.random() * 2, // Random delay between 0 and 2 seconds
    }));
    setPoints(randomizedPoints);
  }, []);

  return (
    <section
      id="hero"
      className="relative flex items-center justify-center pb-0 pt-32 md:pt-40 px-5"
    >
      {/* Background image */}
      <div className="absolute left-0 top-0 bottom-0 -z-10 w-full">
        <Image
          src="/images/map.png"
          alt="Background map"
          className="absolute h-full w-full object-cover opacity-10"
          fill
          priority={true}
        />
      </div>

      <div className="absolute left-0 right-0 bottom-0 backdrop-blur-[2px] h-40 bg-gradient-to-b from-transparent via-[rgba(233,238,255,0.5)] to-[rgba(202,208,230,0.5)]"></div>

      {/* Animated points on the map */}
      <div className="absolute inset-0 -z-0">
        {points.map((point, index) => (
          <div
            key={index}
            className="absolute w-4 h-4 bg-green-500 rounded-full"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              animation: `fade-bright 2s ${point.delay}s linear infinite`, // Staggered animations with delay
              transform: "translate(-50%, -50%)",
              boxShadow: "0 0 10px 2px rgba(60, 255, 0, 0.8)", // Glow effect
            }}
          ></div>
        ))}
      </div>

      {/* Hero content */}
      <div className="text-center min-h-[45rem] flex flex-col items-center pt-[10rem]">
        <h1 className="z-10 text-4xl md:text-6xl md:leading-tight font-bold text-slate-800 max-w-md md:max-w-xl mx-auto">
          {heroDetails.heading}
        </h1>
        <p className="z-10 mt-4 text-slate-700 font-bold text-xl mx-auto">
          {heroDetails.subheading}
        </p>
        <div className="mt-6 flex items-center gap-5">
          <Link
            href="/auth"
            className="text-white bg-black hover:bg-slate-800 px-8 py-3 rounded-full transition-colors z-10"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Add animation for staggered blinking */}
      <style jsx>{`
        @keyframes fade-bright {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-fade-bright {
          animation: fade-bright 1s linear infinite;
          box-shadow: 0 0 10px 2px rgba(0, 255, 13, 0.8); /* Adds brightness around the dots */
        }
      `}</style>
    </section>
  );
};

export default Hero;
