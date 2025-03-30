document.addEventListener('DOMContentLoaded', function() {
    // Sample data for demonstration
    const sampleData = {
        rooms: [
            { id: 101, type: 'Standard', price: 100, status: 'available' },
            { id: 102, type: 'Standard', price: 100, status: 'occupied' },
            { id: 103, type: 'Deluxe', price: 150, status: 'available' },
            { id: 201, type: 'Deluxe', price: 150, status: 'maintenance' },
            { id: 202, type: 'Suite', price: 250, status: 'available' },
            { id: 203, type: 'Suite', price: 250, status: 'occupied' }
        ],
        guests: [
            { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', bookings: 2 },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '2345678901', bookings: 1 },
            { id: 3, name: 'Robert Johnson', email: 'robert@example.com', phone: '3456789012', bookings: 3 }
        ],
        bookings: [
            { id: 1001, guestId: 1, guestName: 'John Doe', roomId: 102, roomType: 'Standard', 
              checkIn: '2023-06-15', checkOut: '2023-06-20', total: 500, status: 'current' },
            { id: 1002, guestId: 2, guestName: 'Jane Smith', roomId: 203, roomType: 'Suite', 
              checkIn: '2023-06-18', checkOut: '2023-06-25', total: 1750, status: 'current' },
            { id: 1003, guestId: 3, guestName: 'Robert Johnson', roomId: 103, roomType: 'Deluxe', 
              checkIn: '2023-07-01', checkOut: '2023-07-05', total: 600, status: 'upcoming' },
            { id: 1004, guestId: 1, guestName: 'John Doe', roomId: 101, roomType: 'Standard', 
              checkIn: '2023-05-10', checkOut: '2023-05-15', total: 500, status: 'past' },
            { id: 1005, guestId: 3, guestName: 'Robert Johnson', roomId: 202, roomType: 'Suite', 
              checkIn: '2023-07-10', checkOut: '2023-07-20', total: 2500, status: 'upcoming' }
        ]
    };

    // DOM elements
    const navButtons = document.querySelectorAll('.nav-btn');
    const contentSections = document.querySelectorAll('.content-section');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.close-btn');
    
    // Navigation functionality
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and sections
            navButtons.forEach(btn => btn.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked button and corresponding section
            this.classList.add('active');
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
        });
    });

    // Modal functionality
    function openModal(content) {
        modalBody.innerHTML = content;
        modal.style.display = 'block';
    }

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Render rooms table
    function renderRoomsTable() {
        const roomsTable = document.querySelector('#rooms-table tbody');
        roomsTable.innerHTML = '';
        
        sampleData.rooms.forEach(room => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${room.id}</td>
                <td>${room.type}</td>
                <td>$${room.price}/night</td>
                <td><span class="status-badge status-${room.status}">${room.status}</span></td>
                <td>
                    <button class="edit-room" data-id="${room.id}">Edit</button>
                    <button class="delete-room danger" data-id="${room.id}">Delete</button>
                </td>
            `;
            
            roomsTable.appendChild(row);
        });
        
        // Add event listeners to room action buttons
        document.querySelectorAll('.edit-room').forEach(btn => {
            btn.addEventListener('click', function() {
                const roomId = parseInt(this.getAttribute('data-id'));
                editRoom(roomId);
            });
        });
        
        document.querySelectorAll('.delete-room').forEach(btn => {
            btn.addEventListener('click', function() {
                const roomId = parseInt(this.getAttribute('data-id'));
                deleteRoom(roomId);
            });
        });
    }

    // Render bookings table
    function renderBookingsTable(filter = 'all') {
        const bookingsTable = document.querySelector('#bookings-table tbody');
        bookingsTable.innerHTML = '';
        
        let filteredBookings = sampleData.bookings;
        
        if (filter !== 'all') {
            filteredBookings = sampleData.bookings.filter(booking => booking.status === filter);
        }
        
        filteredBookings.forEach(booking => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${booking.id}</td>
                <td>${booking.guestName}</td>
                <td>${booking.roomId} (${booking.roomType})</td>
                <td>${booking.checkIn} to ${booking.checkOut}</td>
                <td>$${booking.total}</td>
                <td><span class="status-badge status-${booking.status}">${booking.status}</span></td>
                <td>
                    <button class="edit-booking" data-id="${booking.id}">Edit</button>
                    <button class="cancel-booking danger" data-id="${booking.id}">Cancel</button>
                </td>
            `;
            
            bookingsTable.appendChild(row);
        });
        
        // Add event listeners to booking action buttons
        document.querySelectorAll('.edit-booking').forEach(btn => {
            btn.addEventListener('click', function() {
                const bookingId = parseInt(this.getAttribute('data-id'));
                editBooking(bookingId);
            });
        });
        
        document.querySelectorAll('.cancel-booking').forEach(btn => {
            btn.addEventListener('click', function() {
                const bookingId = parseInt(this.getAttribute('data-id'));
                cancelBooking(bookingId);
            });
        });
    }

    // Render guests table
    function renderGuestsTable() {
        const guestsTable = document.querySelector('#guests-table tbody');
        guestsTable.innerHTML = '';
        
        sampleData.guests.forEach(guest => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${guest.id}</td>
                <td>${guest.name}</td>
                <td>${guest.email}</td>
                <td>${guest.phone}</td>
                <td>${guest.bookings}</td>
                <td>
                    <button class="edit-guest" data-id="${guest.id}">Edit</button>
                    <button class="delete-guest danger" data-id="${guest.id}">Delete</button>
                </td>
            `;
            
            guestsTable.appendChild(row);
        });
        
        // Add event listeners to guest action buttons
        document.querySelectorAll('.edit-guest').forEach(btn => {
            btn.addEventListener('click', function() {
                const guestId = parseInt(this.getAttribute('data-id'));
                editGuest(guestId);
            });
        });
        
        document.querySelectorAll('.delete-guest').forEach(btn => {
            btn.addEventListener('click', function() {
                const guestId = parseInt(this.getAttribute('data-id'));
                deleteGuest(guestId);
            });
        });
    }

    // Render recent bookings in dashboard
    function renderRecentBookings() {
        const recentBookingsTable = document.querySelector('#recent-bookings-table tbody');
        recentBookingsTable.innerHTML = '';
        
        // Get the 5 most recent bookings
        const recentBookings = [...sampleData.bookings]
            .sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn))
            .slice(0, 5);
        
        recentBookings.forEach(booking => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${booking.id}</td>
                <td>${booking.guestName}</td>
                <td>${booking.roomId} (${booking.roomType})</td>
                <td>${booking.checkIn}</td>
                <td>${booking.checkOut}</td>
                <td><span class="status-badge status-${booking.status}">${booking.status}</span></td>
            `;
            
            recentBookingsTable.appendChild(row);
        });
    }

    // Update dashboard stats
    function updateDashboardStats() {
        const availableRooms = sampleData.rooms.filter(room => room.status === 'available').length;
        const occupiedRooms = sampleData.rooms.filter(room => room.status === 'occupied').length;
        
        // For demo purposes, we'll use fixed numbers for check-ins/outs
        document.getElementById('available-rooms').textContent = availableRooms;
        document.getElementById('occupied-rooms').textContent = occupiedRooms;
        document.getElementById('checkins-today').textContent = 3;
        document.getElementById('checkouts-today').textContent = 2;
    }

    // Form templates
    const formTemplates = {
        roomForm: (room = null) => `
            <h3>${room ? 'Edit Room' : 'Add New Room'}</h3>
            <form id="room-form">
                <div class="form-group">
                    <label for="room-number">Room Number</label>
                    <input type="number" id="room-number" value="${room ? room.id : ''}" required>
                </div>
                <div class="form-group">
                    <label for="room-type">Room Type</label>
                    <select id="room-type" required>
                        <option value="Standard" ${room && room.type === 'Standard' ? 'selected' : ''}>Standard</option>
                        <option value="Deluxe" ${room && room.type === 'Deluxe' ? 'selected' : ''}>Deluxe</option>
                        <option value="Suite" ${room && room.type === 'Suite' ? 'selected' : ''}>Suite</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="room-price">Price per night ($)</label>
                    <input type="number" id="room-price" value="${room ? room.price : ''}" required>
                </div>
                <div class="form-group">
                    <label for="room-status">Status</label>
                    <select id="room-status" required>
                        <option value="available" ${room && room.status === 'available' ? 'selected' : ''}>Available</option>
                        <option value="occupied" ${room && room.status === 'occupied' ? 'selected' : ''}>Occupied</option>
                        <option value="maintenance" ${room && room.status === 'maintenance' ? 'selected' : ''}>Maintenance</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="cancel-btn">Cancel</button>
                    <button type="submit" class="success">${room ? 'Update' : 'Add'} Room</button>
                </div>
            </form>
        `,
        
        bookingForm: (booking = null) => `
            <h3>${booking ? 'Edit Booking' : 'New Booking'}</h3>
            <form id="booking-form">
                <div class="form-group">
                    <label for="booking-guest">Guest</label>
                    <select id="booking-guest" required>
                        ${sampleData.guests.map(guest => 
                            `<option value="${guest.id}" ${booking && booking.guestId === guest.id ? 'selected' : ''}>
                                ${guest.name} (ID: ${guest.id})
                            </option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="booking-room">Room</label>
                    <select id="booking-room" required>
                        ${sampleData.rooms.filter(room => room.status === 'available').map(room => 
                            `<option value="${room.id}" ${booking && booking.roomId === room.id ? 'selected' : ''}>
                                ${room.id} (${room.type}) - $${room.price}/night
                            </option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="booking-checkin">Check-in Date</label>
                    <input type="date" id="booking-checkin" value="${booking ? booking.checkIn : ''}" required>
                </div>
                <div class="form-group">
                    <label for="booking-checkout">Check-out Date</label>
                    <input type="date" id="booking-checkout" value="${booking ? booking.checkOut : ''}" required>
                </div>
                <div class="form-group">
                    <label for="booking-total">Total Amount ($)</label>
                    <input type="number" id="booking-total" value="${booking ? booking.total : ''}" required>
                </div>
                <div class="form-group">
                    <label for="booking-status">Status</label>
                    <select id="booking-status" required>
                        <option value="upcoming" ${booking && booking.status === 'upcoming' ? 'selected' : ''}>Upcoming</option>
                        <option value="current" ${booking && booking.status === 'current' ? 'selected' : ''}>Current</option>
                        <option value="past" ${booking && booking.status === 'past' ? 'selected' : ''}>Past</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="cancel-btn">Cancel</button>
                    <button type="submit" class="success">${booking ? 'Update' : 'Create'} Booking</button>
                </div>
            </form>
        `,
        
        guestForm: (guest = null) => `
            <h3>${guest ? 'Edit Guest' : 'Add New Guest'}</h3>
            <form id="guest-form">
                <div class="form-group">
                    <label for="guest-name">Full Name</label>
                    <input type="text" id="guest-name" value="${guest ? guest.name : ''}" required>
                </div>
                <div class="form-group">
                    <label for="guest-email">Email</label>
                    <input type="email" id="guest-email" value="${guest ? guest.email : ''}" required>
                </div>
                <div class="form-group">
                    <label for="guest-phone">Phone</label>
                    <input type="tel" id="guest-phone" value="${guest ? guest.phone : ''}" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="cancel-btn">Cancel</button>
                    <button type="submit" class="success">${guest ? 'Update' : 'Add'} Guest</button>
                </div>
            </form>
        `
    };

    // Room functions
    function addRoom() {
        const formContent = formTemplates.roomForm();
        openModal(formContent);
        
        document.getElementById('room-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newRoom = {
                id: parseInt(document.getElementById('room-number').value),
                type: document.getElementById('room-type').value,
                price: parseInt(document.getElementById('room-price').value),
                status: document.getElementById('room-status').value
            };
            
            sampleData.rooms.push(newRoom);
            renderRoomsTable();
            updateDashboardStats();
            modal.style.display = 'none';
        });
        
        document.querySelector('.cancel-btn').addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    function editRoom(roomId) {
        const room = sampleData.rooms.find(r => r.id === roomId);
        const formContent = formTemplates.roomForm(room);
        openModal(formContent);
        
        document.getElementById('room-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            room.id = parseInt(document.getElementById('room-number').value);
            room.type = document.getElementById('room-type').value;
            room.price = parseInt(document.getElementById('room-price').value);
            room.status = document.getElementById('room-status').value;
            
            renderRoomsTable();
            updateDashboardStats();
            modal.style.display = 'none';
        });
        
        document.querySelector('.cancel-btn').addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    function deleteRoom(roomId) {
        if (confirm('Are you sure you want to delete this room?')) {
            sampleData.rooms = sampleData.rooms.filter(room => room.id !== roomId);
            renderRoomsTable();
            updateDashboardStats();
        }
    }

    // Booking functions
    function newBooking() {
        const formContent = formTemplates.bookingForm();
        openModal(formContent);
        
        document.getElementById('booking-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const guestId = parseInt(document.getElementById('booking-guest').value);
            const guest = sampleData.guests.find(g => g.id === guestId);
            
            const newBooking = {
                id: Math.max(...sampleData.bookings.map(b => b.id)) + 1,
                guestId: guestId,
                guestName: guest.name,
                roomId: parseInt(document.getElementById('booking-room').value),
                roomType: sampleData.rooms.find(r => r.id === parseInt(document.getElementById('booking-room').value)).type,
                checkIn: document.getElementById('booking-checkin').value,
                checkOut: document.getElementById('booking-checkout').value,
                total: parseInt(document.getElementById('booking-total').value),
                status: document.getElementById('booking-status').value
            };
            
            sampleData.bookings.push(newBooking);
            renderBookingsTable();
            renderRecentBookings();
            updateDashboardStats();
            modal.style.display = 'none';
        });
        
        document.querySelector('.cancel-btn').addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    function editBooking(bookingId) {
        const booking = sampleData.bookings.find(b => b.id === bookingId);
        const formContent = formTemplates.bookingForm(booking);
        openModal(formContent);
        
        document.getElementById('booking-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const guestId = parseInt(document.getElementById('booking-guest').value);
            const guest = sampleData.guests.find(g => g.id === guestId);
            
            booking.guestId = guestId;
            booking.guestName = guest.name;
            booking.roomId = parseInt(document.getElementById('booking-room').value);
            booking.roomType = sampleData.rooms.find(r => r.id === parseInt(document.getElementById('booking-room').value)).type;
            booking.checkIn = document.getElementById('booking-checkin').value;
            booking.checkOut = document.getElementById('booking-checkout').value;
            booking.total = parseInt(document.getElementById('booking-total').value);
            booking.status = document.getElementById('booking-status').value;
            
            renderBookingsTable();
            renderRecentBookings();
            modal.style.display = 'none';
        });
        
        document.querySelector('.cancel-btn').addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    function cancelBooking(bookingId) {
        if (confirm('Are you sure you want to cancel this booking?')) {
            const booking = sampleData.bookings.find(b => b.id === bookingId);
            booking.status = 'cancelled';
            
            renderBookingsTable();
            renderRecentBookings();
        }
    }

    // Guest functions
    function addGuest() {
        const formContent = formTemplates.guestForm();
        openModal(formContent);
        
        document.getElementById('guest-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newGuest = {
                id: Math.max(...sampleData.guests.map(g => g.id)) + 1,
                name: document.getElementById('guest-name').value,
                email: document.getElementById('guest-email').value,
                phone: document.getElementById('guest-phone').value,
                bookings: 0
            };
            
            sampleData.guests.push(newGuest);
            renderGuestsTable();
            modal.style.display = 'none';
        });
        
        document.querySelector('.cancel-btn').addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    function editGuest(guestId) {
        const guest = sampleData.guests.find(g => g.id === guestId);
        const formContent = formTemplates.guestForm(guest);
        openModal(formContent);
        
        document.getElementById('guest-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            guest.name = document.getElementById('guest-name').value;
            guest.email = document.getElementById('guest-email').value;
            guest.phone = document.getElementById('guest-phone').value;
            
            renderGuestsTable();
            modal.style.display = 'none';
        });
        
        document.querySelector('.cancel-btn').addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    function deleteGuest(guestId) {
        if (confirm('Are you sure you want to delete this guest?')) {
            sampleData.guests = sampleData.guests.filter(guest => guest.id !== guestId);
            renderGuestsTable();
        }
    }

    // Initialize the application
    function init() {
        // Render all tables
        renderRoomsTable();
        renderBookingsTable();
        renderGuestsTable();
        renderRecentBookings();
        updateDashboardStats();
        
        // Add event listeners to buttons
        document.getElementById('add-room-btn').addEventListener('click', addRoom);
        document.getElementById('new-booking-btn').addEventListener('click', newBooking);
        document.getElementById('add-guest-btn').addEventListener('click', addGuest);
        
        // Booking filter
        document.getElementById('booking-filter').addEventListener('change', function() {
            renderBookingsTable(this.value);
        });
        
        // Search functionality (simplified for demo)
        document.querySelectorAll('.search-box button').forEach(button => {
            button.addEventListener('click', function() {
                const searchInput = this.previousElementSibling;
                const searchTerm = searchInput.value.toLowerCase();
                const section = this.closest('.content-section').id;
                
                if (section === 'rooms') {
                    // In a real app, you would filter rooms based on search term
                    alert(`Searching rooms for: ${searchTerm}`);
                } else if (section === 'guests') {
                    // In a real app, you would filter guests based on search term
                    alert(`Searching guests for: ${searchTerm}`);
                }
            });
        });
    }

    // Start the application
    init();
});
