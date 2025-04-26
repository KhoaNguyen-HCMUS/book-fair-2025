# Book Fair 2025

This project is a web application for managing a book fair, built with React, Redux, and other modern web technologies. The application provides features for managing books, receipts, consignors, and members, tailored for different user roles such as Admin, Organizer, Collaborator, and Cashier.

## Features

### General Features
- **Authentication**: Secure login system with role-based access control.
- **Responsive Design**: Fully responsive UI for desktop and mobile devices (only for role Collaborator).
- **Toast Notifications**: Real-time feedback for user actions.

### Collaborator Features
- **Add Consignor Information**: Input and manage consignor details such as name, phone number, address, and bank account information.
- **Add Book Information**: Input and manage book details such as title, author, price, and stock.

### Admin Features
- **Create Accounts**: Add new user accounts with specific roles (Admin, Organizer, Cashier).
- **Manage Members**: View and manage the list of members participating in the book fair.

### Organizer Features
- **Book Store Management**: Manage the list of books available in the book fair.
- **Consignor Management**: View and manage consignors who provide books for the fair.
- **Member Management**: View and manage the list of members.
- **Receipt Management**: View and manage all receipts generated during the fair.

### Cashier Features
- **Add Receipts**: Create new receipts for book purchases, including applying vouchers and selecting payment methods.
- **View Receipts**: View a list of receipts created by the cashier.
- **Receipt Details**: View detailed information about books in a specific receipt.

### Additional Features
- **Voucher System**: Apply vouchers to receipts with real-time validation and formatting.
- **Book Search**: Search for books by ID or name.
- **Pagination**: Paginate large lists of books, members, or receipts for better usability.
- **Data Normalization**: Normalize and format user inputs (e.g., account names, phone numbers).

## Technologies Used
- **Frontend**: React, Redux, React Router.
- **Styling**: SCSS.
- **Notifications**: React Toastify.
- **State Management**: Reudx.
- **API Communication**: Fetch API

### Note
This is my first attempt at building a complete web application system. As such, the codebase may not be fully clean or optimized. I appreciate your understanding and welcome any constructive feedback for improvement.

