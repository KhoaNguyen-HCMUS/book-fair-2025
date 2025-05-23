import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

import './myListBooks.scss';

function MyListBooks({ userId, typeUser }) {
  const userID = userId;
  const [books, setBooks] = useState([]);
  const [setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const indexOfLastBook = currentPage * itemsPerPage;
  const indexOfFirstBook = indexOfLastBook - itemsPerPage;
  const currentBooks = (filteredBooks.length > 0 ? filteredBooks : books).slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil((filteredBooks.length > 0 ? filteredBooks : books).length / itemsPerPage);

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const params = 'product&&id=' + userID + '&typeUser=' + typeUser;
      const URL = `${import.meta.env.VITE_DOMAIN}${import.meta.env.VITE_API_GET_OBJECT_LIST_BY_ID}` + params;
      const response = await fetch(URL);

      const result = await response.json();
      if (result.success) {
        setBooks(result.data);
      }
    } catch {
      toast.error('Error fetching books');
    } finally {
      setLoading(false);
    }
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
      toast.error('Không tìm thấy sách');
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setFilteredBooks([]);
  };

  return (
    <div className='list-books'>
      <form onSubmit={handleSearchSubmit} className='search-container'>
        <FaSearch className='search-icon' />
        <input
          type='text'
          placeholder='Tìm kiếm theo tên sách, ID sách hoặc thể loại... (Nhấn Enter để tìm)'
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
            <th>STT</th>
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
          {currentBooks.map((book, index) => (
            <tr
              key={book.id}
              onClick={() => navigate(`/bookDetail/${book.id_product}`, { state: { book } })}
              style={{ cursor: 'pointer' }}
              className='book-row'
            >
              <td>{index + 1}</td>
              <td>{book.id_product}</td>
              <td>{book.name}</td>
              <td>{book.genre}</td>
              <td>{book.classify}</td>
              <td>{book.price.toLocaleString('vi-VN')}</td>
              <td>{book.quantity - book.sold}</td>
              <td className={book.validate === 1 ? 'validated' : 'not-validated'}>
                {book.validate === 1 ? '✅' : '❌'}
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
          Trang đầu
        </button>
        <button
          className='pagination-button'
          onClick={() => handlePaginationClick(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Trước
        </button>

        <span className='page-info'>
          Trang {currentPage}/{totalPages}
        </span>

        <button
          className='pagination-button'
          onClick={() => handlePaginationClick(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Sau
        </button>
      </div>
    </div>
  );
}

export default MyListBooks;
