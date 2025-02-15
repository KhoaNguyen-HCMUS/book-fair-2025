import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';


import './listBooks.scss'; // Import the SCSS file

function ListBooks() {
  const [books, setBooks] = useState([]);
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

  // Change page
  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_DOMAIN + process.env.REACT_APP_API_GET_LIST_BOOKS);
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

  const handleDetailClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <div className='list-books'>

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
      <table className='book-table'>
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Tên sách</th>
            <th>Thể loại</th>
            <th>Phân loại</th>
            <th>Giá bán</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentBooks.map((book) => (
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
              <td>{book.price.toLocaleString('vi-VN')} VNĐ</td>
              <td>{/* Action buttons */}</td>
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

const mapStateToProps = (state) => ({
  books: state.books,
});

export default ListBooks;
