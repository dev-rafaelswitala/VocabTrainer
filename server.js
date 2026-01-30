import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3001;

// __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ordner für JSON-Dateien
const dataDir = path.join(__dirname, "public", "data");

// Body-Parser aktivieren
app.use(express.json());

// Endpoint: Liste aller Einheiten
app.get("/api/units", (req, res) => {
  fs.readdir(dataDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Cannot read data directory" });
    }
    const jsonFiles = files.filter(file => file.endsWith(".json"));
    res.json(jsonFiles);
  });
});

// Endpoint: Neue Einheit speichern / bestehende überschreiben
app.post("/api/saveUnit", (req, res) => {
  const { filename, data } = req.body;
  if (!filename || !data) return res.status(400).json({ message: "Fehlende Daten" });

  const filePath = path.join(dataDir, filename);

  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Fehler beim Speichern" });
    }
    res.json({ message: "Einheit erfolgreich gespeichert!" });
  });
});

// Server starten
app.listen(PORT, () => {
  console.log(`✔ Node API läuft auf http://localhost:${PORT}`);
});
