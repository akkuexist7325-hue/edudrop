// ===== BOOKS MODULE =====
// All library and books-related functions for "Digital Library" section

let books = [];

function loadBooks() {
    try {
        const raw = localStorage.getItem('edudrop_books');
        books = raw ? JSON.parse(raw) : [];
    } catch (e) {
        books = [];
    }
}

function saveBooks() {
    localStorage.setItem('edudrop_books', JSON.stringify(books));
}

function renderBooks() {
    loadBooks();
    const grid = document.getElementById('bookGrid');
    if (!grid) return;
    grid.innerHTML = '';
    books.forEach((b, i) => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl p-4 shadow-md';
        card.innerHTML = `
            <div class="text-4xl">${b.cover || '📚'}</div>
            <h4 class="font-bold">${b.title}</h4>
            <div class="text-sm text-slate-500">${b.author || ''} • ${b.subject || ''}</div>
            <div class="mt-2 flex items-center justify-between">
                <div class="text-indigo-600 font-bold">${b.type === 'free' ? 'Free' : '₹' + (b.price || 0)}</div>
                <button class="text-sm text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">Open</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function addBook(payload) {
    loadBooks();
    const book = {
        title: payload.title || 'Untitled',
        author: payload.author || '',
        subject: payload.subject || '',
        pages: Number(payload.pages || 0),
        price: Number(payload.price || 0),
        type: payload.type || (payload.price > 0 ? 'paid' : 'free'),
        cover: payload.cover || '📚',
        createdAt: new Date().toISOString()
    };
    books.unshift(book);
    saveBooks();
    renderBooks();
}

// helper used by modal
function submitNewBook() {
    const title = document.getElementById('newBookTitle').value.trim();
    const author = document.getElementById('newBookAuthor').value.trim();
    const subject = document.getElementById('newBookSubject').value.trim();
    const pages = Number(document.getElementById('newBookPages').value || 0);
    const price = Number(document.getElementById('newBookPrice').value || 0);
    const type = document.getElementById('newBookType').value;
    const cover = document.getElementById('newBookCover').value.trim() || '📚';

    if (!title) {
        alert('Please enter a title');
        return;
    }

    addBook({ title, author, subject, pages, price, type, cover });
    closeModal('addBookModal');
}

window.EduDrop = window.EduDrop || {};
window.EduDrop.addBook = addBook;

document.addEventListener('DOMContentLoaded', () => {
    renderBooks();
});
// NOTE: earlier versions of this file included inline HTML markup and
// a second implementation of `addBook` which caused syntax errors and
// confusion. Those have been removed. The primary `addBook` is defined
// above and exported via window.EduDrop.

// SEARCH BOOKS
function searchBooks() {
    loadBooks();
    const searchTerm = (document.getElementById('bookSearch')?.value || '').toLowerCase();
    const filtered = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.subject.toLowerCase().includes(searchTerm)
    );

    if(filtered.length === 0) {
        document.getElementById('bookGrid').innerHTML = '<div class="col-span-full text-center py-12"><i class="fa-solid fa-book text-slate-300 text-6xl mb-4 block"></i><p class="text-slate-400 font-bold text-lg">No books found</p></div>';
        return;
    }

    displayBooks(filtered);
}

// FILTER BOOKS
function filterBooks(type) {
    loadBooks();
    let filtered = books;

    if(type === 'free') {
        filtered = books.filter(b => b.type === 'free');
    } else if(type === 'paid') {
        filtered = books.filter(b => b.type === 'paid');
    } else if(type === 'discount') {
        filtered = books.filter(b => b.discount > 0);
    }

    displayBooks(filtered);
}

function displayBooks(filtered) {
    const grid = document.getElementById('bookGrid');
    
    if(filtered.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center py-12"><i class="fa-solid fa-book text-slate-300 text-6xl mb-4 block"></i><p class="text-slate-400 font-bold text-lg">No books in this category</p></div>';
        return;
    }

    grid.innerHTML = filtered.map(book => {
        const finalPrice = book.price - (book.price * book.discount / 100);
        return `
            <div class="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 group overflow-hidden border-2 border-blue-100 hover:border-blue-400">
                <div class="relative bg-gradient-to-b from-blue-400 to-blue-600 h-40 flex items-center justify-center text-7xl shadow-inner">
                    ${book.cover}
                    ${book.type === 'paid' && book.discount > 0 ? `<span class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">-${book.discount}%</span>` : ''}
                    ${book.type === 'free' ? `<span class="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">FREE</span>` : ''}
                </div>
                <div class="p-5">
                    <h3 class="font-black text-lg text-slate-800 mb-2 group-hover:text-blue-600 transition line-clamp-2">${book.title}</h3>
                    <p class="text-sm text-slate-600 font-bold mb-3">by ${book.author}</p>
                    <div class="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                        <div class="text-xs text-slate-500 font-bold">
                            <p>${book.pages} pages</p>
                            <p class="text-blue-600 font-black">${book.subject}</p>
                        </div>
                        <div class="text-right">
                            ${book.type === 'paid' ? `
                                <p class="text-xs text-slate-400 line-through">₹${book.price}</p>
                                <p class="text-2xl font-black text-blue-600">₹${finalPrice}</p>
                            ` : `
                                <p class="text-xl font-black text-green-600">FREE</p>
                            `}
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button class="flex-1 bg-blue-600 text-white py-3 rounded-xl text-xs font-bold hover:bg-blue-700 transition shadow-lg"
                                onclick="document.getElementById('selectedBook').innerText = '${book.title}'; openModal('paymentModal')">
                            <i class="fa-solid fa-cart-shopping mr-1"></i> ${book.type === 'free' ? 'Get Free' : 'Buy Now'}
                        </button>
                        <button class="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl text-xs font-bold hover:bg-slate-200 transition">
                            <i class="fa-solid fa-bookmark mr-1"></i> Save
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

console.log('✅ Books.js loaded successfully');

// auto render on load
if (document.readyState !== 'loading') {
    renderBooks();
} else {
    window.addEventListener('DOMContentLoaded', renderBooks);
}
