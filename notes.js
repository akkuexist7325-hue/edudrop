// ===== NOTES MODULE =====
// All notes-related functions for "Notes by Master" section

// NOTES DATA
let notes = [
    { id: 1, title: "Calculus - Differentiation", teacher: "Dr. Alok Verma", subject: "Mathematics", pages: 15, date: "2024-02-20", type: "handwritten", tags: ["Calculus", "Derivatives"] },
    { id: 2, title: "Physics - Thermodynamics", teacher: "Sarah Khan", subject: "Physics", pages: 20, date: "2024-02-19", type: "handwritten", tags: ["Thermodynamics", "Heat"] },
    { id: 3, title: "Chemistry - Organic Reactions", teacher: "Arjun Rao", subject: "Chemistry", pages: 18, date: "2024-02-18", type: "handwritten", tags: ["Organic", "Reactions"] },
    { id: 4, title: "Biology - Photosynthesis", teacher: "Dr. Alok Verma", subject: "Biology", pages: 12, date: "2024-02-17", type: "handwritten", tags: ["Photosynthesis", "Plants"] },
    { id: 5, title: "English - Poetry Analysis", teacher: "Sarah Khan", subject: "English", pages: 14, date: "2024-02-16", type: "handwritten", tags: ["Poetry", "Literature"] },
    { id: 6, title: "History - Ancient India", teacher: "Arjun Rao", subject: "History", pages: 16, date: "2024-02-15", type: "handwritten", tags: ["History", "Ancient"] },
    { id: 7, title: "Algebra - Quadratic Equations", teacher: "Dr. Alok Verma", subject: "Mathematics", pages: 17, date: "2024-02-14", type: "handwritten", tags: ["Algebra", "Equations"] },
    { id: 8, title: "Physics - Optics", teacher: "Sarah Khan", subject: "Physics", pages: 19, date: "2024-02-13", type: "handwritten", tags: ["Optics", "Light"] },
    { id: 9, title: "Chemistry - Periodic Table", teacher: "Arjun Rao", subject: "Chemistry", pages: 11, date: "2024-02-12", type: "handwritten", tags: ["Chemistry", "Elements"] }
];
let currentNotesFilter = 'all';

// RENDER NOTES
function renderNotes() {
    const grid = document.getElementById('notesGrid');
    if(!grid) return;
    
    grid.innerHTML = notes.map(note => `
        <div class="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-purple-100 hover:border-purple-300 group">
            <div class="bg-gradient-to-r from-purple-500 to-pink-500 p-4 relative h-32 flex items-end">
                <div>
                    <p class="text-xs font-bold text-purple-100 uppercase">📝 ${note.type === 'handwritten' ? 'Handwritten Notes' : 'Typed Notes'}</p>
                    <h3 class="text-xl font-black text-white group-hover:text-yellow-200 transition">${note.title}</h3>
                </div>
            </div>
            <div class="p-5">
                <div class="flex items-center gap-2 mb-3">
                    <i class="fa-solid fa-chalkboard-user text-purple-600"></i>
                    <p class="font-bold text-slate-800">${note.teacher}</p>
                </div>
                <div class="flex justify-between mb-4 pb-4 border-b border-slate-200">
                    <div>
                        <p class="text-xs text-slate-500 font-bold">Subject</p>
                        <p class="font-bold text-slate-700">${note.subject}</p>
                    </div>
                    <div>
                        <p class="text-xs text-slate-500 font-bold">Pages</p>
                        <p class="font-bold text-slate-700">${note.pages} 📄</p>
                    </div>
                </div>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${note.tags.map(tag => `<span class="text-[10px] bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-bold">${tag}</span>`).join('')}
                </div>
                <div class="flex gap-2">
                    <button class="flex-1 bg-purple-600 text-white py-3 rounded-xl text-xs font-bold hover:bg-purple-700 transition shadow-lg">
                        <i class="fa-solid fa-download mr-1"></i> Download
                    </button>
                    <button class="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl text-xs font-bold hover:bg-slate-200 transition">
                        <i class="fa-solid fa-eye mr-1"></i> Preview
                    </button>
                </div>
                <p class="text-[10px] text-slate-400 mt-3 text-center">Added: ${new Date(note.date).toLocaleDateString()}</p>
            </div>
        </div>
    `).join('');
}

// FILTER NOTES
function filterNotes() {
    const teacherSearch = document.getElementById('searchTeacherNotes').value.toLowerCase();
    const subjectSearch = document.getElementById('searchSubjectNotes').value.toLowerCase();

    let filtered = notes.filter(note => {
        const matchTeacher = note.teacher.toLowerCase().includes(teacherSearch) || teacherSearch === '';
        const matchSubject = note.subject.toLowerCase().includes(subjectSearch) || subjectSearch === '';
        const matchFilter = currentNotesFilter === 'all' || 
                           (currentNotesFilter === 'handwritten' && note.type === 'handwritten') ||
                           (currentNotesFilter === 'recent' && new Date(note.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
        
        return matchTeacher && matchSubject && matchFilter;
    });

    const grid = document.getElementById('notesGrid');
    if(filtered.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center py-12"><i class="fa-solid fa-note-sticky text-slate-300 text-6xl mb-4 block"></i><p class="text-slate-400 font-bold text-lg">No notes found</p></div>';
        return;
    }

    grid.innerHTML = filtered.map(note => `
        <div class="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-purple-100 hover:border-purple-300 group">
            <div class="bg-gradient-to-r from-purple-500 to-pink-500 p-4 relative h-32 flex items-end">
                <div>
                    <p class="text-xs font-bold text-purple-100 uppercase">📝 ${note.type === 'handwritten' ? 'Handwritten Notes' : 'Typed Notes'}</p>
                    <h3 class="text-xl font-black text-white group-hover:text-yellow-200 transition">${note.title}</h3>
                </div>
            </div>
            <div class="p-5">
                <div class="flex items-center gap-2 mb-3">
                    <i class="fa-solid fa-chalkboard-user text-purple-600"></i>
                    <p class="font-bold text-slate-800">${note.teacher}</p>
                </div>
                <div class="flex justify-between mb-4 pb-4 border-b border-slate-200">
                    <div>
                        <p class="text-xs text-slate-500 font-bold">Subject</p>
                        <p class="font-bold text-slate-700">${note.subject}</p>
                    </div>
                    <div>
                        <p class="text-xs text-slate-500 font-bold">Pages</p>
                        <p class="font-bold text-slate-700">${note.pages} 📄</p>
                    </div>
                </div>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${note.tags.map(tag => `<span class="text-[10px] bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-bold">${tag}</span>`).join('')}
                </div>
                <div class="flex gap-2">
                    <button class="flex-1 bg-purple-600 text-white py-3 rounded-xl text-xs font-bold hover:bg-purple-700 transition shadow-lg">
                        <i class="fa-solid fa-download mr-1"></i> Download
                    </button>
                    <button class="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl text-xs font-bold hover:bg-slate-200 transition">
                        <i class="fa-solid fa-eye mr-1"></i> Preview
                    </button>
                </div>
                <p class="text-[10px] text-slate-400 mt-3 text-center">Added: ${new Date(note.date).toLocaleDateString()}</p>
            </div>
        </div>
    `).join('');
}

function filterNotesBy(type) {
    currentNotesFilter = type;
    filterNotes();
}

// UPLOAD NOTES (TEACHER ONLY)
function openUploadNotesModal() {
    if(tutors.length === 0) {
        alert('⚠️ Only registered teachers can upload notes.\n\nPlease register as a teacher first by clicking "Join as Teacher"');
        return;
    }
    
    openModal('uploadNotesModal');
}

function submitNoteUpload() {
    const teacherEmail = document.getElementById('uploadTeacherEmail').value.trim();
    const title = document.getElementById('uploadNoteTitle').value.trim();
    const subject = document.getElementById('uploadSubject').value;
    const pages = document.getElementById('uploadPages').value;
    const tagsInput = document.getElementById('uploadTags').value;
    const description = document.getElementById('uploadDescription').value.trim();
    const file = document.getElementById('uploadNoteFile').files[0];
    const isPremium = document.getElementById('uploadPremium').checked;
    const agree = document.getElementById('uploadAgree').checked;

    if(!teacherEmail || !title || !subject || !pages || !file) {
        alert('❌ Please fill all required fields and upload a file');
        return;
    }

    if(!agree) {
        alert('❌ Please confirm you have the rights to share these notes');
        return;
    }

    const teacher = tutors.find(t => t.email.toLowerCase() === teacherEmail.toLowerCase());
    if(!teacher) {
        alert('❌ Email not found in registered teachers.\n\nMake sure you use the same email as your teacher registration.');
        return;
    }

    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);

    const reader = new FileReader();
    reader.onload = function(e) {
        const newNote = {
            id: Date.now(),
            title: title,
            teacher: teacher.name,
            subject: subject,
            pages: parseInt(pages),
            date: new Date().toISOString().split('T')[0],
            type: 'handwritten',
            tags: tags.length > 0 ? tags : [subject],
            description: description,
            fileData: e.target.result,
            isPremium: isPremium,
            uploadedBy: teacherEmail
        };

        notes.unshift(newNote);
        closeModal('uploadNotesModal');

        alert(`✅ Notes Uploaded Successfully!\n\n📝 ${title}\n👨‍🏫 ${teacher.name}\n📚 ${subject}\n📄 ${pages} pages\n\n${isPremium ? '⭐ Premium note (+₹99)' : 'Free note'}\n\nYour notes are now live on the platform!`);

        document.getElementById('uploadNoteTitle').value = '';
        document.getElementById('uploadSubject').value = '';
        document.getElementById('uploadPages').value = '';
        document.getElementById('uploadTags').value = '';
        document.getElementById('uploadDescription').value = '';
        document.getElementById('uploadNoteFile').value = '';
        document.getElementById('uploadTeacherEmail').value = '';
        document.getElementById('uploadPremium').checked = false;
        document.getElementById('uploadAgree').checked = false;
        document.getElementById('uploadFileName').textContent = '';

        renderNotes();
    };

    reader.readAsDataURL(file);
}

console.log('✅ Notes.js loaded successfully');
