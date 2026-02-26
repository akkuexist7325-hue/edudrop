// Settings module: save and load user/site settings to localStorage
const SETTINGS_KEY = 'edudrop_settings_v1';

function defaultSettings() {
  return {
    instagram: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    notifications: true,
    profilePrivacy: 'public'
  };
}

function loadSettings() {
  const raw = localStorage.getItem(SETTINGS_KEY);
  let s = raw ? JSON.parse(raw) : defaultSettings();
  document.getElementById('setInstagram').value = s.instagram || '';
  document.getElementById('setFacebook').value = s.facebook || '';
  document.getElementById('setTwitter').value = s.twitter || '';
  document.getElementById('setLinkedin').value = s.linkedin || '';
  document.getElementById('setNotifications').checked = !!s.notifications;
  document.querySelectorAll('input[name="setProfilePrivacy"]').forEach(r => r.checked = (r.value === (s.profilePrivacy || 'public')));
}

function saveSettings() {
  const s = {
    instagram: document.getElementById('setInstagram').value.trim(),
    facebook: document.getElementById('setFacebook').value.trim(),
    twitter: document.getElementById('setTwitter').value.trim(),
    linkedin: document.getElementById('setLinkedin').value.trim(),
    notifications: !!document.getElementById('setNotifications').checked,
    profilePrivacy: document.querySelector('input[name="setProfilePrivacy"]:checked')?.value || 'public'
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  alert('Settings saved');
  closeModal('settingsModal');
}

// Initialize when DOM ready
if (document.readyState !== 'loading') {
  loadSettings();
} else {
  window.addEventListener('DOMContentLoaded', loadSettings);
}

console.log('✅ settings.js loaded');
