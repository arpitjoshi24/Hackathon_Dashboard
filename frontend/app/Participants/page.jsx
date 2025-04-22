"use client";

import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { FaTrophy } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`);

export default function ParticipantPage() {
  const [teams, setTeams] = useState([]);
  const listRef = useRef(null);
  const router = useRouter();
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams`)
      .then((res) => res.json())
      .then((data) => setTeams(data.sort((a, b) => b.score - a.score)));

    socket.on("newTeam", (newTeam) => {
      setTeams((prev) => [...prev, newTeam].sort((a, b) => b.score - a.score));
    });

    socket.on("scoreUpdate", (updatedTeam) => {
      setTeams((prev) =>
        prev
          .map((team) => (team._id === updatedTeam._id ? updatedTeam : team))
          .sort((a, b) => b.score - a.score)
      );
    });

    socket.on("teamDeleted", (deletedTeamId) => {
      setTeams((prev) => prev.filter((team) => team._id !== deletedTeamId));
    });

    return () => {
      socket.off("newTeam");
      socket.off("scoreUpdate");
      socket.off("teamDeleted");
    };
  }, []);

  useEffect(() => {
    let direction = 1;
    let speed = 12;
    let intervalTime = 20;

    const startScrolling = () => {
      const scrollList = () => {
        if (listRef.current) {
          listRef.current.scrollTop += speed * direction;

          if (
            direction === 1 &&
            listRef.current.scrollTop + listRef.current.clientHeight >=
              listRef.current.scrollHeight
          ) {
            direction = -1;
          } else if (direction === -1 && listRef.current.scrollTop <= 0) {
            direction = 1;
          }

          setTimeout(scrollList, intervalTime);
        }
      };

      scrollList();
    };

    const delayTimer = setTimeout(startScrolling, 2000);
    return () => clearTimeout(delayTimer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/clock");
    }, 10000);
    return () => clearTimeout(timer);
  }, [router]);


  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start px-4 py-6 w-full overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] animate-gradient">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8 z-10">
        <img
          src="../../logo.jpg"
          alt="Logo"
          className="w-16 h-16 object-contain rounded-full border-2 border-cyan-400 shadow-lg"
        />
        <h1 className="text-5xl font-extrabold text-cyan-300 drop-shadow-lg tracking-wide">
          LIVE SCOREBOARD
        </h1>
      </div>

      {/* Scoreboard Container */}
      <div className="backdrop-blur-xl bg-white/10 border border-cyan-400/20 rounded-2xl shadow-2xl w-full max-w-6xl p-6 z-10">
        {/* Headings */}
        <div className="grid grid-cols-3 text-cyan-200 font-bold text-xl md:text-2xl p-4 bg-[#0d1117]/80 rounded-t-xl border-b border-cyan-400/20">
          <span className="text-center">Rank</span>
          <span className="text-center">Team Name</span>
          <span className="text-center">Points</span>
        </div>

        {/* Score List */}
        <div
          ref={listRef}
          className="overflow-hidden max-h-[500px] scrollbar-hide"
          style={{ scrollBehavior: "smooth" }}
        >
          <AnimatePresence>
            <ul className="space-y-4 p-2">
              {teams.map((team, index) => {
                let medal;
                if (index === 0) medal = "gold";
                else if (index === 1) medal = "silver";
                else if (index === 2) medal = "bronze";

                return (
                  <motion.li
                    key={team._id}
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 120, damping: 12 }}
                    className="grid grid-cols-3 items-center px-6 py-4 bg-[#161b22]/90 rounded-xl border border-cyan-400/10 text-white shadow-sm hover:scale-[1.015] transition-all duration-300"
                  >
                    <span className="text-center text-cyan-300 text-2xl font-bold">
                      {index + 1}
                    </span>

                    <div className="flex items-center justify-center gap-3">
                      {medal && (
                        <FaTrophy
                          className={`text-2xl ${
                            medal === "gold"
                              ? "text-yellow-400"
                              : medal === "silver"
                              ? "text-gray-300"
                              : "text-orange-400"
                          }`}
                        />
                      )}
                      <span className="text-lg md:text-xl">{team.name}</span>
                    </div>

                    <span className="text-center text-cyan-200 text-xl font-semibold">
                      {team.score} pts
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </AnimatePresence>
        </div>
      </div>

      {/* Gradient animation */}
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

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
