import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

import './bookStore.scss';

const categories = {
  'Phân loại': ['Sách Ký Gửi', 'Sách NXB', 'Sách Quyên Góp', 'Sách Đặc Biệt'],
  'Thể loại': [
    'Khoa học xã hội & Nhân văn',
    'Khoa học tự nhiên & Công nghệ',
    'Sách giáo dục & trường học',
    'Văn học Việt Nam',
    'Văn học Nước ngoài ',
    'Văn học Nước ngoài biên phiên dịch',
    'Truyện tranh',
    'Khác',
  ],
  'Độ tuổi': ['Không giới hạn', '16+', '18+'],
  'Tình trạng': ['Đã xác thực', 'Chưa xác thực'],
  'Giá bán': ['Dưới 50k', '50k - 100k', '100k - 200k', 'Trên 200k'],
};

function BookStore() {
  const userID = localStorage.getItem('userID');
  const [books, setBooks] = useState([]);
  const [showUnvalidatedOnly, setShowUnvalidatedOnly] = useState(false);
  const [showSpecialOnly, setShowSpecialOnly] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState({});
  const [filteredResults, setFilteredResults] = useState([]);

  const [loading, setLoading] = useState(true);
  const [selectedBooks, setSelectedBooks] = useState([]);

  const [searchInput, setSearchInput] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const indexOfLastBook = currentPage * itemsPerPage;
  const indexOfFirstBook = indexOfLastBook - itemsPerPage;
  const currentBooks = filteredResults.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

  const toggleFilter = (category, item) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      if (!newFilters[category]) newFilters[category] = [];

      if (newFilters[category].includes(item)) {
        newFilters[category] = newFilters[category].filter((i) => i !== item);
        if (newFilters[category].length === 0) {
          delete newFilters[category];
        }
      } else {
        newFilters[category] = [...(newFilters[category] || []), item];
      }

      return newFilters;
    });
    setCurrentPage(1);
  };

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    let booksToShow = filteredBooks.length > 0 ? filteredBooks : books;

    if (Object.keys(selectedFilters).length > 0) {
      booksToShow = booksToShow.filter((book) => {
        return Object.entries(selectedFilters).every(([category, selectedItems]) => {
          if (!selectedItems || selectedItems.length === 0) return true;

          switch (category) {
            case 'Phân loại':
              if (selectedItems.includes('Sách Đặc Biệt')) {
                return book.classify === 'Sách Ký Gửi' && book.discount === 100;
              }
              return selectedItems.includes(book.classify);
            case 'Thể loại':
              return selectedItems.includes(book.genre);
            case 'Độ tuổi':
              return selectedItems.includes(book.age);
            case 'Tình trạng':
              return selectedItems.includes(book.validate === 1 ? 'Đã xác thực' : 'Chưa xác thực');
            case 'Giá bán':
              const price = book.price;
              return selectedItems.some((range) => {
                if (range === 'Dưới 50k') return price < 50000;
                if (range === '50k - 100k') return price >= 50000 && price < 100000;
                if (range === '100k - 200k') return price >= 100000 && price < 200000;
                if (range === 'Trên 200k') return price >= 200000;
                return false;
              });
            default:
              return true;
          }
        });
      });
    }

    setFilteredResults(booksToShow);

    const totalFilteredPages = Math.ceil(booksToShow.length / itemsPerPage);
    if (currentPage > totalFilteredPages) {
      setCurrentPage(1);
    }
  }, [selectedFilters, books, filteredBooks, currentPage, itemsPerPage]);

  const fetchBooks = async () => {
    try {
      const URL = process.env.REACT_APP_DOMAIN + process.env.REACT_APP_API_GET_LIST_BOOKS;
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
        removeVietnameseTones(book.genre.toLowerCase()).includes(searchTermNormalized) ||
        removeVietnameseTones(book.classify.toLowerCase()).includes(searchTermNormalized) ||
        removeVietnameseTones(book.id_consignor.toLowerCase()).includes(searchTermNormalized) ||
        removeVietnameseTones(book.age.toLowerCase()).includes(searchTermNormalized)
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
    <div className='book-store'>
      <div className='content-container'>
        <div className='filter-container'>
          {Object.entries(categories).map(([category, items]) => (
            <div key={category} className='filter-group'>
              <h3 className='filter-title'>{category}</h3>
              <div className='filter-options'>
                {items.map((item) => (
                  <button
                    key={item}
                    className={`filter-button ${selectedFilters[category]?.includes(item) ? 'active' : ''}`}
                    onClick={() => toggleFilter(category, item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='main-content'>
        <form onSubmit={handleSearchSubmit} className='search-container'>
          <FaSearch className='search-icon' />
          <input
            type='text'
            placeholder='Tìm kiếm theo tên sách, ID sách hoặc thể loại sách... (Nhấn Enter để tìm)'
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

        <div className='table-container'>
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
              {filteredResults.slice(indexOfFirstBook, indexOfLastBook).map((book, index) => (
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
                  <td>{book.price.toLocaleString('vi-VN')} VNĐ</td>
                  <td>{book.quantity - book.sold}</td>
                  <td className={book.validate === 1 ? 'validated' : 'not-validated'}>
                    {book.validate === 1 ? 'Đã xác thực' : 'Chưa xác thực'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
    </div>
  );
}

export default BookStore;
