require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const axios = require("axios");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(express.json());
// Get allowed origins from env and convert to array

app.use(cors({
  origin: "*"
}));

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB")).catch((err) => console.error(err));

// ✅ Team Model
const Team = mongoose.model("Team", {
  name: String,
  score: Number,
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ✅ Get All Teams (Sorted by Score)
app.get("/teams", async (req, res) => {
  try {
    const teams = await Team.find().sort({ score: -1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching teams", error });
  }
});

// ✅ Register a New Team
app.post("/register-team", async (req, res) => {
  try {
    const { name } = req.body;

    // Check if team already exists
    if (await Team.findOne({ name })) {
      return res.status(400).json({ message: "Team already exists" });
    }

    const newTeam = new Team({ name, score: 0 });
    await newTeam.save();

    io.emit("newTeam", newTeam); // Notify all clients
    res.json(newTeam);
  } catch (error) {
    res.status(500).json({ message: "Error registering team", error });
  }
});

// ✅ Update Team Score
app.post("/update-score", async (req, res) => {
  try {
    const { teamId, score } = req.body;
    
    if (!teamId || score === undefined) {
      return res.status(400).json({ message: "Team ID and score are required" });
    }

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    team.score += score; // Add the new score to the existing score
    await team.save();

    io.emit("scoreUpdate", team); // Real-time update to clients
    res.json({ message: "Score updated", team });
  } catch (error) {
    res.status(500).json({ message: "Error updating score", error });
  }
});

app.delete("/delete-team/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await Team.findByIdAndDelete(id);
        io.emit("teamDeleted", id);  // Emit event to all clients
        res.status(200).json({ message: "Team deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete team" });
    }
});

function ackServer() {
  // Use full URL from env or default to localhost with server port
  const url = process.env.MY_URL || `http://localhost:${process.env.PORT || 5000}/`;
  console.log(`Starting ACK heartbeat: GET ${url} every 25s`);

  setInterval(async () => {
    try {
      const response = await axios.get(url);
      console.log(`[ACK] ${new Date().toISOString()} →`, response.status);
    } catch (err) {
      console.error(`[ACK ERROR] ${new Date().toISOString()} →`, err.message);
    }
  }, 25_000);
}

// ✅ Socket Connection
io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("disconnect", () => console.log("Client disconnected"));
});

ackServer();

// ✅ Start Server
server.listen(5000, () => console.log("Backend running on port 5000"));
