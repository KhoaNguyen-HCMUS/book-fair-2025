import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import ReceiptStatistics from '../../components/receiptStats/receipStats';

import './myReceipts.scss';

function MyReceipts() {
  const userID = localStorage.getItem('userID');
  const navigate = useNavigate();
  const [Receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [filteredReceipts, setFilteredReceipts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const indexOfLastReceipt = currentPage * itemsPerPage;
  const indexOfFirstReceipt = indexOfLastReceipt - itemsPerPage;

  const currentReceipts = (filteredReceipts.length > 0 ? filteredReceipts : Receipts).slice(
    indexOfFirstReceipt,
    indexOfLastReceipt
  );

  const totalPages = Math.ceil((filteredReceipts.length > 0 ? filteredReceipts : Receipts).length / itemsPerPage);

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      const params = `receipt&&id=${userID}&typeUser=member`;
      const URL = `${import.meta.env.VITE_DOMAIN_BACKUP}${import.meta.env.VITE_API_GET_OBJECT_LIST_BY_ID}` + params;
      const response = await fetch(URL);
      const result = await response.json();

      if (result.success) {
        const sortedReceipts = result.data.sort((a, b) => {
          const numA = parseInt(a.id_receipt.split('_').pop());
          const numB = parseInt(b.id_receipt.split('_').pop());
          return numB - numA;
        });
        setReceipts(sortedReceipts);
      } else {
        toast.error('Lỗi khi tải danh sách đơn hàng');
      }
    } catch {
      toast.error('Lỗi khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowClick = (Receipt) => {
    navigate(`/receiptDetail/${Receipt.id_receipt}`, {
      state: { Receipt },
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchTerm = searchInput.trim().toLowerCase();
    const filtered = Receipts.filter((Receipt) => {
      const name = Receipt.name_cashier ? Receipt.name_cashier.toLowerCase() : '';
      const id = Receipt.id_receipt ? Receipt.id_receipt.toString() : '';
      return name.includes(searchTerm) || id.includes(searchTerm);
    });
    setFilteredReceipts(filtered);
    setCurrentPage(1); // Reset to the first page of filtered results
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setFilteredReceipts([]);
    setCurrentPage(1); // Reset to the first page of all results
  };

  return (
    <div className='myReceipts'>
      <ReceiptStatistics receipts={Receipts} />
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

      <table className='Receipt-table'>
        <thead>
          <tr>
            <th>ID đơn hàng</th>
            <th>Tên thu ngân</th>
            <th>Thời gian</th>
            <th>Thanh toán</th>
            <th>Tổng hóa đơn</th>
            <th>Giảm giá</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan='4'>Loading...</td>
            </tr>
          ) : (
            currentReceipts.map((Receipt) => (
              <tr key={Receipt.id_receipt} onClick={() => handleRowClick(Receipt)}>
                <td>{Receipt.id_receipt}</td>
                <td>{Receipt.name_cashier}</td>

                <td>{Receipt.createAt.replace('T', ' ').slice(0, 19)}</td>
                <td>{Receipt.payment_method === 'bank' ? 'Chuyển khoản' : 'Tiền mặt'}</td>
                <td>{Math.floor(Receipt.total_amount).toLocaleString('vi-VN')}</td>
                <td>{Math.floor(Receipt.voucher).toLocaleString('vi-VN')}</td>
                <td>{Math.floor(Receipt.total_amount - Receipt.voucher).toLocaleString('vi-VN')}</td>
              </tr>
            ))
          )}
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

export default MyReceipts;
