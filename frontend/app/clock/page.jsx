"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function HackathonClock() {
  const [time, setTime] = useState("00:00:00");
  const [message, setMessage] = useState("");
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const storedStartTime = localStorage.getItem("hackathonStartTime");
    if (storedStartTime) {
      setRunning(true);
      startClock(Number(storedStartTime));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/Participants");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  const startClock = (existingTime = 0) => {
    setRunning(true);
    const startTime = existingTime || Date.now();
    localStorage.setItem("hackathonStartTime", startTime);

    timerRef.current = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);

      if (elapsedSeconds >= 86400) {
        clearInterval(timerRef.current);
        setTime("00:00:00");
        setMessage("Hackathon Over! 🎉");
        localStorage.removeItem("hackathonStartTime");
      } else {
        const hours = String(Math.floor(elapsedSeconds / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((elapsedSeconds % 3600) / 60)).padStart(2, "0");
        const secs = String(elapsedSeconds % 60).padStart(2, "0");
        setTime(`${hours}:${minutes}:${secs}`);

        if (elapsedSeconds >= 79200) setMessage("Only 2 hours left!");
        else if (elapsedSeconds >= 64800) setMessage("Final 6 hours! Stay strong!");
        else if (elapsedSeconds >= 43200) setMessage("Halfway through! Keep going!");
        else if (elapsedSeconds >= 21600) setMessage("6 hours done! Time flies!");
        else setMessage("Hackathon is live! Let's GO!");
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] animate-gradient text-white font-sans">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-cyan-300 mb-8 drop-shadow-xl text-center">
        HACKATHON DIGITAL CLOCK
      </h1>

      <motion.div
        className="flex flex-wrap justify-center gap-2 sm:gap-4 bg-white/10 px-6 sm:px-10 py-4 sm:py-6 rounded-xl shadow-2xl border border-cyan-400/30"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        {time.split("").map((char, index) => (
          <motion.span
            key={index}
            className="text-5xl sm:text-6xl md:text-7xl font-mono text-cyan-300 bg-[#0f172a]/60 px-3 sm:px-5 py-2 sm:py-3 rounded-lg shadow-lg"
            animate={{ rotateX: [0, 180, 360] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 5 }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>

      <motion.p
        className="mt-6 text-xl sm:text-2xl md:text-3xl font-bold text-cyan-200 bg-white/10 px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg text-center max-w-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {message}
      </motion.p>

      {!running && (
        <motion.button
          onClick={startClock}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mt-6 px-6 py-3 text-lg sm:text-xl bg-cyan-300 text-black font-bold rounded-xl shadow-lg hover:bg-cyan-400 transition-all"
        >
          Start Clock
        </motion.button>
      )}

      <style jsx>{`
        .animate-gradient {
          background-size: 400% 400%;
          animation: gradientMove 15s ease infinite;
        }

        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}
