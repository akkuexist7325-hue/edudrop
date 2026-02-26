// Frontend API wrapper for EduDrop backend
// Resolve backend base URL. If frontend is opened from file:// or served from a non-hostname,
// default to localhost:3000 where the dev server runs.
let API_BASE = '';
try {
  const host = location.hostname;
  const proto = location.protocol;
  if (host === 'localhost' || host === '127.0.0.1' || proto === 'file:' || !host) {
    API_BASE = 'http://localhost:3000';
  } else {
    API_BASE = '';
  }
} catch (e) {
  API_BASE = 'http://localhost:3000';
}

async function apiGetTeachers() {
  const res = await fetch(`${API_BASE}/api/teachers`);
  if(!res.ok) throw new Error('Failed to fetch teachers');
  return res.json();
}

async function apiRegisterTeacher(formData) {
  // formData must be a FormData instance
  const res = await fetch(`${API_BASE}/api/teachers`, { method: 'POST', body: formData });
  if(!res.ok) throw new Error('Registration failed');
  return res.json();
}

async function apiVerifyPayment(payload) {
  const res = await fetch(`${API_BASE}/api/payments/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if(!res.ok) throw new Error('Payment verification failed');
  return res.json();
}

async function apiChat(message) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  if(!res.ok) throw new Error('Chat API failed');
  const j = await res.json();
  return j;
}

// Export to global namespace for easy access from existing scripts
window.EduDropAPI = { apiGetTeachers, apiRegisterTeacher, apiVerifyPayment };
// attach chat function too
window.EduDropAPI.apiChat = apiChat;

// Community APIs
async function apiGetCommunities() {
  const res = await fetch(`${API_BASE}/api/communities`);
  if(!res.ok) throw new Error('Failed to fetch communities');
  return res.json();
}

async function apiCreateCommunity(payload) {
  const res = await fetch(`${API_BASE}/api/communities`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
  });
  if(!res.ok) {
    let err = 'Create community failed';
    try { const j = await res.json(); if(j && j.error) err = j.error; } catch(e){}
    throw new Error(err);
  }
  return res.json();
}

async function apiJoinCommunity(id, user) {
  const res = await fetch(`${API_BASE}/api/communities/${id}/join`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user })
  });
  if(!res.ok) throw new Error('Join community failed');
  return res.json();
}

async function apiGetCommunityMessages(id) {
  const res = await fetch(`${API_BASE}/api/communities/${id}/messages`);
  if(!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
}

async function apiPostCommunityMessage(id, payload) {
  const res = await fetch(`${API_BASE}/api/communities/${id}/messages`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
  });
  if(!res.ok) throw new Error('Post message failed');
  return res.json();
}

window.EduDropAPI.apiGetCommunities = apiGetCommunities;
window.EduDropAPI.apiCreateCommunity = apiCreateCommunity;
window.EduDropAPI.apiJoinCommunity = apiJoinCommunity;
window.EduDropAPI.apiGetCommunityMessages = apiGetCommunityMessages;
window.EduDropAPI.apiPostCommunityMessage = apiPostCommunityMessage;
