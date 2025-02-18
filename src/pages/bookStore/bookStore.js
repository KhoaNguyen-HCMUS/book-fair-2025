import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

import './bookStore.scss'; // Import the SCSS file

function BookStore() {
  const userID = localStorage.getItem('userID');
  const [books, setBooks] = useState([]);
  const [showUnvalidatedOnly, setShowUnvalidatedOnly] = useState(false);

  const [loading, setLoading] = useState(true);
  const [selectedBooks, setSelectedBooks] = useState([]);

  const [searchInput, setSearchInput] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Get current books
  const indexOfLastBook = currentPage * itemsPerPage;
  const indexOfFirstBook = indexOfLastBook - itemsPerPage;
  const currentBooks = (filteredBooks.length > 0 ? filteredBooks : books).slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil((filteredBooks.length > 0 ? filteredBooks : books).length / itemsPerPage);

  const getCurrentBooks = () => {
    let booksToShow = filteredBooks.length > 0 ? filteredBooks : books;
    if (showUnvalidatedOnly) {
      booksToShow = booksToShow.filter((book) => book.validate === 0);
    }
    return booksToShow.slice(indexOfFirstBook, indexOfLastBook);
  };

  const handleToggleUnvalidated = () => {
    setShowUnvalidatedOnly(!showUnvalidatedOnly);
    setCurrentPage(1); // Reset to first page when toggling filter
  };
  // Change page
  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const URL = process.env.REACT_APP_DOMAIN + process.env.REACT_APP_API_GET_LIST_BOOKS;
      console.log(URL);
      const response = await fetch(URL);

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

  return (
    <div className='list-books'>
      <div className='controls-container'>
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
        <button className={`filter-button ${showUnvalidatedOnly ? 'active' : ''}`} onClick={handleToggleUnvalidated}>
          {showUnvalidatedOnly ? 'Hiển thị tất cả' : 'Chỉ hiện sách chưa xác thực'}
        </button>
      </div>
      <table className='book-table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sách</th>
            <th>Thể loại</th>
            <th>Phân loại</th>
            <th>Giá bán</th>
            <th>Số lượng</th>
            <th>Xác thực</th>
          </tr>
        </thead>
        <tbody>
          {getCurrentBooks().map((book) => (
            <tr
              key={book.id}
              onClick={() => navigate(`/bookDetail/${book.id_product}`, { state: { book } })}
              style={{ cursor: 'pointer' }}
              className='book-row'
            >
              <td>{book.id_product}</td>
              <td>{book.name}</td>
              <td>{book.genre}</td>
              <td>{book.classify}</td>
              <td>{book.price.toLocaleString('vi-VN')} VNĐ</td>
              <td>{book.quantity - book.sold}</td>
              <td className={book.validate === 1 ? 'validated' : 'not-validated'}>
                {book.validate === 1 ? 'Đã xác thực' : 'Chưa xác thực'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='pagination-container'>
        <button
          className='pagination-button first-page'
          onClick={() => handlePaginationClick(1)}
          disabled={currentPage === 1}
        >
          First Page
        </button>
        <button
          className='pagination-button'
          onClick={() => handlePaginationClick(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className='page-info'>
          Page {currentPage} of {totalPages}
        </span>

        <button
          className='pagination-button'
          onClick={() => handlePaginationClick(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default BookStore;
