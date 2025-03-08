"use client";
import { RiMedalFill } from "react-icons/ri";
import { GoTrophy } from "react-icons/go";
import { PiMedal } from "react-icons/pi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

export default function LeaderboardTable() {
  type Player = {
    name: string;
    points: number;
  };

  const fetchAllPlayers = async (): Promise<Player[]> => {
    const players: Player[] = []; // Initialize an empty array to store Player objects
    try {
      // Reference to the 'users' collection
      const usersCollectionRef = collection(db, "Users");
      // Fetch all documents in the collection
      const querySnapshot = await getDocs(usersCollectionRef);
      // Iterate over each document and extract the required data
      querySnapshot.forEach((doc) => {
        const data = doc.data(); // Get document data
        // Push the name and points into the players array, if they exist
        if (data.name && data.points) {
          players.push({
            name: data.name,
            points: data.points,
          });
        }
      });
      console.log(players); // Log the resulting array (optional)
    } catch (error) {
      console.error("Error fetching player data:", error);
    }
    return players; // Return the array of Player objects
  };

  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchData = async () => {
      const playerData = await fetchAllPlayers();
      setPlayers(playerData);
      setIsLoading(false); // Data is loaded
    };
    fetchData();
  }, []);

  const displayer = players.map((item, index) => {
    let col = "";
    let icon = <div className="w-5 h-5" />;
    if (index === 0) {
      col = "bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200";
      icon = <GoTrophy className="w-5 h-5 text-yellow-700" />;
    } else if (index === 1) {
      col = "bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200";
      icon = <RiMedalFill className="w-5 h-5 text-gray-700" />;
    } else if (index === 2) {
      col = "bg-gradient-to-r from-orange-400 via-orange-300 to-orange-200";
      icon = <RiMedalFill className="w-5 h-5 text-orange-700" />;
    } else {
      col = "bg-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.7)]";
    }
    return (
      <div
        key={index}
        className={`${col} rounded-md shadow-md transition-transform duration-300 ease-in-out transform hover:scale-105 backdrop-blur-sm`}
      >
        <div className="h-12 flex items-center justify-between px-4">
          <p className="text-center text-black flex items-center justify-center gap-2 text-lg font-semibold">
            <PiMedal className="w-6 h-6 text-gray-500" /> #{index + 1}
          </p>
          <p className="text-center text-black text-lg font-medium">
            {item.name}
          </p>
          <div className="text-center text-black flex items-center justify-center gap-2 text-lg font-medium">
            {icon}
            <p>{item.points} pts</p>
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      <Header />
      <section
        id="leaderboard"
        className="relative flex flex-col items-center justify-center min-h-screen w-full pt-24 md:pt-32 overflow-hidden px-5 bg-gradient-to-b from-blue-50 to-blue-100"
      >
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mb-9">
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
            Leaderboard
          </h1>
          <div className="max-h-[40rem] overflow-y-auto rounded-lg">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                <p className="ml-4 text-gray-600 text-lg">Loading...</p>
              </div>
            ) : players.length === 0 ? (
              <p className="text-center text-lg text-gray-600">
                No players found.
              </p>
            ) : (
              <>
                <table className="sticky top-0 z-40 w-full text-black border-collapse">
                  <thead className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-t-lg shadow">
                    <tr>
                      <th className="px-6 py-3 text-center text-lg font-semibold">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-center text-lg font-semibold">
                        Name
                      </th>
                      <th className="px-6 py-3 text-center text-lg font-semibold">
                        Points
                      </th>
                    </tr>
                  </thead>
                </table>
                {/* Scrollable players list */}
                <div className="w-full flex flex-col gap-2 p-4">{displayer}</div>
              </>
            )}
          </div>
        </div>
        <div className="z-10"></div>
      </section>
      <Footer />
    </>
  );
}
