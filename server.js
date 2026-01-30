import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "public", "data");

app.get("/api/units", (req, res) => {
  fs.readdir(dataDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Cannot read data directory" });
    }

    const jsonFiles = files.filter(file => file.endsWith(".json"));
    res.json(jsonFiles);
  });
});

app.listen(PORT, () => {
  console.log(`✔ Node API läuft auf http://localhost:${PORT}`);
});
