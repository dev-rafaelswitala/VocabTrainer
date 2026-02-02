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
const unitsDir = path.join(__dirname, "public", "units");

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

// Endpoint: Nächst niedrigste verfügbare ID ermitteln
app.get("/api/nextId", (req, res) => {
  if (!fs.existsSync(unitsDir)) {
    fs.mkdirSync(unitsDir, { recursive: true });
  }

  fs.readdir(unitsDir, (err, files) => {
    if (err) {
      return res.json({ nextId: "0001" });
    }
    
    const ids = files
      .filter(f => f.endsWith(".json"))
      .map(f => parseInt(f.replace(".json", ""), 10))
      .sort((a, b) => a - b);

    if (ids.length === 0) {
      return res.json({ nextId: "0001" });
    }

    // Finde die erste Lücke oder nächste Zahl nach der höchsten
    let nextId = 1;
    for (let id of ids) {
      if (id === nextId) {
        nextId++;
      } else if (id > nextId) {
        break;
      }
    }

    res.json({ nextId: String(nextId).padStart(4, "0") });
  });
});

// Endpoint: Session speichern
app.post("/api/saveSession", (req, res) => {
  if (!fs.existsSync(unitsDir)) {
    fs.mkdirSync(unitsDir, { recursive: true });
  }

  const { id, day, time, words } = req.body;
  if (!id || !day || !time || !words) {
    return res.status(400).json({ message: "Fehlende Daten" });
  }

  const filename = `${id}.json`;
  const filePath = path.join(unitsDir, filename);

  fs.writeFile(filePath, JSON.stringify({ id, day, time, words }, null, 2), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Fehler beim Speichern der Session" });
    }
    res.json({ message: "Session erfolgreich gespeichert!" });
  });
});

// Endpoint: Alle Sessions abrufen
app.get("/api/sessions", (req, res) => {
  if (!fs.existsSync(unitsDir)) {
    fs.mkdirSync(unitsDir, { recursive: true });
    return res.json([]);
  }

  fs.readdir(unitsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Cannot read units directory" });
    }

    const jsonFiles = files.filter(file => file.endsWith(".json"));
    res.json(jsonFiles);
  });
});

// Endpoint: Session nach ID abrufen
app.get("/api/sessions/:id", (req, res) => {
  const { id } = req.params;
  const filePath = path.join(unitsDir, `${id}.json`);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(404).json({ error: "Session nicht gefunden" });
    }
    try {
      const session = JSON.parse(data);
      res.json(session);
    } catch (e) {
      res.status(500).json({ error: "Fehler beim Lesen der Session" });
    }
  });
});


// Server starten
app.listen(PORT, () => {
  console.log(`✔ Node API läuft auf http://localhost:${PORT}`);
});
