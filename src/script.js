// Application State
let currentUser = null;
let currentRole = 'user';
let searchBy = 'title';
let selectedBookId = null;
let userRating = 5;

// Initial Books Data
let books = [
    {
        id: '1',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '978-0-06-112008-4',
        category: 'Fiction',
        status: 'available',
        coverImage: 'https://images.unsplash.com/photo-1763768861268-cb6b54173dbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
        description: 'A gripping tale of racial injustice and childhood innocence in the American South during the 1930s.',
        rating: 4.8,
        reviews: [
            {
                id: 'r1',
                username: 'book_lover',
                rating: 5,
                comment: 'An absolute masterpiece! A must-read for everyone.',
                date: '2025-11-15',
            },
            {
                id: 'r2',
                username: 'reader_jane',
                rating: 5,
                comment: 'Powerful and moving. Harper Lee\'s best work.',
                date: '2025-11-10',
            },
        ],
    },
    {
        id: '2',
        title: '1984',
        author: 'George Orwell',
        isbn: '978-0-452-28423-4',
        category: 'Fiction',
        status: 'available',
        coverImage: 'https://images.unsplash.com/photo-1643596028210-cdde50b7f37b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
        description: 'A dystopian social science fiction novel exploring themes of totalitarianism and surveillance.',
        rating: 4.7,
        reviews: [
            {
                id: 'r3',
                username: 'classic_fan',
                rating: 5,
                comment: 'More relevant today than ever. A chilling vision.',
                date: '2025-11-18',
            },
        ],
    },
    {
        id: '3',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '978-0-7432-7356-5',
        category: 'Fiction',
        status: 'borrowed',
        borrowedBy: 'john_doe',
        borrowedDate: '2025-11-20',
        coverImage: 'https://images.unsplash.com/photo-1637962638310-e6787f7eb324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
        description: 'A critique of the American Dream set in the Jazz Age, following the mysterious millionaire Jay Gatsby.',
        rating: 4.5,
        reviews: [
            {
                id: 'r4',
                username: 'literature_buff',
                rating: 4,
                comment: 'Beautiful prose and a timeless story.',
                date: '2025-11-05',
            },
        ],
    },
    {
        id: '4',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '978-0-13-235088-4',
        category: 'Technology',
        status: 'available',
        coverImage: 'https://images.unsplash.com/photo-1594823274242-19036bf455e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
        description: 'A handbook of agile software craftsmanship teaching principles for writing clean, maintainable code.',
        rating: 4.9,
        reviews: [
            {
                id: 'r5',
                username: 'dev_master',
                rating: 5,
                comment: 'Essential reading for every developer. Changed how I write code!',
                date: '2025-11-12',
            },
            {
                id: 'r6',
                username: 'code_ninja',
                rating: 5,
                comment: 'Best programming book I\'ve ever read.',
                date: '2025-11-08',
            },
        ],
    },
    {
        id: '5',
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt',
        isbn: '978-0-201-61622-4',
        category: 'Technology',
        status: 'borrowed',
        borrowedBy: 'jane_smith',
        borrowedDate: '2025-11-22',
        coverImage: 'https://images.unsplash.com/photo-1660606422784-5a18d4be40fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
        description: 'Practical advice and timeless wisdom for software developers at any stage of their career.',
        rating: 4.6,
        reviews: [
            {
                id: 'r7',
                username: 'tech_reader',
                rating: 5,
                comment: 'Practical and insightful. A must-have for programmers.',
                date: '2025-11-14',
            },
        ],
    },
    {
        id: '6',
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        isbn: '978-0-06-231609-7',
        category: 'History',
        status: 'available',
        coverImage: 'https://images.unsplash.com/photo-1613324767976-f65bc7d80936?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
        description: 'A brief history of humankind, from the Stone Age to the modern age, exploring how Homo sapiens came to dominate the world.',
        rating: 4.7,
        reviews: [
            {
                id: 'r8',
                username: 'history_enthusiast',
                rating: 5,
                comment: 'Mind-blowing perspective on human history!',
                date: '2025-11-20',
            },
            {
                id: 'r9',
                username: 'curious_reader',
                rating: 4,
                comment: 'Fascinating read that makes you think differently.',
                date: '2025-11-16',
            },
        ],
    },
];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
});

function initializeEventListeners() {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Role Buttons
    const roleButtons = document.querySelectorAll('.role-btn');
    roleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            roleButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentRole = this.dataset.role;
        });
    });
    
    // Review Form
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', handleAddReview);
    }
    
    // Star Rating
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            userRating = parseInt(this.dataset.rating);
            updateStarRating();
        });
        
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.rating);
            highlightStars(rating);
        });
    });
    
    const starRating = document.getElementById('userRating');
    if (starRating) {
        starRating.addEventListener('mouseleave', function() {
            updateStarRating();
        });
    }
}

// Authentication
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    errorDiv.style.display = 'none';
    
    if (!username || !password) {
        showError('Please enter both username and password');
        return;
    }
    
    if (currentRole === 'admin' && password !== 'admin123') {
        showError('Invalid admin credentials');
        return;
    }
    
    if (currentRole === 'user' && password !== 'user123') {
        showError('Invalid user credentials');
        return;
    }
    
    currentUser = {
        username: username,
        role: currentRole,
        borrowedBooks: books.filter(b => b.borrowedBy === username).map(b => b.id)
    };
    
    showDashboard();
}

function showError(message) {
    const errorDiv = document.getElementById('loginError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function showDashboard() {
    document.getElementById('loginPage').classList.remove('active');
    
    if (currentUser.role === 'admin') {
        loadDashboard('admin-dashboard.html').then(() => {
            document.getElementById('adminUsername').textContent = currentUser.username;
            document.getElementById('adminDashboard').classList.add('active');
        });
    } else {
        loadDashboard('user-dashboard.html').then(() => {
            document.getElementById('userUsername').textContent = currentUser.username;
            document.getElementById('userDashboard').classList.add('active');
        });
    }
}

function logout() {
    currentUser = null;
    document.getElementById('dashboard-container').innerHTML = '';
    document.getElementById('loginPage').classList.add('active');
    document.getElementById('loginForm').reset();
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// User Dashboard Functions
function switchUserTab(tabName) {
    const tabs = document.querySelectorAll('#userDashboard .tab');
    const contents = document.querySelectorAll('#userDashboard .tab-content');
    
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));
    
    document.querySelector(`#userDashboard .tab[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
}

function updateUserStats() {
    const availableCount = books.filter(b => b.status === 'available').length;
    const borrowedCount = currentUser.borrowedBooks.length;
    
    document.getElementById('totalBooksCount').textContent = books.length;
    document.getElementById('availableBooksCount').textContent = availableCount;
    document.getElementById('myBooksCount').textContent = borrowedCount;
    
    const badge = document.getElementById('borrowedBadge');
    if (borrowedCount > 0) {
        badge.textContent = borrowedCount;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

function renderAvailableBooks() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const grid = document.getElementById('availableBooksGrid');
    
    let filteredBooks = books.filter(book => {
        if (book.status !== 'available') return false;
        if (!searchQuery) return true;
        
        if (searchBy === 'title') {
            return book.title.toLowerCase().includes(searchQuery);
        } else {
            return book.author.toLowerCase().includes(searchQuery);
        }
    });
    
    document.getElementById('availableCount').textContent = filteredBooks.length;
    
    if (filteredBooks.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <p>No books found matching your search</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filteredBooks.map((book, index) => createBookCard(book, 'borrow', index)).join('');
}

function renderBorrowedBooks() {
    const grid = document.getElementById('borrowedBooksGrid');
    const borrowedBooks = books.filter(b => currentUser.borrowedBooks.includes(b.id));
    
    document.getElementById('borrowedCount').textContent = borrowedBooks.length;
    
    if (borrowedBooks.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    <line x1="10" y1="7" x2="8" y2="7"></line>
                </svg>
                <p>You haven't borrowed any books yet</p>
                <button class="btn btn-primary btn-sm" style="margin-top: 1rem;" onclick="switchUserTab('search')">
                    Browse available books ✨
                </button>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = borrowedBooks.map((book, index) => createBookCard(book, 'return', index)).join('');
}

function createBookCard(book, actionType, index) {
    const stars = createStars(book.rating);
    const animationDelay = index * 0.1;
    
    return `
        <div class="book-card" style="animation-delay: ${animationDelay}s;" onclick="openReviewModal('${book.id}')">
            <div class="book-cover">
                <img src="${book.coverImage}" alt="${book.title}" onerror="this.src='https://images.unsplash.com/photo-1763768861268-cb6b54173dbf?w=400'">
                <span class="book-status ${book.status}">${book.status === 'available' ? '✨ Available' : '📖 Borrowed'}</span>
                <div class="book-rating-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span>${book.rating}</span>
                </div>
                <div class="book-cover-gradient"></div>
            </div>
            <div class="book-details">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    ${book.author}
                </p>
                <p class="book-description">${book.description}</p>
                <div class="book-rating">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="stars">${stars}</div>
                        <span class="rating-text">${book.rating}</span>
                    </div>
                    <button class="review-link" onclick="event.stopPropagation(); openReviewModal('${book.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <span>${book.reviews.length} reviews</span>
                    </button>
                </div>
                <span class="book-category">${book.category}</span>
                ${actionType === 'return' && book.borrowedDate ? `
                    <div class="book-meta borrowed-date">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>Borrowed on ${book.borrowedDate}</span>
                    </div>
                ` : ''}
${book.status === 'borrowed' && book.borrowedBy && actionType === 'borrow' ? `
                    <div class="book-meta borrowed-by">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>Borrowed by ${book.borrowedBy}</span>
                    </div>
                ` : ''}
                <button class="btn ${actionType === 'borrow' ? 'btn-primary' : 'btn-secondary'} book-action" 
                    onclick="event.stopPropagation(); ${actionType === 'borrow' ? `borrowBook('${book.id}')` : `returnBook('${book.id}')`}">
                    ${actionType === 'borrow' ? 'Borrow Book' : '↻ Return Book'}
                </button>
            </div>
        </div>
    `;
}

function createStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        const filled = i <= Math.round(rating);
        stars += `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" 
                ${filled ? 'fill="currentColor"' : 'fill="none"'} 
                stroke="currentColor" stroke-width="2" 
                class="${filled ? '' : 'empty'}">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
        `;
    }
    return stars;
}

function borrowBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book || book.status !== 'available') return;
    
    book.status = 'borrowed';
    book.borrowedBy = currentUser.username;
    book.borrowedDate = new Date().toISOString().split('T')[0];
    currentUser.borrowedBooks.push(bookId);
    
    updateUserStats();
    renderAvailableBooks();
    renderBorrowedBooks();
}

function returnBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    book.status = 'available';
    delete book.borrowedBy;
    delete book.borrowedDate;
    currentUser.borrowedBooks = currentUser.borrowedBooks.filter(id => id !== bookId);
    
    updateUserStats();
    renderAvailableBooks();
    renderBorrowedBooks();
}

// Admin Dashboard Functions
function switchAdminTab(tabName) {
    const tabs = document.querySelectorAll('#adminDashboard .tab');
    const contents = document.querySelectorAll('#adminDashboard .tab-content');
    
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));
    
    document.querySelector(`#adminDashboard .tab[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
}

function updateAdminStats() {
    const availableCount = books.filter(b => b.status === 'available').length;
    const borrowedCount = books.filter(b => b.status === 'borrowed').length;
    
    document.getElementById('adminTotalBooks').textContent = books.length;
    document.getElementById('adminAvailableBooks').textContent = availableCount;
    document.getElementById('adminBorrowedBooks').textContent = borrowedCount;
    
    const badge = document.getElementById('adminBorrowedBadge');
    if (borrowedCount > 0) {
        badge.textContent = borrowedCount;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

function handleAddBook(e) {
    e.preventDefault();
    
    const newBook = {
        id: Date.now().toString(),
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        isbn: document.getElementById('bookISBN').value,
        category: document.getElementById('bookCategory').value,
        description: document.getElementById('bookDescription').value,
        coverImage: document.getElementById('bookCover').value || 'https://images.unsplash.com/photo-1763768861268-cb6b54173dbf?w=400',
        status: 'available',
        rating: 0,
        reviews: []
    };
    
    books.push(newBook);
    
    // Show success message
    const successMsg = document.getElementById('successMessage');
    successMsg.style.display = 'flex';
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 3000);
    
    // Clear form
    document.getElementById('addBookForm').reset();
    
    // Update stats
    updateAdminStats();
    renderBorrowedBooksTable();
}

function clearForm() {
    document.getElementById('addBookForm').reset();
}

function renderBorrowedBooksTable() {
    const container = document.getElementById('borrowedBooksTable');
    const borrowedBooks = books.filter(b => b.status === 'borrowed');
    
    if (borrowedBooks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <h3>No Books Currently Borrowed ✨</h3>
                <p>All books are available in the library</p>
            </div>
        `;
        return;
    }
    
    // Desktop table view
    const tableHTML = `
        <table class="borrowed-table">
            <thead>
                <tr>
                    <th>Book Title</th>
                    <th>Author</th>
                    <th>ISBN</th>
                    <th>Category</th>
                    <th>Borrowed By</th>
                    <th>Borrowed Date</th>
                </tr>
            </thead>
            <tbody>
                ${borrowedBooks.map((book, index) => `
                    <tr style="animation-delay: ${index * 0.1}s;">
                        <td>
                            <div class="table-book-title">
                                <div class="table-book-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                    </svg>
                                </div>
                                <span>${book.title}</span>
                            </div>
                        </td>
                        <td>${book.author}</td>
                        <td style="color: var(--gray-600); font-size: 0.875rem;">${book.isbn}</td>
                        <td><span class="book-category">${book.category}</span></td>
                        <td>
                            <div class="table-user">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                ${book.borrowedBy}
                            </div>
                        </td>
                        <td>
                            <div class="table-date">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                ${book.borrowedDate}
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    // Mobile cards view
    const mobileHTML = `
        <div class="mobile-cards">
            ${borrowedBooks.map((book, index) => `
                <div class="mobile-card" style="animation-delay: ${index * 0.1}s;">
                    <div class="mobile-card-header">
                        <div class="table-book-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="mobile-card-title">${book.title}</h3>
                            <p class="mobile-card-subtitle">${book.author}</p>
                        </div>
                    </div>
                    <div class="mobile-card-details">
                        <div class="mobile-card-row">
                            <span class="mobile-card-label">ISBN:</span>
                            <span class="mobile-card-value">${book.isbn}</span>
                        </div>
                        <div class="mobile-card-row">
                            <span class="mobile-card-label">Category:</span>
                            <span class="book-category">${book.category}</span>
                        </div>
                        <div class="mobile-card-row" style="padding-top: 0.5rem; border-top: 1px solid var(--gray-200);">
                            <span class="mobile-card-label">Borrowed By:</span>
                            <span class="mobile-card-value">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                ${book.borrowedBy}
                            </span>
                        </div>
                        <div class="mobile-card-row">
                            <span class="mobile-card-label">Borrowed Date:</span>
                            <span class="mobile-card-value">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                </svg>
                                ${book.borrowedDate}
                            </span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    container.innerHTML = tableHTML + mobileHTML;
}

// Review Modal Functions
function openReviewModal(bookId) {
    selectedBookId = bookId;
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    document.getElementById('modalBookTitle').textContent = book.title;
    document.getElementById('modalBookAuthor').textContent = book.author;
    document.getElementById('modalStars').innerHTML = createModalStars(book.rating);
    document.getElementById('modalRatingText').textContent = `${book.rating} / 5.0`;
    document.getElementById('modalReviewCount').textContent = `(${book.reviews.length} reviews)`;
    document.getElementById('modalDescription').textContent = book.description;
    document.getElementById('reviewsCount').textContent = book.reviews.length;
    
    renderReviews(book);
    
    const modal = document.getElementById('reviewModal');
    modal.classList.add('active');
    
    // Close on backdrop click
    const backdrop = modal.querySelector('.modal-backdrop');
    backdrop.onclick = closeReviewModal;
}

function closeReviewModal() {
    const modal = document.getElementById('reviewModal');
    modal.classList.remove('active');
    selectedBookId = null;
    hideReviewForm();
}

function createModalStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        const filled = i <= Math.round(rating);
        stars += `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
                ${filled ? 'fill="currentColor"' : 'fill="none"'} 
                stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
        `;
    }
    return stars;
}

function renderReviews(book) {
    const container = document.getElementById('reviewsList');
    
    if (book.reviews.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <p>No reviews yet. Be the first to review this book!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = book.reviews.map((review, index) => `
        <div class="review-item" style="animation-delay: ${index * 0.1}s;">
            <div class="review-header">
                <div>
                    <p class="review-user">${review.username}</p>
                    <p class="review-date">${review.date}</p>
                </div>
                <div class="review-stars">
                    ${createModalStars(review.rating).replace(/24/g, '16')}
                </div>
            </div>
            <p class="review-comment">${review.comment}</p>
        </div>
    `).join('');
}

function showReviewForm() {
    document.getElementById('reviewForm').style.display = 'block';
    document.getElementById('writeReviewBtn').style.display = 'none';
    userRating = 5;
    updateStarRating();
}

function hideReviewForm() {
    document.getElementById('reviewForm').style.display = 'none';
    document.getElementById('writeReviewBtn').style.display = 'inline-flex';
    document.getElementById('reviewComment').value = '';
    userRating = 5;
}

function updateStarRating() {
    highlightStars(userRating);
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function handleAddReview(e) {
    e.preventDefault();
    
    const comment = document.getElementById('reviewComment').value;
    if (!comment.trim() || !selectedBookId) return;
    
    const book = books.find(b => b.id === selectedBookId);
    if (!book) return;
    
    const newReview = {
        id: Date.now().toString(),
        username: currentUser.username,
        rating: userRating,
        comment: comment,
        date: new Date().toISOString().split('T')[0]
    };
    
    book.reviews.push(newReview);
    
    // Recalculate average rating
 const totalRating = book.reviews.reduce((sum, r) => sum + r.rating, 0);
    book.rating = Math.round((totalRating / book.reviews.length) * 10) / 10;
    
    // Update modal
    document.getElementById('modalStars').innerHTML = createModalStars(book.rating);
    document.getElementById('modalRatingText').textContent = `${book.rating} / 5.0`;
    document.getElementById('modalReviewCount').textContent = `(${book.reviews.length} reviews)`;
    document.getElementById('reviewsCount').textContent = book.reviews.length;
    
    renderReviews(book);
    hideReviewForm();
    
    // Update book cards
    if (currentUser.role === 'user') {
        renderAvailableBooks();
        renderBorrowedBooks();
    }
}

// New: Load dashboard HTML dynamically
async function loadDashboard(file) {
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error('Failed to load dashboard');
        const html = await response.text();
        document.getElementById('dashboard-container').innerHTML = html;
        // After loading, attach listeners and initialize
        if (file === 'user-dashboard.html') {
            attachUserDashboardListeners();
            updateUserStats();
            renderAvailableBooks();
            renderBorrowedBooks();
        } else if (file === 'admin-dashboard.html') {
            attachAdminDashboardListeners();
            updateAdminStats();
            renderBorrowedBooksTable();
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        document.getElementById('dashboard-container').innerHTML = '<p>Error loading dashboard. Please refresh.</p>';
    }
}

// New: Attach listeners for user dashboard elements
function attachUserDashboardListeners() {
    const userTabs = document.querySelectorAll('#userDashboard .tab');
    userTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            switchUserTab(tabName);
        });
    });
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            searchBy = this.dataset.search;
            document.getElementById('searchInput').placeholder = `Search by ${searchBy}...`;
            renderAvailableBooks();
        });
    });
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', renderAvailableBooks);
    }
}

// New: Attach listeners for admin dashboard elements
function attachAdminDashboardListeners() {
    const adminTabs = document.querySelectorAll('#adminDashboard .tab');
    adminTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            switchAdminTab(tabName);
        });
    });
    const addBookForm = document.getElementById('addBookForm');
    if (addBookForm) {
        addBookForm.addEventListener('submit', handleAddBook);
    }
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeReviewModal();
    }
});