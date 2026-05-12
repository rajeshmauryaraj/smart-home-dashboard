"use client";
import { useState, useEffect } from "react";
import { Fan, Lightbulb, Sun } from "lucide-react";

export default function Home() {
  const [devices, setDevices] = useState<any>({});

  useEffect(() => {

  const keys = [
    "bulb_r1","fan_r1","tubelight_r1",
    "bulb_r2","fan_r2","tubelight_r2",
    "bulb_k","tubelight_k"
  ];

  let saved: any = {};

  keys.forEach((key) => {
    const val = localStorage.getItem(key);
    saved[key] = val ? JSON.parse(val) : false;
  });

  setDevices(saved);

  // 🔥 REALTIME STATUS FETCH
  const fetchStatus = async () => {

    try {

      const res = await fetch("/api/status");
      const data = await res.json();

      const updated: any = {};

      data.result.forEach((item: any) => {

        if (item.code === "switch_1") {
          updated.bulb_r1 = item.value;
        }

        if (item.code === "switch_2") {
          updated.fan_r1 = item.value;
        }

        if (item.code === "switch_3") {
          updated.tubelight_r1 = item.value;
        }

      });

      setDevices((prev: any) => ({
        ...prev,
        ...updated,
      }));

    } catch (err) {
      console.log(err);
    }
  };

  fetchStatus();

  const interval = setInterval(fetchStatus, 3000);

  return () => clearInterval(interval);

}, []);

  const toggle = async (name: string) => {
    const newState = !devices[name];

    const updated = { ...devices, [name]: newState };
    setDevices(updated);

    localStorage.setItem(name, JSON.stringify(newState));

    try {
      await fetch("/api/control", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device: name,
          state: newState,
        }),
      });
    } catch {
      const rollback = { ...devices, [name]: !newState };
      setDevices(rollback);
      localStorage.setItem(name, JSON.stringify(!newState));
    }
  };

  // 🔥 REAL ICON UI
  const Card = ({ name }: any) => {
    const status = devices[name];

    return (
      <div className="glass-card p-6 rounded-2xl shadow-lg hover:scale-105 transition-all">

        {/* ICON */}
        <div className="mb-4 flex justify-center items-center h-20">

          {/* FAN */}
          {name.includes("fan") && (
            <Fan
              size={60}
              className={`transition-all ${
                status
                  ? "text-blue-400 animate-spin"
                  : "text-gray-500"
              }`}
            />
          )}

          {/* BULB */}
          {name.includes("bulb") && (
            <Lightbulb
              size={60}
              className={`transition-all ${
                status
                  ? "text-yellow-400 drop-shadow-[0_0_25px_yellow] scale-110"
                  : "text-gray-500"
              }`}
            />
          )}

          {/* TUBELIGHT */}
          {name.includes("tubelight") && (
            <Sun
              size={60}
              className={`transition-all ${
                status
                  ? "text-white drop-shadow-[0_0_30px_white] scale-110"
                  : "text-gray-500"
              }`}
            />
          )}

        </div>

        {/* NAME */}
        <h2 className="mb-4 font-semibold text-lg text-center uppercase">
          {name.replace("_", " ")}
        </h2>

        {/* TOGGLE */}
        <div
          onClick={() => toggle(name)}
          className={`relative w-32 h-14 mx-auto rounded-full cursor-pointer transition-all duration-300 flex items-center px-2 ${
            status ? "bg-green-500" : "bg-red-600"
          }`}
        >
          <span className={`absolute text-white font-bold ${
            status ? "left-4" : "right-4"
          }`}>
            {status ? "ON" : "OFF"}
          </span>

          <div
            className={`w-10 h-10 bg-white rounded-full shadow-md transform transition-all duration-300 ${
              status ? "translate-x-16" : "translate-x-0"
            }`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-10">

      <h1 className="text-3xl font-bold">🏠 Smart Home Dashboard</h1>

      {/* ROOM 1 */}
      <div className="glass-card p-6">
        <h2 className="text-xl mb-4">Room 1</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Card name="bulb_r1" />
          <Card name="fan_r1" />
          <Card name="tubelight_r1" />
        </div>
      </div>

      {/* ROOM 2 */}
      <div className="glass-card p-6">
        <h2 className="text-xl mb-4">Room 2</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Card name="bulb_r2" />
          <Card name="fan_r2" />
          <Card name="tubelight_r2" />
        </div>
      </div>

      {/* KITCHEN */}
      <div className="glass-card p-6">
        <h2 className="text-xl mb-4">Kitchen</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card name="bulb_k" />
          <Card name="tubelight_k" />
        </div>
      </div>

    </div>
  );
}