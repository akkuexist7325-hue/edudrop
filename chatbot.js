// ===== CHATBOT MODULE =====
// AI Chatbot functionality for intelligent user support

// CHATBOT RESPONSES DATABASE
const chatResponses = {
    'hello': 'Hey there! 👋 Welcome to EduDrop! How can I help you today? I can assist with finding tutors, books, notes, payments, and more!',
    'hi': 'Hello! 👋 I\'m your EduDrop assistant. What can I do for you?',
    'tutors': 'Looking for a tutor? 🧑‍🏫 Visit the "Master Dhoondo" section to search and filter tutors by subject and location. Each tutor shows their experience, fees, and contact details!',
    'search': 'You can search for tutors by subject in the "Master Dhoondo" tab. Just type the subject name and we\'ll show tutors near you! 🔍',
    'books': 'Check out our "Digital Library" 📚 with free and paid books on various subjects. You can browse, search, and buy books directly!',
    'library': 'Our Digital Library has 100+ books including free and premium content. Visit the Library tab to explore! 📖',
    'notes': 'Students can find handwritten notes from teachers in the "Notes by Master" section. Teachers can upload notes there too! 📝',
    'upload': 'Teachers can upload handwritten notes from the "Notes by Master" tab. Just verify your email and upload PDF or images! 📤',
    'teacher': 'Want to become a teacher? Click "Join as Teacher" to register with your details, and you can start accepting students! 👨‍🏫',
    'payment': 'We support multiple payment methods: Credit/Debit Card, UPI, Google Pay, PayTM, and more! 💳',
    'pay': 'Payment is secure and instant. Choose your preferred payment method and you\'re done! ✅',
    'price': 'Prices vary by tutor and subject. Teachers set their own fees, and books have different prices displayed in the library! 💰',
    'fee': 'Teacher fees depend on their experience and subject. Check the tutor cards for pricing! 📊',
    'help': 'I can help with: finding tutors, browsing books, uploading notes, payments, teacher registration, and more! What do you need? 🎯',
    'register': 'Click "Join as Teacher" to register as a tutor. We\'ll collect your details like email, phone, subjects, and fees! 📋',
    'join': 'Ready to teach? Click "Join as Teacher" and fill in your information. You\'ll be live immediately! 🚀',
    'subject': 'We support many subjects: Mathematics, Physics, Chemistry, Biology, English, History, and more! 📚',
    'nearby': 'Our location-based search shows tutors near you using your city/neighborhood information! 📍',
    'rating': 'All tutors display their ratings and reviews from students. Check them before selecting! ⭐',
    'contact': 'After payment, you\'ll unlock the tutor\'s contact details (phone, email, address)! 📞',
    'free': 'We have free books and free tutors who offer introductory sessions! Check them out! 🎁',
    'premium': 'Premium tutors and paid books offer specialized content and expertise! 👑',
    'download': 'Download books and notes directly to your device! 📥',
    'offline': 'Download content and access it offline. Perfect for learning on the go! 📱',
    'account': 'Create or login to your account to save favorites, purchases, and upload content! 👤',
    'profile': 'Update your profile with interests, subjects, and preferred learning style! 🎨',
    'security': 'Your data is secure and encrypted. We don\'t share your information! 🔐',
    'refund': 'Not satisfied? Get refunds within 7 days of purchase! 💵',
    'complaint': 'To file a complaint, use the "Connect with Us" section in the app! We\'ll resolve it ASAP! ⚠️',
    'issue': 'Having problems? Tell me what\'s wrong and I\'ll help! Or contact our support team! 🆘',
    'bug': 'Found a bug? Report it through the app, and our team will fix it! 🐛',
    'feature': 'Have a feature request? We love suggestions! Share your ideas with us! 💡',
    'thanks': 'You\'re welcome! Happy learning! 😊',
    'thank you': 'My pleasure! If you need anything else, just ask! 🙏',
    'bye': 'Goodbye! Happy learning on EduDrop! 👋',
    'quit': 'See you soon! Keep learning! 🚀',
    'default': 'I didn\'t quite understand that. Can you rephrase? Or ask about tutors, books, notes, payments, and registration! 🤔'
};

let chatMessages = [];
let isChatOpen = false;

// voice related
let recognition = null;
let isRecognizing = false;

// TOGGLE CHATBOT
function toggleChatbot() {
    const chatbox = document.getElementById('chatbot'); // correct id from index.html
    if(!chatbox) return;

    isChatOpen = !isChatOpen;
    chatbox.style.display = isChatOpen ? 'flex' : 'none';
    chatbox.classList.add('animate__animated', 'animate__fadeIn');

    // only add a welcome bot message if the messages container has no children
    const messagesEl = document.getElementById('chatMessages');
    if(isChatOpen && messagesEl && messagesEl.children.length === 0) {
        addChatMessage('bot', chatResponses['hello']);
    }
}

// ADD CHAT MESSAGE
function addChatMessage(sender, message) {
    const chatMessages = document.getElementById('chatMessages');
    if(!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `mb-3 flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`;
    
    const msgContent = document.createElement('div');
    msgContent.className = sender === 'user' ? 
        'bg-blue-600 text-white rounded-2xl px-4 py-2 max-w-xs text-sm shadow-lg' : 
        'bg-slate-200 text-slate-800 rounded-2xl px-4 py-2 max-w-xs text-sm shadow-lg';
    
    msgContent.innerHTML = message;
    messageDiv.appendChild(msgContent);
    chatMessages.appendChild(messageDiv);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// SEND CHAT MESSAGE
function sendChatMessage() {
    const input = document.getElementById('chatInput');
    if(!input) return;
    
    const userMessage = input.value.trim();
    if(!userMessage) return;
    
    addChatMessage('user', userMessage);
    input.value = '';
    
    // give a little typing delay and process bot response
    setTimeout(() => processBotResponse(userMessage), 500);
}

// HANDLE CHAT KEYPRESS
function handleChatKeypress(event) {
    if(event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendChatMessage();
    }
}

// extract bot response logic for reuse
async function processBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();

    // Try server-side chatbot first if available
    if(window && window.EduDropAPI && typeof window.EduDropAPI.apiChat === 'function') {
        try {
            const res = await window.EduDropAPI.apiChat(userMessage);
            if(res && res.reply) {
                addChatMessage('bot', res.reply);
                speakText(res.reply);
                return;
            }
        } catch (e) {
            console.warn('Chat API failed, falling back to local responses', e);
            // continue to local fallback
        }
    }

    // Local fallback (client-side) matching
    let response = chatResponses['default'];
    for(const [key, value] of Object.entries(chatResponses)) {
        if(key !== 'default' && lowerMessage.includes(key)) {
            response = value;
            break;
        }
    }

    addChatMessage('bot', response);
    speakText(response);
}

// text-to-speech for bot replies
function speakText(text) {
    if('speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'en-US';
        // optionally adjust voice, rate, pitch
        speechSynthesis.speak(utter);
    }
}

// initialize speech recognition if supported
function initializeVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SpeechRecognition) {
        console.warn('⚠️ SpeechRecognition API not available in this browser');
        return;
    }
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        addChatMessage('user', transcript);
        processBotResponse(transcript);
    };
    recognition.onend = () => {
        isRecognizing = false;
        updateMicButton();
    };
    recognition.onerror = (e) => {
        console.error('Speech recognition error:', e);
        isRecognizing = false;
        updateMicButton();
    };
}

function toggleVoiceRecognition() {
    if(!recognition) return;
    if(isRecognizing) {
        recognition.stop();
    } else {
        recognition.start();
        isRecognizing = true;
    }
    updateMicButton();
}

function updateMicButton() {
    const micBtn = document.getElementById('micButton');
    if(!micBtn) return;
    micBtn.innerHTML = isRecognizing ? '<i class="fa-solid fa-microphone-slash"></i>' : '<i class="fa-solid fa-microphone"></i>';
}

// auto initialize when script loads
// ensure recognition is initialized even if script loads after DOMContentLoaded
if (document.readyState !== 'loading') {
    initializeVoiceRecognition();
} else {
    window.addEventListener('DOMContentLoaded', initializeVoiceRecognition);
}

console.log('✅ Chatbot.js loaded successfully');
