// ===== EDUADROP MAIN APPLICATION =====
// Core functionality and navigation

// DATA STORAGE
let tutors = JSON.parse(localStorage.getItem('tutors')) || [
    { id: 1, name: "Dr. Alok Verma", phone: "9876543210", email: "alok@example.com", subject: "Physics", sub: "Physics", fee: 4000, lat: 22.5726, lng: 88.3639, boost: true, isPaid: false, rating: 5.0, bankAccount: "1234567890", accountHolder: "Dr. Alok Verma", ifsc: "HDFC0000001", qrCode: null },
    { id: 2, name: "Sarah Khan", phone: "9123456789", email: "sarah@example.com", subject: "Calculus", sub: "Calculus", fee: 2500, lat: 22.5950, lng: 88.4100, boost: false, isPaid: false, rating: 4.8 }
];

let totalRevenue = 0, commRevenue = 0, listingRevenue = 0;
let currentTutorPayment = null;
// QR scanner state
let qrStream = null;
let qrScanning = false;
let qrScanRequestId = null;

// REVENUE TRACKING
function updateStats() {
    document.getElementById('statTotal').innerText = totalRevenue.toFixed(2);
    document.getElementById('statComm').innerText = commRevenue.toFixed(2);
    document.getElementById('statList').innerText = listingRevenue.toFixed(2);
}

// NAVIGATION
function switchTab(tab) {
    document.getElementById('marketTab').classList.toggle('hidden', tab !== 'market');
    document.getElementById('libraryTab').classList.toggle('hidden', tab !== 'library');
    document.getElementById('notesTab').classList.toggle('hidden', tab !== 'notes');
    document.getElementById('mapsTab').classList.toggle('hidden', tab !== 'maps');
    document.getElementById('adminTab').classList.toggle('hidden', tab !== 'admin');
    
    if(tab === 'notes') {
        renderNotes();
    }
    
    if(tab === 'maps') {
        initializeMapsPageMap();
        renderBookedTeachers();
    }
}

function accessAdminPanel() {
    const password = prompt('Enter admin password:');
    if(password === 'admin123' || password === 'developer') {
        switchTab('admin');
        document.getElementById('nav-admin').classList.remove('hidden');
        alert('✅ Admin access granted!');
    } else if(password) {
        alert('❌ Incorrect password. Admin access denied.');
    }
}

// PROFILE SIDEBAR FUNCTIONS
function toggleProfileSidebar() {
    const sidebar = document.getElementById('profileSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function openProfilePage() {
    openModal('profileModal');
}

function openBookingsPage() {
    alert('📅 My Bookings - Coming Soon!\nView all your teacher bookings and schedules.');
}

function openFavoritesPage() {
    alert('❤️ Favorites - Coming Soon!\nView your favorite teachers and resources.');
}

function openSettingsPage() {
    // Open settings modal implemented in settings.js
    openModal('settingsModal');
}

function openNotificationsPage() {
    alert('🔔 Notifications - Coming Soon!\nManage your notification preferences.');
}

function openPaymentPage() {
    alert('💳 Payment Methods - Coming Soon!\nManage your payment methods and history.');
}

function openHelpPage() {
    alert('❓ Help & Support - Coming Soon!\nGet help with EduDrop.');
}

function openAboutPage() {
    alert('ℹ️ About Us - Coming Soon!\nLearn more about EduDrop.');
}

function logoutUser() {
    if(confirm('Are you sure you want to logout?')) {
        alert('👋 You have been logged out successfully!');
        // Redirect to login page or reset state
        window.location.reload();
    }
}

function openModal(id) { 
    document.getElementById(id).classList.remove('hidden'); 
}

function closeModal(id) { 
    document.getElementById(id).classList.add('hidden'); 
}

// ADMISSION & PAYMENT
function processAdmission(id) {
    const t = tutors.find(x => x.id === id);
    if(!t) return;
    
    currentTutorPayment = t;
    
    document.getElementById('payTeacherName').innerText = t.name;
    document.getElementById('payAmount').innerText = t.fee;
    document.getElementById('paySubject').innerText = t.subject;
    document.getElementById('payTotal').innerText = t.fee;
    
    // show teacher QR section if teacher uploaded a QR image
    const teacherQRSection = document.getElementById('teacherQRSection');
    const teacherQRPreview = document.getElementById('teacherQRPreview');
    if(t.qrCode) {
        if(teacherQRSection) teacherQRSection.classList.remove('hidden');
        if(teacherQRPreview) teacherQRPreview.innerHTML = `<img src="${t.qrCode}" class="w-full h-full object-contain">`;
        // optionally pre-select UPI method
        const upiRadio = document.querySelector('input[name="paymentMethod"][value="upi"]');
        if(upiRadio) upiRadio.checked = true;
    } else {
        if(teacherQRSection) teacherQRSection.classList.add('hidden');
        if(teacherQRPreview) teacherQRPreview.innerHTML = '';
    }

    openModal('paymentModal');
}

function processPayment() {
    if(!document.getElementById('agreeTerms').checked) {
        alert('Please accept the terms and conditions');
        return;
    }

    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const teacher = currentTutorPayment;

    // use confirm button element for UI feedback
    const btn = document.getElementById('confirmPayBtn');
    const originalText = btn ? btn.innerHTML : 'Processing...';
    if(btn) { btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Processing Payment...'; btn.disabled = true; }

    // finalize payment (same flow whether manual or via QR scan)
    finalizePayment(teacher, paymentMethod, null).finally(() => {
        if(btn) { btn.innerHTML = originalText; btn.disabled = false; }
    });
}

// finalizePayment: marks teacher paid, updates revenues and shows notifications
function finalizePayment(teacher, method, extra) {
    return new Promise((resolve) => {
        setTimeout(() => {
            if(!teacher.isPaid) {
                let comm = teacher.fee * 0.05;
                commRevenue += comm;
                totalRevenue += comm;
                teacher.isPaid = true;
                
                updateStats();
                renderTutors();
                closeModal('paymentModal');
                
                showNotification(
                    'Payment Successful!',
                    `✅ You've booked ${teacher.name} for ₹${teacher.fee}/month. Tap below to start tracking their location!`,
                    '📍 Track Location',
                    () => {
                        showTeacherLocation(teacher.id);
                        showRouteToTeacher(teacher.id);
                        const mapSection = document.getElementById('map');
                        if (mapSection) {
                            mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    },
                    7000
                );
                
                setTimeout(() => {
                    showTeacherLocation(teacher.id);
                    showRouteToTeacher(teacher.id);
                }, 1000);
                
                document.getElementById('agreeTerms').checked = false;
                const firstMethod = document.querySelector('input[name="paymentMethod"]');
                if(firstMethod) firstMethod.checked = true;
            }
            resolve();
        }, 900);
    });
}

// QR scanning functions
function openQRScanner() {
    if(qrScanning) return;
    const video = document.getElementById('qrVideo');
    const qrArea = document.getElementById('qrScannerArea');
    const stopBtn = document.getElementById('stopQRScannerBtn');
    const openBtn = document.getElementById('openQRScannerBtn');

    if(openBtn) openBtn.classList.add('hidden');
    if(stopBtn) stopBtn.classList.remove('hidden');
    if(qrArea) qrArea.classList.remove('hidden');

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(stream => {
        qrStream = stream;
        video.srcObject = stream;
        video.play();
        qrScanning = true;
        scanLoop();
    }).catch(err => {
        console.error('Cannot access camera for QR scan', err);
        alert('Unable to access camera. Please allow camera access or try a different browser.');
        if(openBtn) openBtn.classList.remove('hidden');
        if(stopBtn) stopBtn.classList.add('hidden');
        if(qrArea) qrArea.classList.add('hidden');
    });
}

function stopQRScanner() {
    const video = document.getElementById('qrVideo');
    const qrArea = document.getElementById('qrScannerArea');
    const stopBtn = document.getElementById('stopQRScannerBtn');
    const openBtn = document.getElementById('openQRScannerBtn');

    if(qrStream) {
        qrStream.getTracks().forEach(t => t.stop());
        qrStream = null;
    }
    if(video) {
        video.pause();
        video.srcObject = null;
    }
    if(qrScanRequestId) {
        cancelAnimationFrame(qrScanRequestId);
        qrScanRequestId = null;
    }
    qrScanning = false;
    if(openBtn) openBtn.classList.remove('hidden');
    if(stopBtn) stopBtn.classList.add('hidden');
    if(qrArea) qrArea.classList.add('hidden');
}

function scanLoop() {
    const video = document.getElementById('qrVideo');
    const canvas = document.getElementById('qrCanvas');
    const resultEl = document.getElementById('qrResult');
    if(!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
        qrScanRequestId = requestAnimationFrame(scanLoop);
        return;
    }

    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);

    if(window.jsQR) {
        const code = jsQR(imageData.data, width, height);
        if(code) {
            // found QR data
            if(resultEl) resultEl.innerText = `Scanned: ${code.data}`;
            stopQRScanner();
            // finalize payment using QR data
            if(currentTutorPayment) finalizePayment(currentTutorPayment, 'qr', code.data);
            return;
        }
    } else if(window.BarcodeDetector) {
        // optional future support
    }

    qrScanRequestId = requestAnimationFrame(scanLoop);
}

// ===== OPTIMIZED GOOGLE MAP SYSTEM =====
let map = null;
let currentTeacherMarker = null;
let currentInfoWindow = null;
let userMarker = null;
let directionsRenderer = null;
let directionsService = null;
let mapInitialized = false;
let userLocation = { lat: 22.5726, lng: 88.3639 }; // Kolkata default

// Custom Map Styling - Modern and attractive
const customMapStyle = [
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{"color": "#e9f3f5"}, {"lightness": 17}]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{"color": "#f3f0e6"}, {"lightness": 20}]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#fed7aa"}, {"lightness": 24}]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#fef08a"}, {"lightness": 16}]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#ffffff"}, {"lightness": 16}]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{"color": "#f0e6d6"}, {"lightness": 21}]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{"color": "#d5e3b3"}, {"lightness": 21}]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [{"visibility": "on"}, {"color": "#ffffff"}, {"weight": 6}, {"lightness": 16}]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [{"saturation": 36}, {"color": "#333333"}, {"lightness": 40}]
    },
    {
        "elementType": "labels.icon",
        "stylers": [{"visibility": "off"}]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [{"color": "#f2f2f2"}, {"lightness": 19}]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#fefcf0"}, {"lightness": 20}]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [{"color": "#d7dcd6"}, {"lightness": 17}, {"weight": 1.2}]
    }
];

// Initialize Google Map (runs once)
function initializeMap() {
    if (mapInitialized) {
        console.log('ℹ️ Map already initialized');
        return;
    }
    
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('❌ Map container not found');
        return;
    }
    
    if (!window.google || !window.google.maps) {
        console.warn('⏳ Google Maps API loading... (attempt will retry in 500ms)');
        setTimeout(initializeMap, 500);
        return;
    }
    
    try {
        const mapOptions = {
            center: userLocation,
            zoom: 13,
            mapTypeControl: true,
            mapTypeControlOptions: { position: google.maps.ControlPosition.TOP_RIGHT },
            fullscreenControl: true,
            zoomControl: true,
            zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
            streetViewControl: true,
            scaleControl: true,
            gestureHandling: 'greedy',
            clickableIcons: false,
            styles: customMapStyle,
            backgroundColor: '#f0f4ff'
        };
        
        map = new google.maps.Map(mapElement, mapOptions);
        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: false,
            preserveViewport: true,
            polylineOptions: {
                strokeColor: '#4f46e5',
                strokeOpacity: 0.85,
                strokeWeight: 5,
                geodesic: true
            }
        });
        
        mapInitialized = true;
        console.log('✅ Map initialized successfully with custom styling');
        console.log('📍 Center:', userLocation, '| Zoom:', 13);
        
        // Hide error alert if map loads successfully
        const errorAlert = document.getElementById('mapErrorAlert');
        if(errorAlert) {
            errorAlert.classList.add('hidden');
        }
        
        // Ensure map wrapper is visible
        const mapWrapper = document.querySelector('.map-wrapper');
        if(mapWrapper) {
            mapWrapper.style.display = 'block';
        }
        
    } catch (error) {
        console.error('❌ Map Initialization Error:', error.message);
        console.error('Stack:', error.stack);
        showMapErrorAlert();
    }
}

// Show error alert if map fails
function showMapErrorAlert() {
    const errorAlert = document.getElementById('mapErrorAlert');
    if(errorAlert) {
        errorAlert.classList.remove('hidden');
        console.warn('⚠️ Google Maps API unavailable - showing error alert');
    }
}

// Display teacher location efficiently
function showTeacherLocation(teacherId) {
    if (!mapInitialized) initializeMap();
    if (!map) return;
    
    const teacher = tutors.find(t => t.id === teacherId);
    if (!teacher) {
        console.error('❌ Teacher not found');
        return;
    }
    
    const teacherLoc = { lat: parseFloat(teacher.lat), lng: parseFloat(teacher.lng) };
    
    // Validate coordinates
    if (isNaN(teacherLoc.lat) || isNaN(teacherLoc.lng)) {
        console.error('❌ Invalid coordinates');
        return;
    }
    
    // Clear previous marker
    if (currentTeacherMarker) currentTeacherMarker.setMap(null);
    if (currentInfoWindow) currentInfoWindow.close();
    
    // Create enhanced marker
    currentTeacherMarker = new google.maps.Marker({
        map: map,
        position: teacherLoc,
        title: teacher.name,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#4f46e5',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2.5
        },
        animation: google.maps.Animation.DROP
    });
    
    // Create info window with rich content
    currentInfoWindow = new google.maps.InfoWindow({
        content: createTeacherInfoWindow(teacher),
        maxWidth: 280
    });
    
    currentTeacherMarker.addListener('click', () => {
        currentInfoWindow.open(map, currentTeacherMarker);
    });
    
    currentInfoWindow.open(map, currentTeacherMarker);
    map.panTo(teacherLoc);
    map.setZoom(15);
    
    console.log('✅ Showing:', teacher.name);
}

// Generate teacher info window
function createTeacherInfoWindow(teacher) {
    return `
        <div style="font-family: 'Plus Jakarta Sans', Arial; min-width: 240px;">
            <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 12px; color: white; border-radius: 8px 8px 0 0;">
                <h4 style="margin: 0; font-size: 16px; font-weight: bold;">${escapeHtml(teacher.name)}</h4>
                <p style="margin: 4px 0 0 0; font-size: 11px; opacity: 0.9;">👨‍🏫 Teacher</p>
            </div>
            <div style="background: white; padding: 12px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
                <p style="margin: 6px 0; font-size: 13px;"><b>📚 Subject:</b> ${escapeHtml(teacher.sub)}</p>
                <p style="margin: 6px 0; font-size: 13px;"><b>💰 Fee:</b> ₹${teacher.fee}/month</p>
                <p style="margin: 6px 0; font-size: 13px;"><b>⭐ Rating:</b> ${teacher.rating || 'N/A'}/5.0</p>
                <p style="margin: 8px 0 0 0; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 8px;">
                    📍 ${teacher.lat.toFixed(4)}, ${teacher.lng.toFixed(4)}
                </p>
            </div>
        </div>
    `;
}

// Calculate route efficiently
function showRouteToTeacher(teacherId) {
    if (!mapInitialized) initializeMap();
    if (!map) return;
    
    const teacher = tutors.find(t => t.id === teacherId);
    if (!teacher) return;
    
    const teacherLoc = { lat: parseFloat(teacher.lat), lng: parseFloat(teacher.lng) };
    
    showRouteStats('Calculating...', '...');
    
    directionsService.route({
        origin: userLocation,
        destination: teacherLoc,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC
    }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
            
            const leg = result.routes[0].legs[0];
            const distance = (leg.distance.value / 1000).toFixed(1);
            const duration = Math.round(leg.duration.value / 60);
            
            updateRouteStats(distance, duration);
            
            // Fit map to bounds with padding
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(leg.start_location);
            bounds.extend(leg.end_location);
            map.fitBounds(bounds, { top: 50, right: 50, bottom: 120, left: 50 });
            
            console.log(`✅ Route: ${distance}km, ${duration}min`);
        } else {
            showRouteStats('Error', '--');
            console.warn('Route calculation failed:', status);
            
            // Fallback: direct distance
            const dist = calculateDirectDistance(userLocation, teacherLoc);
            updateRouteStats(dist.toFixed(1), Math.round(dist * 2));
        }
    });
}

// Calculate haversine distance
function calculateDirectDistance(p1, p2) {
    const R = 6371;
    const dLat = (p2.lat - p1.lat) * Math.PI / 180;
    const dLng = (p2.lng - p1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Update route stats with animation
function updateRouteStats(distance, duration) {
    const el = document.getElementById('routeStats');
    if (!el) return;
    
    el.classList.remove('hidden');
    
    const distEl = document.getElementById('liveDist');
    const timeEl = document.getElementById('liveTime');
    
    if (distEl) distEl.innerText = distance + ' km';
    if (timeEl) timeEl.innerText = duration + ' min';
}

// Show stats temporarily
function showRouteStats(dist, time) {
    const el = document.getElementById('routeStats');
    if (el) {
        el.classList.remove('hidden');
        if (document.getElementById('liveDist')) document.getElementById('liveDist').innerText = dist;
        if (document.getElementById('liveTime')) document.getElementById('liveTime').innerText = time;
    }
}

// Escape HTML for security
function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}

// Main function for TRACK ROUTE button
function initUberRoute(id) {
    showTeacherLocation(id);
    showRouteToTeacher(id);
}

// Clear route and markers
function clearMapRoute() {
    if (currentTeacherMarker) currentTeacherMarker.setMap(null);
    if (currentInfoWindow) currentInfoWindow.close();
    if (directionsRenderer) directionsRenderer.setDirections({ routes: [] });
    const el = document.getElementById('routeStats');
    if (el) el.classList.add('hidden');
}

// INITIALIZATION
window.addEventListener('load', () => {
// Show notification toast
function showNotification(title, message, actionText, actionCallback, duration = 5000) {
    const toast = document.createElement('div');
    toast.className = 'notification-toast bg-white rounded-[2rem] shadow-2xl border-l-4 border-green-500 p-6';
    toast.innerHTML = `
        <div class="flex items-start gap-4">
            <div class="flex-1">
                <h4 class="font-black text-lg text-slate-900 mb-1">✅ ${title}</h4>
                <p class="text-sm text-slate-600">${message}</p>
                ${actionText ? `
                    <button onclick="this.closest('.notification-toast').removeButtonAction?.()" class="mt-3 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold text-sm hover:shadow-lg transition">
                        ${actionText}
                    </button>
                ` : ''}
            </div>
            <button onclick="this.closest('.notification-toast').remove()" class="text-slate-400 hover:text-slate-600 text-xl">
                ✕
            </button>
        </div>
    `;
    
    if (actionCallback) {
        toast.removeButtonAction = () => {
            actionCallback();
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 400);
        };
    }
    
    document.body.appendChild(toast);
    
    // Auto-remove after duration
    if (duration > 0) {
        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 400);
        }, duration);
    }
}

// Show tracking notification
function showTrackingNotification(teacherId) {
    const teacher = tutors.find(t => t.id === teacherId);
    if (!teacher) return;
    
    showNotification(
        'Booking Confirmed!',
        `Now tracking ${teacher.name}'s location. Distance & time updated in real-time.`,
        '📍 View on Map',
        () => {
            showTeacherLocation(teacherId);
            showRouteToTeacher(teacherId);
            const mapSection = document.getElementById('map');
            if (mapSection) {
                mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        },
        6000
    );
}


    // Initialize map asynchronously
    requestAnimationFrame(() => {
        if (window.google && window.google.maps) {
            initializeMap();
        } else {
            let attempts = 0;
            const checkInterval = setInterval(() => {
                if (window.google && window.google.maps) {
                    initializeMap();
                    clearInterval(checkInterval);
                }
                if (++attempts > 30) clearInterval(checkInterval);
            }, 100);
        }
    });
});

// ===== MAPS PAGE FUNCTIONS =====
let mapsPageMapInitialized = false;
let mapsPageMap = null;
let mapsPageDirectionsRenderer = null;

// Initialize dedicated map for maps page
function initializeMapsPageMap() {
    if (mapsPageMapInitialized) return;
    
    const mapElement = document.getElementById('mapsPageMap');
    if (!mapElement) {
        console.error('❌ Maps page map container not found');
        return;
    }
    
    if (!window.google || !window.google.maps) {
        console.warn('⏳ Google Maps API loading for maps page...');
        setTimeout(initializeMapsPageMap, 500);
        return;
    }
    
    try {
        const mapOptions = {
            center: userLocation,
            zoom: 13,
            mapTypeControl: true,
            fullscreenControl: true,
            zoomControl: true,
            streetViewControl: true,
            scaleControl: true,
            gestureHandling: 'greedy',
            clickableIcons: false,
            styles: customMapStyle,
            backgroundColor: '#f0f4ff'
        };
        
        mapsPageMap = new google.maps.Map(mapElement, mapOptions);
        mapsPageDirectionsRenderer = new google.maps.DirectionsRenderer({
            map: mapsPageMap,
            suppressMarkers: false,
            preserveViewport: true,
            polylineOptions: {
                strokeColor: '#dc2626',
                strokeOpacity: 0.85,
                strokeWeight: 5,
                geodesic: true
            }
        });
        
        mapsPageMapInitialized = true;
        console.log('✅ Maps page map initialized');
    } catch (error) {
        console.error('❌ Maps page map error:', error.message);
    }
}

// Render list of booked teachers
function renderBookedTeachers() {
    const bookedTeachers = tutors.filter(t => t.isPaid);
    const list = document.getElementById('bookedTeachersList');
    
    if (bookedTeachers.length === 0) {
        list.innerHTML = '<div class="text-center py-8"><div class="text-4xl mb-3">🎓</div><p class="text-slate-500 font-bold">No bookings yet</p><p class="text-xs text-slate-400 mt-1">Book a teacher to see them here</p></div>';
    } else {
        list.innerHTML = bookedTeachers.map(t => `
            <div class="bg-white p-4 rounded-xl border border-slate-200 hover:border-red-500 hover:shadow-lg transition cursor-pointer" onclick="showTeacherOnMapsPage(${t.id})">
                <div class="flex items-start justify-between mb-2">
                    <div>
                        <h4 class="font-black text-sm text-slate-900">${t.name}</h4>
                        <p class="text-xs text-slate-500">📚 ${t.sub}</p>
                    </div>
                    <span class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">✓</span>
                </div>
                <div class="bg-slate-50 p-2 rounded text-xs font-mono">
                    📍 ${t.lat.toFixed(4)}, ${t.lng.toFixed(4)}
                </div>
                <div class="mt-2 space-y-1">
                    <button onclick="event.stopPropagation(); showTeacherOnMapsPage(${t.id})" class="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded text-xs font-bold transition">View Location</button>
                    <button onclick="event.stopPropagation(); showRouteOnMapsPage(${t.id})" class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-xs font-bold transition">Show Route</button>
                </div>
            </div>
        `).join('');
    }
}

// Show teacher location on maps page
function showTeacherOnMapsPage(teacherId) {
    if (!mapsPageMapInitialized) initializeMapsPageMap();
    if (!mapsPageMap) return;
    
    const teacher = tutors.find(t => t.id === teacherId);
    if (!teacher || !teacher.isPaid) return;
    
    const teacherLoc = { lat: parseFloat(teacher.lat), lng: parseFloat(teacher.lng) };
    
    mapsPageMap.setCenter(teacherLoc);
    mapsPageMap.setZoom(15);
    
    // Clear previous markers
    if (currentTeacherMarker) currentTeacherMarker.setMap(null);
    if (currentInfoWindow) currentInfoWindow.close();
    
    // Add marker
    currentTeacherMarker = new google.maps.Marker({
        position: teacherLoc,
        map: mapsPageMap,
        title: teacher.name,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: '#dc2626',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
        }
    });
    
    // Info window
    currentInfoWindow = new google.maps.InfoWindow({
        content: `<div style="padding: 8px; font-size: 12px;"><strong>${teacher.name}</strong><br/>${teacher.sub}<br/>₹${teacher.fee}/month</div>`,
        position: teacherLoc
    });
    
    currentInfoWindow.open(mapsPageMap, currentTeacherMarker);
    
    // Update route stats
    const routeStats = document.getElementById('mapsPageRouteStats');
    if (routeStats) {
        routeStats.classList.remove('hidden');
        document.getElementById('mapsPageTeacher').textContent = teacher.name;
        document.getElementById('mapsPageDist').textContent = '--';
        document.getElementById('mapsPageTime').textContent = '--';
    }
}

// Show route on maps page
function showRouteOnMapsPage(teacherId) {
    if (!mapsPageMapInitialized) initializeMapsPageMap();
    if (!mapsPageMap || !directionsService || !mapsPageDirectionsRenderer) return;
    
    const teacher = tutors.find(t => t.id === teacherId);
    if (!teacher || !teacher.isPaid) return;
    
    const teacherLoc = { lat: parseFloat(teacher.lat), lng: parseFloat(teacher.lng) };
    
    // Request route
    directionsService.route({
        origin: userLocation,
        destination: teacherLoc,
        travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            mapsPageDirectionsRenderer.setDirections(result);
            
            const route = result.routes[0].legs[0];
            document.getElementById('mapsPageDist').textContent = route.distance.text;
            document.getElementById('mapsPageTime').textContent = route.duration.text;
        } else {
            console.error('❌ Route error:', status);
        }
    });
}

// Clear map location
function clearMapLocation() {
    if (mapsPageMap) {
        if (currentTeacherMarker) {
            currentTeacherMarker.setMap(null);
            currentTeacherMarker = null;
        }
        if (currentInfoWindow) {
            currentInfoWindow.close();
            currentInfoWindow = null;
        }
        if (mapsPageDirectionsRenderer) {
            mapsPageDirectionsRenderer.setDirections({ routes: [] });
        }
        document.getElementById('mapsPageRouteStats').classList.add('hidden');
    }
}

// Center map on user
function centerMapOnUser() {
    if (mapsPageMap) {
        mapsPageMap.setCenter(userLocation);
        mapsPageMap.setZoom(13);
    }
}

console.log('✅ Main.js loaded - Map system ready');
