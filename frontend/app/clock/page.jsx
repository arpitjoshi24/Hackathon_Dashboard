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

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     router.push("/Participants");
  //   }, 3000);
  //   return () => clearTimeout(timer);
  // }, [router]);

  const startCountdown = (startTime) => {
    const END_TIME = startTime + 86400 * 1000; // 24 hours from startTime
  
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const remainingSeconds = Math.floor((END_TIME - now) / 1000);
  
      if (remainingSeconds <= 0) {
        clearInterval(timerRef.current);
        setTime("00:00:00");
        setMessage("Hackathon Over! 🎉");
        localStorage.removeItem("hackathonStartTime");
        return;
      }
  
      const hours = String(Math.floor(remainingSeconds / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((remainingSeconds % 3600) / 60)).padStart(2, "0");
      const secs = String(remainingSeconds % 60).padStart(2, "0");
      setTime(`${hours}:${minutes}:${secs}`);
  
      if (remainingSeconds <= 7200) setMessage("Only 2 hours left!");
      else if (remainingSeconds <= 21600) setMessage("Final 6 hours! Stay strong!");
      else if (remainingSeconds <= 43200) setMessage("Halfway through! Keep going!");
      else if (remainingSeconds <= 64800) setMessage("6 hours done! Time flies!");
      else setMessage("Hackathon is live! Let's GO!");
    }, 1000);
  };
  

  useEffect(() => {
    const targetDate = new Date("2025-04-22T09:30:00");
  
    const checkAndStart = () => {
      const now = new Date();
  
      if (now >= targetDate && !running) {
        const startTime = targetDate.getTime();
        localStorage.setItem("hackathonStartTime", startTime.toString());
        startCountdown(startTime);
        setRunning(true);
      }
    };
  
    // Check immediately and then every second
    checkAndStart();
    const intervalId = setInterval(checkAndStart, 1000);
  
    return () => clearInterval(intervalId);
  }, []);
  

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
{/* 
      {!running && (
        <motion.button
          onClick={startClock}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mt-6 px-6 py-3 text-lg sm:text-xl bg-cyan-300 text-black font-bold rounded-xl shadow-lg hover:bg-cyan-400 transition-all"
        >
          Start Clock
        </motion.button>
      )} */}

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
