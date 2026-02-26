// Profile publishing: attach saved settings to a teacher listing by email
const SETTINGS_KEY = 'edudrop_settings_v1';

function loadProfileModal() {
  const sRaw = localStorage.getItem(SETTINGS_KEY);
  let s = sRaw ? JSON.parse(sRaw) : null;
  document.getElementById('profileInstagram').innerText = s && s.instagram ? s.instagram : '-';
  document.getElementById('profileFacebook').innerText = s && s.facebook ? s.facebook : '-';
  document.getElementById('profileTwitter').innerText = s && s.twitter ? s.twitter : '-';
  document.getElementById('profileLinkedin').innerText = s && s.linkedin ? s.linkedin : '-';
}

async function publishProfileToTeacher() {
  const email = document.getElementById('profileTeacherEmail').value.trim();
  if(!email) { alert('Please enter the teacher email used during registration'); return; }

  const sRaw = localStorage.getItem(SETTINGS_KEY);
  if(!sRaw) { alert('No settings found. Please set your social links in Settings first.'); return; }
  const s = JSON.parse(sRaw);

  // find teacher in local tutors list
  const t = tutors.find(x => x.email && x.email.toLowerCase() === email.toLowerCase());
  if(!t) {
    alert('No teacher found with that email in local listings. Make sure you registered first.');
    return;
  }

  // attach social links to teacher
  t.social = {
    instagram: s.instagram || '',
    facebook: s.facebook || '',
    twitter: s.twitter || '',
    linkedin: s.linkedin || ''
  };

  // persist tutors
  localStorage.setItem('tutors', JSON.stringify(tutors));
  renderTutors();
  alert('Profile links published to your teacher listing.');
  closeModal('profileModal');
}

// initialize when modal opens; add event listener to show values each time
if (document.readyState !== 'loading') {
  document.addEventListener('click', (e) => {
    if(e.target && (e.target.id === 'openProfileBtn' || e.target.closest('#profileModal'))) return;
  });
  // also run once
  loadProfileModal();
} else {
  window.addEventListener('DOMContentLoaded', loadProfileModal);
}

// Update displayed profile values when profile modal is opened
const originalOpenModal = window.openModal;
window.openModal = function(id) {
  if(id === 'profileModal') loadProfileModal();
  return originalOpenModal(id);
};
