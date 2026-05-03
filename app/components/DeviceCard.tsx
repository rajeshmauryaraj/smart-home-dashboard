"use client";
import { useState, useEffect } from "react";

type Props = {
  name: string;
  icon: string;
};

export default function DeviceCard({ name, icon }: Props) {
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 LOAD saved state (page refresh pe)
  useEffect(() => {
    const saved = localStorage.getItem(name.toLowerCase());
    if (saved !== null) {
      setStatus(JSON.parse(saved));
    }
  }, [name]);

  const toggle = async () => {
    const newState = !status;

    // instant UI update
    setStatus(newState);
    setLoading(true);

    // 🔥 SAVE state
    localStorage.setItem(name.toLowerCase(), JSON.stringify(newState));

    try {
      const res = await fetch("/api/control", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device: name.toLowerCase(),
          state: newState,
        }),
      });

      const data = await res.json();
      console.log("API Response:", data);

      // ❌ fail ho to rollback
      if (!data?.success) {
        setStatus(!newState);
        localStorage.setItem(name.toLowerCase(), JSON.stringify(!newState)); // rollback save bhi
      }

    } catch (error) {
      console.error("Error:", error);

      // ❌ error pe rollback
      setStatus(!newState);
      localStorage.setItem(name.toLowerCase(), JSON.stringify(!newState));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 shadow-lg hover:scale-105 transition-all duration-300">
      
      <div className="text-4xl mb-4">{icon}</div>

      <h2 className="text-lg font-semibold mb-4">{name}</h2>

      <button
        onClick={toggle}
        disabled={loading}
        className={`w-full py-2 rounded-xl font-semibold transition-all duration-200 ${
          status
            ? "bg-green-500 hover:bg-green-600"
            : "bg-red-500 hover:bg-red-600"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading ? "Loading..." : status ? "ON" : "OFF"}
      </button>

    </div>
  );
}