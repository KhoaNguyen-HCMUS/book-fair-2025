import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaSearch } from 'react-icons/fa';
import './myConsignor.scss';

function MyConsignor() {
  const [consignors, setConsignors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [filteredConsignors, setFilteredConsignors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Get current consignors
  const indexOfLastConsignor = currentPage * itemsPerPage;
  const indexOfFirstConsignor = indexOfLastConsignor - itemsPerPage;
  const currentConsignors = (filteredConsignors.length > 0 ? filteredConsignors : consignors).slice(
    indexOfFirstConsignor,
    indexOfLastConsignor
  );
  const totalPages = Math.ceil((filteredConsignors.length > 0 ? filteredConsignors : consignors).length / itemsPerPage);

  useEffect(() => {
    fetchConsignors();
  }, []);

  const fetchConsignors = async () => {
    try {
      const userId = localStorage.getItem('userID');
      const URL = `${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_API_GET_LIST_CONSIGNORS_BY_ID}${userId}`;
      const response = await fetch(URL);
      const result = await response.json();

      if (result.success) {
        setConsignors(result.data);
      } else {
        toast.error('Lỗi khi tải danh sách người ký gửi');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Lỗi khi tải danh sách người ký gửi');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const filtered = consignors.filter(
      (consignor) =>
        consignor.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        consignor.id_consignor.toLowerCase().includes(searchInput.toLowerCase())
    );

    setFilteredConsignors(filtered);
    if (filtered.length === 0) {
      toast.error('Không tìm thấy người ký gửi');
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setFilteredConsignors([]);
  };

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div className='loading'>Đang tải dữ liệu...</div>;
  }

  return (
    <div className='list-consignors'>
      <form onSubmit={handleSearchSubmit} className='search-container'>
        <FaSearch className='search-icon' />
        <input
          type='text'
          placeholder='Tìm kiếm theo tên hoặc ID người ký gửi... (Nhấn Enter để tìm)'
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

      <table className='consignor-table'>
        <thead>
          <tr>
            <th>SĐT/ID</th>
            <th>Tên</th>
            <th>Địa chỉ</th>
            <th>Ngân hàng</th>
            <th>Số tài khoản</th>
            <th>Chủ tài khoản</th>
            <th>Tiền hoàn</th>
          </tr>
        </thead>
        <tbody>
          {currentConsignors.map((consignor) => (
            <tr key={consignor.id_consignor} className='consignor-row'>
              <td>{consignor.id_consignor}</td>
              <td>{consignor.name}</td>
              <td>{consignor.address}</td>
              <td>{consignor.bank_name}</td>
              <td>{consignor.id_bank}</td>
              <td>{consignor.holder_name}</td>
              <td>{consignor.cash_back.toLocaleString('vi-VN')} VNĐ</td>
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
          Trang {currentPage} / {totalPages}
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

export default MyConsignor;
