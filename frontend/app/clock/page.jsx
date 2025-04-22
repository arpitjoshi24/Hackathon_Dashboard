"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaMusic } from "react-icons/fa";
import { useRouter } from "next/navigation";
import ParticipantPage from "../Participants/page";

export default function HackathonClock() {
  const router = useRouter();
  const [time, setTime] = useState("00:00:00");
  const [message, setMessage] = useState("");
  const [running, setRunning] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [AudVis, setAudVis] = useState(false);
  const [Evaluation, setEvaluation] = useState(false);
  const [ClockTab, setClockTab] = useState(false);
  const [audioList] = useState([
    {
      name: "Chill Out", url: "/music/1.m4a", track: [
        { name: "INTRO", time: "00:00" },
        { name: "Case", time: "00:05" },
        { name: "Lalkaara", time: "02:21" },
        { name: "King Shit", time: "05:01" },
        { name: "Safety Off", time: "08:48" },
        { name: "52 Bars", time: "11:10" },
        { name: "On Top", time: "14:44" },
        { name: "Cheques", time: "17:47" },
        { name: "Still Rollin", time: "20:50" },
        { name: "Check It Out", time: "23:42" },
        { name: "Rubicon Drill", time: "26:57" },
        { name: "Wake Up", time: "30:04" },
        { name: "Thaa", time: "32:38" },
        { name: "Jatt Vailly", time: "35:39" },
        { name: "Desi Hood", time: "38:11" },
        { name: "We Rollin", time: "40:38" },
        { name: "No Love", time: "43:57" },
        { name: "No Reason", time: "46:47" },
        { name: "Aam Jahe Munde", time: "50:23" },
        { name: "Majhail", time: "53:50" },
        { name: "War", time: "56:43" }
      ]
    },
    {
      name: "Round and Round", url: "/music/2.mp3", track: [
        { name: "Intro", time: "00:00" },
      ]
    },
    {
      name: "Paro", url: "/music/3.mp3", track: [
        { name: "Intro", time: "00:00" },
      ]
    },
    {
      name: "Danger", url: "/music/4.mp3", track: [
        { name: "Intro", time: "00:00" },
      ]
    },
    {
      name: "APT", url: "/music/5.mp3", track: [
        { name: "Intro", time: "00:00" },
      ]
    },
    {
      name: "Single Haddi", url: "/music/18.mp3", track: [
        { name: "Intro", time: "00:00" },
      ]
    },
    {
      name: "Feri Jaalma", url: "/music/6.mp3", track: [
        { name: "Intro", time: "00:00" },
      ]
    },
    {
      name: "Rikhari Mix", url: "/music/7.mp3", track: [
        { name: "Samjho Na", time: "00:00" },
        { name: "Faasle", time: "02:49" },
        { name: "Aana Nahi", time: "06:21" },
        { name: "Dil Hai Na", time: "09:20" },
        { name: "Tu Rehti Hai", time: "11:26" },
        { name: "Kya Karien", time: "14:06" },
        { name: "Pal Bhar", time: "16:44" },
        { name: "Tu Kahan", time: "19:48" },
      ]
    },
    {
      name: "Timro", url: "/music/8.mp3", track: [
        { name: "Intro", time: "00:00" },
      ]
    },
    {
      name: "Bhaag Milkha", url: "/music/9.mp3", track: [
        { name: "Intro", time: "00:00" },
      ]
    },
    {
      name: "O Rangrez", url: "/music/10.mp3", track: [
        { name: "Intro", time: "00:00" },
      ]
    },
    {
      name: "Blue", url: "/music/11.mp3", track: [
        { name: "Intro", time: "00:00" },
      ]
    },
    {
      name: "Glimpse of Us", url: "/music/12.mp3", track: [
        { name: "Intro", time: "00:00" },
      ]
    },
    {
      name: "Sahiba", url: "/music/13.mp3", track: [
        { name: "Intro", time: "00:00" },
      ]
    },
    {
      name: "Dooron Dooron", url: "/music/14.mp3", track: [
        { name: "Intro", time: "00:00" },
      ]
    },
    {
      name: "Zakir", url: "/music/15.mp3", track: [
        { name: "Intro", time: "00:00" },
      ]
    },
    {
      name: "Sultan", url: "/music/16.mp3", track: [
        { name: "Intro", time: "00:00" },
      ]
    },
    {
      name: "Zinda", url: "/music/17.mp3", track: [
        { name: "Intro", time: "00:00" },
      ]
    },
  ]);

  const timerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioList.length > 0) {
      setCurrentTrack(audioList[0]);
    }
  }, [audioList]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (audioRef.current.paused) {
        audioRef.current.play().catch((e) => console.error("Audio Play Error:", e));
      }
    }
  }, [volume]);

  function toggleEv() {
    setEvaluation(!Evaluation);
  }

  useEffect(() => {
    if (currentTrack) {
      const audio = new Audio(currentTrack.url);
      audio.volume = volume;
      audioRef.current = audio;

      audio.addEventListener("loadedmetadata", () => {
        console.log("Audio loaded:", currentTrack.name);
      });

      return () => {
        if (audio) {
          audio.pause();
        }
        audioRef.current = null;
      };
    }
  }, [currentTrack]);

  useEffect(() => {
    const storedStartTime = localStorage.getItem("hackathonStartTime");
    if (storedStartTime) {
      setRunning(true);
      startCountdown(Number(storedStartTime));
    }
  }, []);

  const startCountdown = (startTime) => {
    const END_TIME = startTime + 86400 * 1000;

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const remainingSeconds = Math.floor((END_TIME - now) / 1000);

      if (remainingSeconds <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
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

  const toggleAudio = async () => {
    if (!audioRef.current) return;

    try {
      if (audioRef.current.paused) {
        await audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Audio Play Error:", error);
    }
  };

  const randomTrack = () => {
    if (!currentTrack) return;

    const randomIndex = Math.floor(Math.random() * currentTrack.track.length);
    const randomTimestamp = currentTrack.track[randomIndex];
    const [minutes, seconds] = randomTimestamp.time.split(":").map((num) => parseInt(num));

    const timeInSeconds = minutes * 60 + seconds;

    // Jump to the random time in the audio
    if (audioRef.current) {
      audioRef.current.currentTime = timeInSeconds;
      audioRef.current.play().catch((e) => console.error("Audio Play Error:", e));
    }
  };

  const handleTrackSelection = (track) => {
    setCurrentTrack(track);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };
  useEffect(() => {
    const targetDate = new Date("2025-04-22T11:00:00");
  
    const checkAndStart = () => {
      const now = new Date();

      if (now >= targetDate && !running) {
        const startTime = targetDate.getTime();
        localStorage.setItem("hackathonStartTime", startTime.toString());
        startCountdown(startTime);
        setRunning(true);
      }
    };
  
    checkAndStart();
    const intervalId = setInterval(checkAndStart, 1000);
  
    return () => clearInterval(intervalId);
  }, []);
  

  useEffect(() => {
    if (Evaluation) return;
    const timer = setInterval(() => {
        setClockTab(prev => !prev);
    }, 60000);
    return () => clearInterval(timer);
}, [Evaluation]);


  return (
    <div className="flex relative items-center max-h-screen justify-between min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] animate-gradient">
      { !ClockTab
        ?
        <div className="flex-1 min-w-screen flex justify-center items-center">
        <motion.div
          className="text-center justify-items-center justify-center min-h-screen min-w-screen p-8 sm:p-12 bg-white/10 rounded-xl shadow-xl w-full"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-3xl  sm:text-4xl md:text-5xl font-extrabold text-cyan-300 mb-8 drop-shadow-xl">
            HACKATHON DIGITAL CLOCK
          </h1>

          <div className="flex justify-center mb-6 gap-5">
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
          </div>
          <div className="w-full items-center justify-items-center justify-center">

            <motion.p
              className="text-xl sm:text-2xl md:text-3xl w-full text-center font-bold text-cyan-200 bg-white/10 px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg  max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              Mid Evaluation is On! Be Ready...!!
            </motion.p>
          </div>
        </motion.div>
      </div>
      :
      <ParticipantPage />}
      {!AudVis ?
        <span className="absolute bottom-3 right-3 m-4 text-3xl text-cyan-300 cursor-pointer" onClick={() => setAudVis(true)}><FaMusic /></span>
        :
        <div className="w-64 z-50 p-6 right-0 top-[44%] overflow-auto max-h-96 absolute bg-white/10 rounded-lg shadow-xl mr-8 flex flex-col items-center">
          <label onClick={() => setAudVis(false)} className="text-cyan-300 font-bold text-lg mb-2">Adjust Music Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-48 mb-4"
          />

          <button
            onClick={toggleAudio}
            className="mb-4 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg shadow-md transition w-full"
          >
            {isPlaying ? "Pause Music" : "Play Music"}
          </button>

          <button
            onClick={randomTrack}
            className="mb-4 px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg shadow-md transition w-full"
          >
            Random Track
          </button>

          <div className="flex flex-col items-center scrollbar-hide overflow-auto w-full gap-4">
            <button
              onClick={toggleEv}
              className="mb-4 px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg shadow-md transition w-full"
            >
              {!Evaluation ? "Start Evaluation" : "Stop Evaluation"}
            </button>
            {audioList.map((track, index) => (
              <button
                key={index}
                onClick={() => handleTrackSelection(track)}
                className={`px-6 py-2 text-white font-bold rounded-lg shadow-md transition w-full ${currentTrack?.name === track.name
                  ? "bg-cyan-600"
                  : "bg-cyan-500 hover:bg-cyan-600"
                  }`}
              >
                {track.name}
              </button>
            ))}
          </div>
        </div>
      }
    </div>
  );
}
