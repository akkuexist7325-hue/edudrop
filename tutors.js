// ===== TUTORS MODULE =====
// All teacher/master related functions

// RENDER TUTORS
function renderTutors() {
    const list = document.getElementById('tutorList');
    const sorted = [...tutors].sort((a, b) => b.boost - a.boost);
    list.innerHTML = sorted.map((t, idx) => `
        <div class="tutor-card group transform transition hover:scale-105 hover:shadow-xl duration-300">
            <div class="bg-white rounded-[2.5rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border ${t.boost ? 'border-amber-400 bg-gradient-to-b from-amber-50 to-white' : 'border-slate-200'} h-full">
                <!-- Card Header with Rating Badge -->
                <div class="${t.boost ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-indigo-500 to-purple-600'} text-white p-4 relative overflow-hidden">
                    <div class="absolute top-0 right-0 opacity-10">
                        <i class="fa-solid fa-sparkles text-5xl"></i>
                    </div>
                    <div class="flex justify-between items-start relative z-10">
                        <div>
                            <p class="text-[11px] font-bold uppercase tracking-wider opacity-90">Expert Teacher</p>
                            <h4 class="font-black text-xl mt-1 flex items-center gap-2">${t.name} ${t.boost ? '<span class="text-2xl">👑</span>' : ''}</h4>
                        </div>
                        <div class="bg-white text-indigo-600 px-3 py-1 rounded-full text-sm font-black">${t.rating}⭐</div>
                    </div>
                </div>
                
                <!-- Card Body -->
                <div class="p-5">
                    <!-- Subject Badge -->
                    <div class="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold mb-4">
                        📚 ${t.sub}
                    </div>
                    
                    <!-- Fee Section -->
                    <div class="bg-gradient-to-r from-slate-50 to-slate-100 p-3 rounded-xl mb-4 border border-slate-200">
                        <p class="text-xs text-slate-500 font-bold uppercase mb-1">Monthly Fee</p>
                        <p class="text-2xl font-black text-indigo-600">₹${t.fee} <span class="text-sm text-slate-500">/month</span></p>
                    </div>
                    
                    <!-- Contact Info -->
                    <div class="bg-slate-50 p-3 rounded-xl mb-4 border border-slate-200">
                        <p class="text-[10px] text-slate-400 uppercase font-black mb-2">📞 Contact Info</p>
                        <p class="font-mono text-sm font-bold tracking-wider ${t.isPaid ? 'text-green-600' : 'contact-blur'}">${t.isPaid ? t.phone : '91-XXXXXXXXXX'}</p>
                    </div>
                    <!-- Social Links -->
                    ${t.social ? `
                    <div class="flex items-center gap-3 mb-4">
                        ${t.social.instagram ? `<a href="${t.social.instagram}" target="_blank" class="text-pink-500"><i class="fa-brands fa-instagram"></i></a>` : ''}
                        ${t.social.facebook ? `<a href="${t.social.facebook}" target="_blank" class="text-blue-700"><i class="fa-brands fa-facebook"></i></a>` : ''}
                        ${t.social.twitter ? `<a href="${t.social.twitter}" target="_blank" class="text-sky-500"><i class="fa-brands fa-x-twitter"></i></a>` : ''}
                        ${t.social.linkedin ? `<a href="${t.social.linkedin}" target="_blank" class="text-blue-600"><i class="fa-brands fa-linkedin"></i></a>` : ''}
                    </div>
                    ` : ''}
                    
                    <!-- Action Buttons -->
                    ${t.isPaid ? `
                        <div class="space-y-2">
                            <button onclick="initUberRoute(${t.id})" class="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl text-xs font-black shadow-md hover:shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
                                <i class="fa-solid fa-map-location-dot"></i> TRACK LOCATION
                            </button>
                            <button onclick="showTeacherLocation(${t.id})" class="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-3 rounded-xl text-xs font-black shadow-md hover:shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
                                <i class="fa-solid fa-map"></i> VIEW ON MAP
                            </button>
                        </div>
                        <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-2.5 rounded-xl border-2 border-green-200 mt-2">
                            <p class="text-[9px] text-green-700 font-black text-center">✅ BOOKING CONFIRMED • TEACHER UNLOCKED</p>
                        </div>
                    ` : `
                        <div class="space-y-2">
                            <button onclick="initUberRoute(${t.id})" class="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2">
                                <i class="fa-solid fa-road"></i> PREVIEW ROUTE
                            </button>
                            <button onclick="processAdmission(${t.id})" class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl text-xs font-black shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
                                <i class="fa-solid fa-check-circle"></i> BOOK ADMISSION
                            </button>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `).join('');
}

// FILTER TUTORS
function filterTutors() {
    const subject = document.getElementById('searchSubject').value.toLowerCase();
    
    let filtered = tutors.filter(t => {
        const matchSubject = t.sub.toLowerCase().includes(subject) || subject === '';
        return matchSubject;
    });
    
    filtered.sort((a, b) => b.boost - a.boost);
    
    const list = document.getElementById('tutorList');
    if(filtered.length === 0) {
        list.innerHTML = '<div class="text-center py-12"><div class="text-6xl mb-4">🔍</div><p class="text-slate-600 font-bold text-lg">No teachers found</p><p class="text-xs text-slate-500 mt-2">Try adjusting your search filters</p></div>';
    } else {
        list.innerHTML = filtered.map((t, idx) => `
            <div class="tutor-card group transform transition hover:scale-105 hover:shadow-xl duration-300">
                <div class="bg-white rounded-[2.5rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border ${t.boost ? 'border-amber-400 bg-gradient-to-b from-amber-50 to-white' : 'border-slate-200'} h-full">
                    <!-- Card Header with Rating Badge -->
                    <div class="${t.boost ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-indigo-500 to-purple-600'} text-white p-4 relative overflow-hidden">
                        <div class="absolute top-0 right-0 opacity-10">
                            <i class="fa-solid fa-sparkles text-5xl"></i>
                        </div>
                        <div class="flex justify-between items-start relative z-10">
                            <div>
                                <p class="text-[11px] font-bold uppercase tracking-wider opacity-90">Expert Teacher</p>
                                <h4 class="font-black text-xl mt-1 flex items-center gap-2">${t.name} ${t.boost ? '<span class="text-2xl">👑</span>' : ''}</h4>
                            </div>
                            <div class="bg-white text-indigo-600 px-3 py-1 rounded-full text-sm font-black">${t.rating}⭐</div>
                        </div>
                    </div>
                    
                    <!-- Card Body -->
                    <div class="p-5">
                        <!-- Subject Badge -->
                        <div class="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold mb-4">
                            📚 ${t.sub}
                        </div>
                        
                        <!-- Fee Section -->
                        <div class="bg-gradient-to-r from-slate-50 to-slate-100 p-3 rounded-xl mb-4 border border-slate-200">
                            <p class="text-xs text-slate-500 font-bold uppercase mb-1">Monthly Fee</p>
                            <p class="text-2xl font-black text-indigo-600">₹${t.fee} <span class="text-sm text-slate-500">/month</span></p>
                        </div>
                        
                        <!-- Contact Info -->
                        <div class="bg-slate-50 p-3 rounded-xl mb-4 border border-slate-200">
                            <p class="text-[10px] text-slate-400 uppercase font-black mb-2">📞 Contact Info</p>
                            <p class="font-mono text-sm font-bold tracking-wider ${t.isPaid ? 'text-green-600' : 'contact-blur'}">${t.isPaid ? t.phone : '91-XXXXXXXXXX'}</p>
                        </div>
                        
                        <!-- Action Buttons -->
                        ${t.isPaid ? `
                            <div class="space-y-2">
                                <button onclick="initUberRoute(${t.id})" class="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl text-xs font-black shadow-md hover:shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
                                    <i class="fa-solid fa-map-location-dot"></i> TRACK LOCATION
                                </button>
                                <button onclick="showTeacherLocation(${t.id})" class="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-3 rounded-xl text-xs font-black shadow-md hover:shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
                                    <i class="fa-solid fa-map"></i> VIEW ON MAP
                                </button>
                            </div>
                            <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-2.5 rounded-xl border-2 border-green-200 mt-2">
                                <p class="text-[9px] text-green-700 font-black text-center">✅ BOOKING CONFIRMED • TEACHER UNLOCKED</p>
                            </div>
                        ` : `
                            <div class="space-y-2">
                                <button onclick="initUberRoute(${t.id})" class="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2">
                                    <i class="fa-solid fa-road"></i> PREVIEW ROUTE
                                </button>
                                <button onclick="processAdmission(${t.id})" class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl text-xs font-black shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
                                    <i class="fa-solid fa-check-circle"></i> BOOK ADMISSION
                                </button>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    document.getElementById('searchResults').innerText = `Found ${filtered.length} teacher${filtered.length !== 1 ? 's' : ''} in your area`;
}

// TEACHER REGISTRATION
function calcRegPrice() {
    let base = parseInt(document.getElementById('regType').value);
    let boost = document.getElementById('regBoost').checked ? 50 : 0;
    document.getElementById('regTotal').innerText = base + boost;
}

function processTeacherReg() {
    let name = document.getElementById('regName').value.trim();
    let phone = document.getElementById('regPhone').value.trim();
    let email = document.getElementById('regEmail').value.trim();
    let subject = document.getElementById('regSubject').value.trim();
    let fee = document.getElementById('regFee').value.trim();
    let bankAccount = document.getElementById('regBankAccount').value.trim();
    let accountHolder = document.getElementById('regAccountHolder').value.trim();
    let ifsc = document.getElementById('regIFSC').value.trim();
    let qrFile = document.getElementById('regQRCode').files[0];
    let base = parseInt(document.getElementById('regType').value);
    let boost = document.getElementById('regBoost').checked ? 50 : 0;
    let total = base + boost;
    
    if(!name || !phone || !email || !subject || !fee) {
        alert('Please fill all required fields');
        return;
    }
    
    if(!bankAccount && !qrFile) {
        alert('Please provide either bank account details or upload a QR code');
        return;
    }
    
    if(bankAccount && (!accountHolder || !ifsc)) {
        alert('Please fill account holder name and IFSC code');
        return;
    }
    
    if(isNaN(fee) || fee <= 0) {
        alert('Please enter a valid monthly fee');
        return;
    }
    
    if(!email.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }
    
    if(phone.length < 10) {
        alert('Please enter a valid phone number');
        return;
    }
    
    let qrCodeData = null;
    if(qrFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            qrCodeData = e.target.result;
            createTeacherProfile(name, phone, email, subject, fee, bankAccount, accountHolder, ifsc, qrCodeData, base, boost, total);
        };
        reader.readAsDataURL(qrFile);
    } else {
        createTeacherProfile(name, phone, email, subject, fee, bankAccount, accountHolder, ifsc, qrCodeData, base, boost, total);
    }
}

function createTeacherProfile(name, phone, email, subject, fee, bankAccount, accountHolder, ifsc, qrCode, base, boost, total) {
    const newTeacher = {
        id: Date.now(),
        name: name,
        phone: phone,
        email: email,
        subject: subject,
        sub: subject,
        fee: parseInt(fee),
        boost: boost > 0,
        lat: 22.5726 + (Math.random() - 0.5) * 0.1,
        lng: 88.3639 + (Math.random() - 0.5) * 0.1,
        isPaid: true,
        rating: 5.0,
        bankAccount: bankAccount,
        accountHolder: accountHolder,
        ifsc: ifsc,
        qrCode: qrCode
    };
    
    tutors.unshift(newTeacher);
    localStorage.setItem('tutors', JSON.stringify(tutors));
    listingRevenue += total;
    totalRevenue += total;
    updateStats();
    closeModal('regModal');
    
    let paymentDetails = bankAccount ? 
        `💳 Bank Account: ${bankAccount}\n📄 IFSC: ${ifsc}` : 
        '📱 Payment QR Code Uploaded';
    
    alert(`✅ Profile created successfully!\n\n👨‍🏫 Name: ${name}\n📚 Subject: ${subject}\n💰 Monthly Fee: ₹${fee}\n${paymentDetails}\n\nPayment of ₹${total} received! You are now live on the map.`);
    
    document.getElementById('regName').value = '';
    document.getElementById('regPhone').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regSubject').value = '';
    document.getElementById('regFee').value = '';
    document.getElementById('regBankAccount').value = '';
    document.getElementById('regAccountHolder').value = '';
    document.getElementById('regIFSC').value = '';
    document.getElementById('regQRCode').value = '';
    document.getElementById('regBoost').checked = false;
    
    renderTutors();
}

function showQRPreview() {
    const qrFile = document.getElementById('regQRCode').files[0];
    if(!qrFile) {
        alert('Please select a QR code image first');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-[9999] bg-slate-900/90 backdrop-blur flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
                <h3 class="text-2xl font-black mb-4">QR Code Preview</h3>
                <div class="bg-slate-100 p-4 rounded-2xl mb-6">
                    <img src="${e.target.result}" class="w-full max-h-80 object-contain">
                </div>
                <p class="text-sm text-slate-600 mb-4">Students will scan this QR to make payments to you</p>
                <button onclick="this.parentElement.parentElement.remove()" class="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition">Close</button>
            </div>
        `;
        document.body.appendChild(modal);
    };
    reader.readAsDataURL(qrFile);
}

console.log('✅ Tutors.js loaded successfully');
