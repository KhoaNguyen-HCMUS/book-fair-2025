import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './myConsignor.scss';

function MyConsignor({ userId }) {
  const userID = userId;
  const navigate = useNavigate();
  const [consignors, setConsignors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [filteredConsignors, setFilteredConsignors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

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

  const handleRowClick = (consignor) => {
    navigate(`/consignorDetail/${consignor.id_consignor}`, {
      state: { consignor },
    });
  };

  const fetchConsignors = async () => {
    try {
      const params = `consignor&&id=${userID}&typeUser=member`;
      const URL = `${import.meta.env.VITE_DOMAIN}${import.meta.env.VITE_API_GET_OBJECT_LIST_BY_ID}` + params;
      const response = await fetch(URL);
      const result = await response.json();

      if (result.success) {
        setConsignors(result.data);
      } else {
        toast.error('Lỗi khi tải danh sách người ký gửi');
      }
    } catch {
      toast.error('Lỗi khi tải danh sách người ký gửi');
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

    if (!searchInput.trim()) {
      setFilteredConsignors([]);
      return;
    }

    // Convert search input to lowercase and remove tones
    const normalizedSearchInput = removeVietnameseTones(searchInput.toLowerCase());

    const filtered = consignors.filter(
      (consignor) =>
        removeVietnameseTones(consignor.name.toLowerCase()).includes(normalizedSearchInput) ||
        removeVietnameseTones(consignor.id_consignor.toLowerCase()).includes(normalizedSearchInput) ||
        removeVietnameseTones(consignor.address.toLowerCase()).includes(normalizedSearchInput) ||
        removeVietnameseTones(consignor.bank_name.toLowerCase()).includes(normalizedSearchInput) ||
        removeVietnameseTones(consignor.id_bank.toLowerCase()).includes(normalizedSearchInput)
    );

    setFilteredConsignors(filtered);
    setCurrentPage(1);

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
    <div className='my-consignors'>
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
            <th>STT</th>
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
          {currentConsignors.map((consignor, index) => (
            <tr
              key={consignor.id_consignor}
              className='consignor-row'
              onClick={() => handleRowClick(consignor)}
              style={{ cursor: 'pointer' }}
            >
              <td>{index + 1}</td>
              <td>{consignor.id_consignor}</td>
              <td>{consignor.name}</td>
              <td>{consignor.address}</td>
              <td>{consignor.bank_name}</td>
              <td>{consignor.id_bank}</td>
              <td>{consignor.holder_name}</td>
              <td>{consignor.cash_back.toLocaleString('vi-VN')} </td>
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
