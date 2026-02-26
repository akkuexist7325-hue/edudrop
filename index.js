// Minimal Express server for EduDrop (scaffold)
// Usage:
//   cd server
//   npm install
//   npm run dev

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// static serve uploaded QR images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// simple file storage using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `qr-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// simple JSON file storage for teachers (scaffold only)
const DB_FILE = path.join(__dirname, 'db_teachers.json');
function readTeachers() {
  try {
    if(!fs.existsSync(DB_FILE)) return [];
    const raw = fs.readFileSync(DB_FILE);
    return JSON.parse(raw || '[]');
  } catch (e) { return []; }
}
function writeTeachers(list) {
  fs.writeFileSync(DB_FILE, JSON.stringify(list, null, 2));
}

// GET /api/teachers - list teachers
app.get('/api/teachers', (req, res) => {
  const teachers = readTeachers();
  res.json(teachers);
});

// POST /api/teachers - register teacher + optional QR upload
app.post('/api/teachers', upload.single('qr'), (req, res) => {
  const { name, phone, email, subject, fee, bankAccount, accountHolder, ifsc } = req.body;
  const qrFile = req.file;

  if(!name || !phone || !email || !subject || !fee) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const teachers = readTeachers();
  const id = Date.now();
  const teacher = {
    id,
    name, phone, email, subject, sub: subject,
    fee: parseInt(fee, 10),
    bankAccount: bankAccount || null,
    accountHolder: accountHolder || null,
    ifsc: ifsc || null,
    qrPath: qrFile ? `/uploads/${qrFile.filename}` : null,
    isPaid: false,
    createdAt: new Date().toISOString()
  };

  teachers.unshift(teacher);
  writeTeachers(teachers);

  res.json(teacher);
});

// POST /api/payments/verify - mock verification
app.post('/api/payments/verify', (req, res) => {
  const { teacherId, method, transactionId, qrPayload } = req.body;
  if(!teacherId) return res.status(400).json({ error: 'teacherId required' });

  const teachers = readTeachers();
  const t = teachers.find(x => x.id === Number(teacherId));
  if(!t) return res.status(404).json({ error: 'teacher not found' });

  // MOCK: accept any verification for now
  t.isPaid = true;
  writeTeachers(teachers);

  res.json({ ok: true, teacherId: t.id, method, transactionId, qrPayload });
});

// Simple chatbot responses (server-side fallback)
const chatResponses = {
  'hello': 'Hey there! 👋 Welcome to EduDrop! How can I help you today?',
  'hi': 'Hello! 👋 I\'m your EduDrop assistant. What can I do for you?',
  'tutors': 'Looking for a tutor? Use the Master Dhoondo tab to search and filter tutors by subject and location.',
  'books': 'Check out our Digital Library with free and premium books.',
  'notes': 'Students can find handwritten notes from teachers in the Notes by Master section.',
  'payment': 'We support multiple payment methods: Credit/Debit Card, UPI, Google Pay, PayTM.',
  'default': 'I didn\'t quite understand that. Can you rephrase? Ask about tutors, books, notes, or payments.'
};

// POST /api/chat - simple AI chatbot endpoint
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  if(!message) return res.status(400).json({ error: 'message required' });

  const lower = String(message).toLowerCase();
  let reply = chatResponses['default'];
  for(const k of Object.keys(chatResponses)) {
    if(k === 'default') continue;
    if(lower.includes(k)) {
      reply = chatResponses[k];
      break;
    }
  }

  // simple response envelope
  res.json({ reply });
});

// --- Community endpoints (simple file-backed storage) ---
const COMM_FILE = path.join(__dirname, 'db_communities.json');
function readCommunities() {
  try { if(!fs.existsSync(COMM_FILE)) return []; const raw = fs.readFileSync(COMM_FILE); return JSON.parse(raw || '[]'); } catch(e) { return []; }
}
function writeCommunities(list) { fs.writeFileSync(COMM_FILE, JSON.stringify(list, null, 2)); }

// GET /api/communities - list all communities
app.get('/api/communities', (req, res) => {
  const list = readCommunities();
  res.json(list);
});

// POST /api/communities - create a community
app.post('/api/communities', (req, res) => {
  const { title, course, description, creator } = req.body;
  if(!title || !course || !creator) return res.status(400).json({ error: 'title, course, and creator required' });

  const list = readCommunities();
  const id = Date.now();
  const community = { id, title, course, description: description||'', creator, members: [creator], messages: [] , createdAt: new Date().toISOString() };
  list.unshift(community);
  writeCommunities(list);
  res.json(community);
});

// POST /api/communities/:id/join - join community
app.post('/api/communities/:id/join', (req, res) => {
  const id = Number(req.params.id);
  const { user } = req.body;
  if(!user) return res.status(400).json({ error: 'user required' });
  const list = readCommunities();
  const c = list.find(x => x.id === id);
  if(!c) return res.status(404).json({ error: 'community not found' });
  if(!c.members.includes(user)) c.members.push(user);
  writeCommunities(list);
  res.json({ ok: true, community: c });
});

// GET /api/communities/:id/messages - list messages
app.get('/api/communities/:id/messages', (req, res) => {
  const id = Number(req.params.id);
  const list = readCommunities();
  const c = list.find(x => x.id === id);
  if(!c) return res.status(404).json({ error: 'community not found' });
  res.json(c.messages || []);
});

// POST /api/communities/:id/messages - post message
app.post('/api/communities/:id/messages', (req, res) => {
  const id = Number(req.params.id);
  const { user, text } = req.body;
  if(!user || !text) return res.status(400).json({ error: 'user and text required' });
  const list = readCommunities();
  const c = list.find(x => x.id === id);
  if(!c) return res.status(404).json({ error: 'community not found' });
  const msg = { id: Date.now(), user, text, createdAt: new Date().toISOString() };
  c.messages = c.messages || [];
  c.messages.push(msg);
  writeCommunities(list);
  res.json(msg);
});

app.listen(PORT, () => {
  console.log(`EduDrop server scaffold running on http://localhost:${PORT}`);
});
