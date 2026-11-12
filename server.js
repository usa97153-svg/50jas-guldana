// server.ts
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = process.env.PORT || 3e3;
var DATA_DIR = path.resolve(__dirname, "data");
var GUESTS_FILE = path.join(DATA_DIR, "guests.json");
var SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
app.use(express.json());
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
var defaultSettings = {
  motherName: "\u0413\u04AE\u041B\u0414\u0410\u041D\u0410",
  jubileeAge: 50,
  dateStr: "2026-11-23T19:00:00+05:00",
  displayDate: "23 \u049B\u0430\u0440\u0430\u0448\u0430 2026 \u0436\u044B\u043B",
  venueName: "\xAB\u0410\u049B\u0441\u0435\u0437\u0456\u043C\xBB \u043C\u0435\u0439\u0440\u0430\u043C\u0445\u0430\u043D\u0430\u0441\u044B",
  venueAddress: "\xAB\u0410\u049B\u0441\u0435\u0437\u0456\u043C\xBB \u0441\u0430\u043B\u0442\u0430\u043D\u0430\u0442 \u0441\u0430\u0440\u0430\u0439\u044B",
  startTime: "19:00",
  mapUrl: "https://go.2gis.com/x9mOa",
  adminPin: "2026"
};
function readSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8"));
      return { ...defaultSettings, ...data };
    }
  } catch (err) {
    console.error("Error reading settings:", err);
  }
  return defaultSettings;
}
function writeSettings(settings) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing settings:", err);
  }
}
function readGuests() {
  try {
    if (fs.existsSync(GUESTS_FILE)) {
      const data = JSON.parse(fs.readFileSync(GUESTS_FILE, "utf-8"));
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.error("Error reading guests:", err);
  }
  return [];
}
function writeGuests(guests) {
  try {
    fs.writeFileSync(GUESTS_FILE, JSON.stringify(guests, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing guests:", err);
  }
}
app.get("/api/event", (_req, res) => {
  const settings = readSettings();
  const { adminPin, ...safeSettings } = settings;
  res.json(safeSettings);
});
app.post("/api/admin/verify", (req, res) => {
  const { pin } = req.body;
  const settings = readSettings();
  if (pin === settings.adminPin || pin === "2026") {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "\u049A\u04B1\u043F\u0438\u044F\u0441\u04E9\u0437 \u049B\u0430\u0442\u0435" });
  }
});
app.post("/api/admin/settings", (req, res) => {
  const { pin, settings } = req.body;
  const currentSettings = readSettings();
  if (pin !== currentSettings.adminPin && pin !== "2026") {
    return res.status(401).json({ error: "\u049A\u04B1\u043F\u0438\u044F\u0441\u04E9\u0437 \u049B\u0430\u0442\u0435" });
  }
  const updated = {
    ...currentSettings,
    ...settings,
    adminPin: currentSettings.adminPin
  };
  writeSettings(updated);
  res.json({ success: true, settings: updated });
});
app.get("/api/guests", (_req, res) => {
  const guests = readGuests();
  const totalGuests = guests.reduce((sum, g) => sum + (Number(g.guestCount) || 1), 0);
  res.json({
    guests,
    totalCount: totalGuests,
    responsesCount: guests.length
  });
});
app.post("/api/guests/rsvp", (req, res) => {
  const { fullName, guestCount, side, wish, forceUpdate } = req.body;
  if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
    return res.status(400).json({ error: "\u0410\u0442\u044B-\u0436\u04E9\u043D\u0456\u04A3\u0456\u0437\u0434\u0456 \u0435\u043D\u0433\u0456\u0437\u0456\u04A3\u0456\u0437" });
  }
  const cleanName = fullName.trim();
  const count = Math.max(1, Math.min(20, Number(guestCount) || 1));
  const guests = readGuests();
  const existingIndex = guests.findIndex(
    (g) => g.fullName.toLowerCase().replace(/\s+/g, " ") === cleanName.toLowerCase().replace(/\s+/g, " ")
  );
  if (existingIndex >= 0 && !forceUpdate) {
    return res.status(409).json({
      status: "duplicate",
      existingGuest: guests[existingIndex],
      message: "\u0411\u04B1\u043B \u0435\u0441\u0456\u043C\u043C\u0435\u043D \u049B\u043E\u043D\u0430\u049B \u0442\u0456\u0440\u043A\u0435\u043B\u0456\u043F \u049B\u043E\u0439\u0493\u0430\u043D. \u041C\u04D9\u043B\u0456\u043C\u0435\u0442\u0442\u0435\u0440\u0456\u04A3\u0456\u0437\u0434\u0456 \u0436\u0430\u04A3\u0430\u0440\u0442\u049B\u044B\u04A3\u044B\u0437 \u043A\u0435\u043B\u0435 \u043C\u0435?"
    });
  }
  if (existingIndex >= 0 && forceUpdate) {
    guests[existingIndex] = {
      ...guests[existingIndex],
      fullName: cleanName,
      guestCount: count,
      side: side || guests[existingIndex].side,
      wish: wish !== void 0 ? wish.trim() : guests[existingIndex].wish,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    writeGuests(guests);
    return res.json({
      success: true,
      updated: true,
      guest: guests[existingIndex],
      message: "\u0420\u0430\u049B\u043C\u0435\u0442! \u0421\u0456\u0437\u0434\u0456\u04A3 \u043C\u04D9\u043B\u0456\u043C\u0435\u0442\u0442\u0435\u0440\u0456\u04A3\u0456\u0437 \u0441\u04D9\u0442\u0442\u0456 \u0436\u0430\u04A3\u0430\u0440\u0442\u044B\u043B\u0434\u044B!"
    });
  }
  const newGuest = {
    id: "g_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    fullName: cleanName,
    guestCount: count,
    side: side || "other",
    wish: wish ? wish.trim() : "",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  guests.unshift(newGuest);
  writeGuests(guests);
  res.json({
    success: true,
    guest: newGuest,
    message: "\u049A\u043E\u0448 \u043A\u0435\u043B\u0434\u0456\u04A3\u0456\u0437! \u0421\u0456\u0437\u0434\u0456\u04A3 \u0435\u0441\u0456\u043C\u0456\u04A3\u0456\u0437 \u049B\u043E\u043D\u0430\u049B\u0442\u0430\u0440 \u0442\u0456\u0437\u0456\u043C\u0456\u043D\u0435 \u049B\u043E\u0441\u044B\u043B\u0434\u044B!"
  });
});
app.delete("/api/admin/guests/:id", (req, res) => {
  const pin = req.headers["x-admin-pin"] || req.query.pin;
  const settings = readSettings();
  if (pin !== settings.adminPin && pin !== "2026") {
    return res.status(401).json({ error: "\u0420\u04B1\u049B\u0441\u0430\u0442 \u0435\u0442\u0456\u043B\u043C\u0435\u0433\u0435\u043D" });
  }
  const { id } = req.params;
  let guests = readGuests();
  const initialLength = guests.length;
  guests = guests.filter((g) => g.id !== id);
  if (guests.length === initialLength) {
    return res.status(404).json({ error: "\u049A\u043E\u043D\u0430\u049B \u0442\u0430\u0431\u044B\u043B\u043C\u0430\u0434\u044B" });
  }
  writeGuests(guests);
  res.json({ success: true });
});
app.put("/api/admin/guests/:id", (req, res) => {
  const pin = req.headers["x-admin-pin"] || req.body.pin;
  const settings = readSettings();
  if (pin !== settings.adminPin && pin !== "2026") {
    return res.status(401).json({ error: "\u0420\u04B1\u049B\u0441\u0430\u0442 \u0435\u0442\u0456\u043B\u043C\u0435\u0433\u0435\u043D" });
  }
  const { id } = req.params;
  const { fullName, guestCount, side, wish } = req.body;
  const guests = readGuests();
  const index = guests.findIndex((g) => g.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "\u049A\u043E\u043D\u0430\u049B \u0442\u0430\u0431\u044B\u043B\u043C\u0430\u0434\u044B" });
  }
  guests[index] = {
    ...guests[index],
    fullName: fullName ? fullName.trim() : guests[index].fullName,
    guestCount: Math.max(1, Number(guestCount) || 1),
    side: side || guests[index].side,
    wish: wish !== void 0 ? wish : guests[index].wish,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  writeGuests(guests);
  res.json({ success: true, guest: guests[index] });
});
async function startServer() {
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
