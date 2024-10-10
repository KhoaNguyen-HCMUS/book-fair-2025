import React, { useState } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { editBook, toggleSelectBook } from '../../store/reducers/bookActions.js';
import { MdOutlineShoppingCartCheckout } from 'react-icons/md';

import DetailBook from '../detailBook/detailBook.js';
import AddBookForm from '../addBook/addBook.js';

import './listBooks.scss'; // Import the SCSS file

const ListBooks = ({ books, deleteBook }) => {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const navigate = useNavigate();

  const handleCheckOut = () => {
    const selectedBookIds = selectedBooks.join(',');
    if (!selectedBookIds) {
      alert('No books selected for checkout.');
      return;
    }
    navigate(`/checkout?ids=${selectedBookIds}`);
  };

  const handleDeleteBook = (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteBook(bookId);
      toast.success('Book deleted successfully');
    }
  };

  const handleChange = (event) => {
    setSearch(event.target.value);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleSelectBook = (bookId) => {
    setSelectedBooks((prevSelectedBooks) =>
      prevSelectedBooks.includes(bookId)
        ? prevSelectedBooks.filter((id) => id !== bookId)
        : [...prevSelectedBooks, bookId]
    );
  };

  const handleDeleteSelectedBooks = () => {
    if (window.confirm('Are you sure you want to delete the selected books?')) {
      selectedBooks.forEach((bookId) => deleteBook(bookId));
      setSelectedBooks([]);
      toast.success('Selected books deleted successfully');
    }
  };

  const handleDetailClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };
  const removeVietnameseTones = (str) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  const searchLower = removeVietnameseTones(search.toLowerCase());
  const filteredBooks = books.filter((book) =>
    Object.values(book).some((value) => removeVietnameseTones(value.toString().toLowerCase()).includes(searchLower))
  );

  return (
    <div className='list-books'>
      <div className='btn-container'>
        <button className='checkout-button' onClick={handleCheckOut}>
          <MdOutlineShoppingCartCheckout />
          Check Out
        </button>
        <button onClick={handleDeleteSelectedBooks} className='delete-selected-button'>
          Delete Selected
        </button>
      </div>

      {/* <h1>List of Books</h1> */}
      <br></br>
      <input
        type='text'
        name='search'
        placeholder='Search by any field'
        value={search}
        onChange={handleChange}
        className='search-input'
      />
      <button onClick={toggleForm} className='add-book-button'>
        {showForm ? 'Hide Form' : 'Add Book'}
      </button>
      {showForm && <AddBookForm book={editingBook} editBook={editBook} />}

      <table className='book-table'>
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Name</th>
            <th>Author</th>
            <th>Category</th>
            <th>Publisher</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book) => (
            <tr key={book.id}>
              <td className='checkbox-container' onClick={(e) => e.stopPropagation()}>
                <input
                  type='checkbox'
                  className='large-checkbox'
                  checked={selectedBooks.includes(book.id)}
                  onChange={() => handleSelectBook(book.id)}
                />
              </td>
              <td>{book.id}</td>
              <td>{book.name}</td>
              <td>{book.author}</td>
              <td>{book.category}</td>
              <td>{book.publisher}</td>
              <td>{book.price}</td>
              <td onClick={(e) => e.stopPropagation()}>
                <button onClick={() => handleDetailClick(book.id)} className='detail-button'>
                  Detail
                </button>
                <button onClick={() => handleDeleteBook(book.id)} className='delete-button'>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = (state) => ({
  books: state.books,
});

const mapDispatchToProps = (dispatch) => ({
  deleteBook: (bookId) => dispatch({ type: 'DELETE_BOOK', payload: bookId }),
  addBook: (newBook) => dispatch({ type: 'ADD_BOOK', payload: newBook }),
  editBook: (editedBook) => dispatch({ type: 'EDIT_BOOK', payload: editedBook }),
  toggleSelectBook: (bookId) => dispatch({ type: 'TOGGLE_SELECT_BOOK', payload: bookId }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListBooks);
