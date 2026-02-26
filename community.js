// Community UI and integration
// Requires EduDropAPI from js/api.js

let currentCommunityId = null;
let communityPollInterval = null;

function openCommunityModal() {
  const modal = document.getElementById('communityModal');
  if(!modal) return;
  modal.classList.remove('hidden');
  loadCommunities();
}

function closeCommunityModal() {
  const modal = document.getElementById('communityModal');
  if(!modal) return;
  modal.classList.add('hidden');
  stopPollingMessages();
}

async function loadCommunities() {
  const listEl = document.getElementById('communityList');
  if(!listEl) return;
  listEl.innerHTML = '<p class="text-sm text-slate-500">Loading communities...</p>';
  try {
    const data = await window.EduDropAPI.apiGetCommunities();
    if(!Array.isArray(data) || data.length === 0) {
      listEl.innerHTML = '<p class="text-sm text-slate-500">No communities yet. Create one!</p>';
      return;
    }
    listEl.innerHTML = data.map(c => `
      <div class="p-3 border rounded-xl mb-2 flex justify-between items-center">
        <div>
          <div class="font-bold">${escapeHtml(c.title)}</div>
          <div class="text-xs text-slate-500">Course: ${escapeHtml(c.course)} • Members: ${c.members ? c.members.length : 0}</div>
        </div>
        <div>
          <button onclick="showCommunity(${c.id})" class="bg-indigo-600 text-white px-3 py-2 rounded-xl text-xs">Open</button>
        </div>
      </div>
    `).join('');
  } catch (e) {
    const msg = e && e.message ? e.message : 'Failed to load communities';
    listEl.innerHTML = `<p class="text-sm text-red-500">${escapeHtml(msg)}</p>`;
    console.error('loadCommunities error:', e);
  }
}

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]; }); }

async function createCommunity() {
  const title = document.getElementById('commTitle').value.trim();
  const course = document.getElementById('commCourse').value.trim();
  const description = document.getElementById('commDesc').value.trim();
  const creator = document.getElementById('commCreator').value.trim() || 'Anonymous';
  if(!title || !course) { alert('Please enter title and course'); return; }
  try {
    const res = await window.EduDropAPI.apiCreateCommunity({ title, course, description, creator });
    document.getElementById('commTitle').value=''; document.getElementById('commCourse').value=''; document.getElementById('commDesc').value='';
    loadCommunities();
    showCommunity(res.id);
  } catch (e) { 
    console.error('createCommunity error', e);
    const msg = e && e.message ? e.message : 'Could not create community';
    alert(`Could not create community: ${msg}`);
  }
}

async function showCommunity(id) {
  currentCommunityId = id;
  // join as current user (frontend simple flow: ask name)
  let user = prompt('Enter your display name to join this community:','Student');
  if(!user) return;
  try {
    await window.EduDropAPI.apiJoinCommunity(id, user);
  } catch(e){ console.warn('Join failed', e); }

  // show community panel
  document.getElementById('communityListView').classList.add('hidden');
  document.getElementById('communityChatView').classList.remove('hidden');
  document.getElementById('communityTitleLabel').innerText = 'Community';
  startPollingMessages();
}

async function loadMessages() {
  if(!currentCommunityId) return;
  try {
    const msgs = await window.EduDropAPI.apiGetCommunityMessages(currentCommunityId);
    const feed = document.getElementById('communityMessages');
    if(!feed) return;
    if(!Array.isArray(msgs) || msgs.length === 0) { feed.innerHTML = '<p class="text-sm text-slate-500">No messages yet</p>'; return; }
    feed.innerHTML = msgs.map(m => `
      <div class="p-2 mb-2 border rounded-xl">
        <div class="text-xs text-slate-500">${escapeHtml(new Date(m.createdAt).toLocaleString())} • <b>${escapeHtml(m.user)}</b></div>
        <div class="mt-1">${escapeHtml(m.text)}</div>
      </div>
    `).join('');
    feed.scrollTop = feed.scrollHeight;
  } catch(e){ console.error(e); }
}

async function postMessage() {
  const input = document.getElementById('commMessageInput');
  const text = input.value.trim();
  if(!text) return;
  const user = document.getElementById('commSenderName').value.trim() || 'Student';
  try {
    await window.EduDropAPI.apiPostCommunityMessage(currentCommunityId, { user, text });
    input.value='';
    loadMessages();
  } catch(e){ console.error(e); alert('Failed to post message'); }
}

function startPollingMessages(){ loadMessages(); stopPollingMessages(); communityPollInterval = setInterval(loadMessages, 3000); }
function stopPollingMessages(){ if(communityPollInterval) clearInterval(communityPollInterval); communityPollInterval = null; }

// Simple back navigation
function backToList(){ document.getElementById('communityListView').classList.remove('hidden'); document.getElementById('communityChatView').classList.add('hidden'); currentCommunityId = null; stopPollingMessages(); }

console.log('✅ community.js loaded');
