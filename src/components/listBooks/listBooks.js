import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { editBook, toggleSelectBook } from '../../store/reducers/bookActions.js';
import { MdOutlineShoppingCartCheckout } from 'react-icons/md';
import { FaSearch } from 'react-icons/fa';

import DetailBook from '../detailBook/detailBook.js';
import AddBookForm from '../addBook/addBook.js';

import './listBooks.scss'; // Import the SCSS file

function ListBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [showNotFound, setShowNotFound] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_GET_LIST_BOOKS);
      const result = await response.json();
      if (result.success) {
        setBooks(result.data);
      }
    } catch (error) {
      toast.error('Error fetching books');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBook = (bookId) => {
    setSelectedBooks((prevSelectedBooks) =>
      prevSelectedBooks.includes(bookId)
        ? prevSelectedBooks.filter((id) => id !== bookId)
        : [...prevSelectedBooks, bookId]
    );
  };

  /*   const handleDeleteSelectedBooks = () => {
    if (window.confirm('Are you sure you want to delete the selected books?')) {
      selectedBooks.forEach((bookId) => deleteBook(bookId));
      setSelectedBooks([]);
      toast.success('Selected books deleted successfully');
    }
  }; */

  const removeVietnameseTones = (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    return str;
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchTermNormalized = removeVietnameseTones(searchInput.toLowerCase());

    const filtered = books.filter(
      (book) =>
        removeVietnameseTones(book.name.toLowerCase()).includes(searchTermNormalized) ||
        removeVietnameseTones(book.id_product.toLowerCase()).includes(searchTermNormalized) ||
        removeVietnameseTones(book.genre.toLowerCase()).includes(searchTermNormalized)
    );

    setFilteredBooks(filtered);
    if (filtered.length === 0) {
      toast.error('No books found');
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setFilteredBooks([]);
  };

  const handleDetailClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <div className='list-books'>
      {/*       <div className='btn-container'>
        <button className='checkout-button' onClick={handleCheckOut}>
          <MdOutlineShoppingCartCheckout />
          Check Out
        </button>
        <button onClick={handleDeleteSelectedBooks} className='delete-selected-button'>
          Delete Selected
        </button>
      </div> */}

      <form onSubmit={handleSearchSubmit} className='search-container'>
        <FaSearch className='search-icon' />
        <input
          type='text'
          placeholder='Search books by name, ID or genre... (Press Enter to search)'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className='search-input'
        />
        {searchInput && (
          <button type='button' className='clear-button' onClick={handleClearSearch}>
            X
          </button>
        )}
      </form>
      {/*       <button onClick={toggleForm} className='add-book-button'>
        {showForm ? 'Hide Form' : 'Add Book'}
      </button>
      {showForm && <AddBookForm book={editingBook} editBook={editBook} />} */}
      <table className='book-table'>
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Tên sách</th>
            <th>Thể loại</th>
            <th>Phân loại</th>
            <th>Giá gốc</th>
            <th>Giảm giá (%)</th>
            <th>Giá bán</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(filteredBooks.length > 0 ? filteredBooks : books).map((book) => (
            <tr key={book.id}>
              <td className='checkbox-container' onClick={(e) => e.stopPropagation()}>
                <input
                  type='checkbox'
                  className='large-checkbox'
                  checked={selectedBooks.includes(book.id)}
                  onChange={() => handleSelectBook(book.id)}
                />
              </td>
              <td>{book.id_product}</td>
              <td>{book.name}</td>
              <td>{book.genre}</td>
              <td>{book.classify}</td>
              <td>{book.bc_cost.toLocaleString('vi-VN')} VNĐ</td>
              <td>{book.discount}%</td>
              <td>{book.price.toLocaleString('vi-VN')} VNĐ</td>
              <td>{/* Action buttons */}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const mapStateToProps = (state) => ({
  books: state.books,
});

export default ListBooks;
