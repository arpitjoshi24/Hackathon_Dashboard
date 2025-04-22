"use client"

// pages/admin.js
import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io(`${process.env.NEXT_NEXT_PUBLIC_API_URL}`);

export default function AdminPage() {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [teamScores, setTeamScores] = useState({});

  useEffect(() => {
    fetch(`${process.env.NEXT_NEXT_PUBLIC_API_URL}/teams`)
      .then((res) => res.json())
      .then((data) => setTeams(data));

    socket.on("newTeam", (newTeam) => {
      setTeams((prev) => [...prev, newTeam].sort((a, b) => b.score - a.score));
    });

    socket.on("scoreUpdate", (updatedTeam) => {
      setTeams((prev) =>
        prev.map((team) =>
          team._id === updatedTeam._id ? updatedTeam : team
        ).sort((a, b) => b.score - a.score)
      );
    });

    return () => {
      socket.off("newTeam");
      socket.off("scoreUpdate");
    };
  }, []);

  const registerTeam = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_NEXT_PUBLIC_API_URL}/register-team`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: teamName }),
    });
    if (res.ok) setTeamName("");
  };

  const updateScore = async (teamId, change) => {
    const score = parseInt(teamScores[teamId], 10);
    if (isNaN(score)) return alert("Please enter a valid number");

    const res = await fetch(`${process.env.NEXT_NEXT_PUBLIC_API_URL}/update-score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamId, score: change === "increase" ? score : -score }),
    });

    if (res.ok) setTeamScores({ ...teamScores, [teamId]: "" });
  };

  const deleteTeam = async (teamId) => {
    const res = await fetch(`${process.env.NEXT_NEXT_PUBLIC_API_URL}/delete-team/${teamId}`, { // Ensure correct endpoint
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  
    if (res.ok) {
      setTeams((prev) => prev.filter((team) => team._id !== teamId));
    } else {
      alert("Failed to delete team. Please try again.");
    }
  };
  

  return (
    <div className="p-5 bg-gray-900 min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold text-yellow-300">Admin Hackathon Scoreboard</h1>
      
      <form onSubmit={registerTeam} className="mt-6 flex space-x-3">
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Enter team name"
          className="border p-2 rounded-lg w-64 text-center"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Register Team
        </button>
      </form>
      
      <ul className="mt-6 w-full max-w-3xl">
        {teams.map((team, index) => (
          <li key={team._id} className="p-4 bg-gray-800 rounded-lg shadow-md flex justify-between items-center mb-3">
            <span className="text-white font-bold">{index + 1}. {team.name} - {team.score} pts</span>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={teamScores[team._id] || ""}
                onChange={(e) => setTeamScores({ ...teamScores, [team._id]: e.target.value })}
                placeholder="Score"
                className="border p-1 w-16 text-center rounded-lg"
              />
              <button
                onClick={() => updateScore(team._id, "increase")}
                className="bg-green-500 text-white px-3 py-1 rounded-lg"
              >
                +
              </button>
              <button
                onClick={() => updateScore(team._id, "decrease")}
                className="bg-red-500 text-white px-3 py-1 rounded-lg"
              >
                -
              </button>
              <button
                onClick={() => deleteTeam(team._id)}
                className="bg-gray-500 text-white px-3 py-1 rounded-lg"
              >
                🗑
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}