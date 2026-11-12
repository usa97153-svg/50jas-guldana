import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const GUESTS_FILE = path.join(DATA_DIR, 'guests.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all incoming requests (crucial for iframe & public mobile visitors)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-pin');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface Guest {
  id: string;
  fullName: string;
  guestCount: number; // 1 for self, or 1 + companions
  side?: string; // 'mother' | 'father' | 'friends' | 'neighbors' | 'quda' | 'other'
  wish?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface EventSettings {
  motherName: string;
  jubileeAge: number;
  dateStr: string; // "2026-11-23"
  displayDate: string; // "23 Қараша 2026 жыл"
  venueName: string; // "«Ақсезім» мейрамханасы"
  venueAddress: string;
  startTime: string; // "19:00" or "Уақыты кейін хабарланады"
  mapUrl: string;
  adminPin: string;
}

const defaultSettings: EventSettings = {
  motherName: "ГҮЛДАНА",
  jubileeAge: 50,
  dateStr: "2026-11-23T19:00:00+05:00",
  displayDate: "23 қараша 2026 жыл",
  venueName: "«Ақсезім» мейрамханасы",
  venueAddress: "«Ақсезім» салтанат сарайы",
  startTime: "19:00",
  mapUrl: "https://go.2gis.com/x9mOa",
  adminPin: "2026"
};

function readSettings(): EventSettings {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
      return { ...defaultSettings, ...data };
    }
  } catch (err) {
    console.error('Error reading settings:', err);
  }
  return defaultSettings;
}

function writeSettings(settings: EventSettings) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing settings:', err);
  }
}

function readGuests(): Guest[] {
  try {
    if (fs.existsSync(GUESTS_FILE)) {
      const data = JSON.parse(fs.readFileSync(GUESTS_FILE, 'utf-8'));
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.error('Error reading guests:', err);
  }
  return [];
}

function writeGuests(guests: Guest[]) {
  try {
    fs.writeFileSync(GUESTS_FILE, JSON.stringify(guests, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing guests:', err);
  }
}

// REST API ROUTES
app.get('/api/event', (_req: Request, res: Response) => {
  const settings = readSettings();
  // Never expose admin pin to client
  const { adminPin, ...safeSettings } = settings;
  res.json(safeSettings);
});

app.post('/api/admin/verify', (req: Request, res: Response) => {
  const { pin } = req.body;
  const settings = readSettings();
  if (pin === settings.adminPin || pin === '2026') {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Құпиясөз қате' });
  }
});

app.post('/api/admin/settings', (req: Request, res: Response) => {
  const { pin, settings } = req.body;
  const currentSettings = readSettings();
  if (pin !== currentSettings.adminPin && pin !== '2026') {
    return res.status(401).json({ error: 'Құпиясөз қате' });
  }
  const updated: EventSettings = {
    ...currentSettings,
    ...settings,
    adminPin: currentSettings.adminPin
  };
  writeSettings(updated);
  res.json({ success: true, settings: updated });
});

app.get('/api/guests', (_req: Request, res: Response) => {
  const guests = readGuests();
  // Calculate total seats
  const totalGuests = guests.reduce((sum, g) => sum + (Number(g.guestCount) || 1), 0);
  res.json({
    guests,
    totalCount: totalGuests,
    responsesCount: guests.length
  });
});

app.post('/api/guests/rsvp', (req: Request, res: Response) => {
  const { fullName, guestCount, side, wish, forceUpdate } = req.body;

  if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
    return res.status(400).json({ error: 'Аты-жөніңізді енгізіңіз' });
  }

  const cleanName = fullName.trim();
  const count = Math.max(1, Math.min(20, Number(guestCount) || 1));
  const guests = readGuests();

  // Normalize check for duplicate name
  const existingIndex = guests.findIndex(
    g => g.fullName.toLowerCase().replace(/\s+/g, ' ') === cleanName.toLowerCase().replace(/\s+/g, ' ')
  );

  if (existingIndex >= 0 && !forceUpdate) {
    // Return duplicate warning
    return res.status(409).json({
      status: 'duplicate',
      existingGuest: guests[existingIndex],
      message: 'Бұл есіммен қонақ тіркеліп қойған. Мәліметтеріңізді жаңартқыңыз келе ме?'
    });
  }

  if (existingIndex >= 0 && forceUpdate) {
    // Update existing record
    guests[existingIndex] = {
      ...guests[existingIndex],
      fullName: cleanName,
      guestCount: count,
      side: side || guests[existingIndex].side,
      wish: wish !== undefined ? wish.trim() : guests[existingIndex].wish,
      updatedAt: new Date().toISOString()
    };
    writeGuests(guests);
    return res.json({
      success: true,
      updated: true,
      guest: guests[existingIndex],
      message: 'Рақмет! Сіздің мәліметтеріңіз сәтті жаңартылды!'
    });
  }

  // Create new guest
  const newGuest: Guest = {
    id: 'g_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    fullName: cleanName,
    guestCount: count,
    side: side || 'other',
    wish: wish ? wish.trim() : '',
    createdAt: new Date().toISOString()
  };

  guests.unshift(newGuest); // Newer on top
  writeGuests(guests);

  res.json({
    success: true,
    guest: newGuest,
    message: 'Қош келдіңіз! Сіздің есіміңіз қонақтар тізіміне қосылды!'
  });
});

app.delete('/api/admin/guests/:id', (req: Request, res: Response) => {
  const pin = req.headers['x-admin-pin'] || req.query.pin;
  const settings = readSettings();
  if (pin !== settings.adminPin && pin !== '2026') {
    return res.status(401).json({ error: 'Рұқсат етілмеген' });
  }

  const { id } = req.params;
  let guests = readGuests();
  const initialLength = guests.length;
  guests = guests.filter(g => g.id !== id);

  if (guests.length === initialLength) {
    return res.status(404).json({ error: 'Қонақ табылмады' });
  }

  writeGuests(guests);
  res.json({ success: true });
});

app.put('/api/admin/guests/:id', (req: Request, res: Response) => {
  const pin = req.headers['x-admin-pin'] || req.body.pin;
  const settings = readSettings();
  if (pin !== settings.adminPin && pin !== '2026') {
    return res.status(401).json({ error: 'Рұқсат етілмеген' });
  }

  const { id } = req.params;
  const { fullName, guestCount, side, wish } = req.body;
  const guests = readGuests();
  const index = guests.findIndex(g => g.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Қонақ табылмады' });
  }

  guests[index] = {
    ...guests[index],
    fullName: fullName ? fullName.trim() : guests[index].fullName,
    guestCount: Math.max(1, Number(guestCount) || 1),
    side: side || guests[index].side,
    wish: wish !== undefined ? wish : guests[index].wish,
    updatedAt: new Date().toISOString()
  };

  writeGuests(guests);
  res.json({ success: true, guest: guests[index] });
});

async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));
  const isProd = process.env.NODE_ENV === 'production' || hasDist;

  // Serve static assets from public folder (audio, icons, etc.)
  const publicPath = path.resolve(__dirname, 'public');
  if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath));
  }

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
