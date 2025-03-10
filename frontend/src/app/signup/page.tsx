"use client";
import Link from "next/link";
import React, { useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore"; // Import Firestore methods
import { db } from "../firebase"

const AuthenticationPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [message, setmessage] = useState("");
  const router = useRouter();


  const addUserToFirestore = async (uid: string, name: string, email: string): Promise<void> => {
    try {
      const userRef = doc(db, "Users", uid); // Create a reference to the user's document
      await setDoc(userRef, {
        name: name,     // Add name field
        email: email,   // Add email field
        points: 0       // Initialize points to 0
      });
      console.log("User document successfully created in Firestore!");
    } catch (error) {
      console.error("Error adding user to Firestore:", error);
    }
  };


  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      console.log("User signed in with Google:", user);
  
      // Add user to Firestore
      await addUserToFirestore(user.uid, user.displayName??"", user.email??"");
  
      setmessage("Successfully signed in with Google!");
      router.push('/dashboard');
    } catch (error) {
      setmessage("Failed to sign in with Google. Please try again.");
      console.error("Google Sign-In error:", error);
    }
  };
  


  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (repassword === password) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
  
        // Add user to Firestore
        await addUserToFirestore(user.uid, name, email); // Use a default name if no displayName
  
        setmessage("Redirecting to Page");
        router.push('/dashboard');
      } else {
        setmessage("Passwords do not Match");
      }
    } catch (error) {
      if (error instanceof Error && "code" in error) {
        const firebaseError = error as { code: string }; // Narrow down type
        switch (firebaseError.code) {
          case "auth/weak-password":
            setmessage("Password should be at least 6 characters long.");
            break;
          case "auth/email-already-in-use":
            setmessage(
              "This email is already registered. Please log in or use a different email."
            );
            break;
          case "auth/invalid-email":
            setmessage("Please enter a valid email address.");
            break;
          case "auth/user-not-found":
            setmessage(
              "No user found with this email. Please sign up or check your email address."
            );
            break;
          case "auth/wrong-password":
            setmessage("Incorrect password. Please try again.");
            break;
          default:
            setmessage("Something went wrong. Please try again later.");
        }
      } else {
        setmessage("An unexpected error occurred.");
      }
    }
  };


  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300 px-5 overflow-hidden">
      <Header />
      {/* Falling Leaves */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className={`falling-leaf leaf-${index + 1}`}></div>
        ))}
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className={`falling-leaf-2 leaf-${index + 1 + 10}`}
          ></div>
        ))}
      </div>
      {/* Authentication Card */}
      <div className="z-10 w-full max-w-md bg-white shadow-lg md:rounded-lg sm:h-full p-8">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">
          Sign Up
        </h1>
        <p className="text-red-700 underline text-center">{message}</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-300"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Name
            </label>
            <input
              type="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-300"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-300"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Re-enter Password
            </label>
            <input
              id="password"
              type="password"
              value={repassword}
              onChange={(e) => setRePassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black py-2 px-4 rounded hover:bg-yellow-500 transition"
          >
            SignUp
          </button>
          <p className="text-center">or</p>
          <div className="flex flex-col items-center">
            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-800 transition"
            >
              Sign in with Google
            </button>
          </div>
          <Link
            href="/auth"
            className="flex justify-center text-blue-400 underline w-full"
          >
            Already have an account Sign-In!
          </Link>
        </form>
      </div>
    </div>
  );
};

export default AuthenticationPage;
