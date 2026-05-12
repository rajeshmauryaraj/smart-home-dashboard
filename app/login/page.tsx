"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const login = () => {

    if (
      username === "raj.maurya" &&
      password === "raj@123"
    ) {

     localStorage.setItem("auth", "true");

setTimeout(() => {
  localStorage.removeItem("auth");
}, 3600000);

      router.push("/");

    } else {

      setError("Invalid Username or Password");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">

        <h1 className="text-4xl font-bold text-white text-center mb-2">
          Smart Home
        </h1>

        <p className="text-zinc-400 text-center mb-8">
          Secure Dashboard Login
        </p>

        <div className="space-y-5">

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            className="w-full h-14 rounded-2xl bg-zinc-800 border border-zinc-700 px-5 text-white outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full h-14 rounded-2xl bg-zinc-800 border border-zinc-700 px-5 text-white outline-none"
          />

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-2xl text-sm">
              {error}
            </div>
          )}

          <button
            onClick={login}
            className="w-full h-14 rounded-2xl bg-green-500 hover:bg-green-600 transition-all text-white font-bold text-lg"
          >
            LOGIN
          </button>

        </div>

      </div>

    </div>
  );
}