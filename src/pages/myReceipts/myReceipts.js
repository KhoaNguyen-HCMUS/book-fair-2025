import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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

  const handleRowClick = (Receipt) => {
    navigate(`/receiptDetail/${Receipt.id_receipt}`, {
      state: { Receipt },
    });
  };

  const fetchReceipts = async () => {
    try {
      const params = `receipt&&id=${userID}&typeUser=member`;
      const URL = `${process.env.REACT_APP_DOMAIN_BACKUP}${process.env.REACT_APP_API_GET_OBJECT_LIST_BY_ID}` + params;
      const response = await fetch(URL);
      const result = await response.json();

      console.log(result.data);
      if (result.success) {
        setReceipts(result.data);
      } else {
        toast.error('Lỗi khi tải danh sách đơn hàng');
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='myReceipts'>
      <h1>my Receipts</h1>

      <table className='Receipt-table'>
        <thead>
          <tr>
            <th>Receipt ID</th>
            <th>Name cashier</th>
            <th>Time</th>
            <th>Method</th>
            <th>Total</th>
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

                <td>{Receipt.createAt}</td>
                <td>{Receipt.payment_method}</td>
                <td>{Receipt.total_amount}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MyReceipts;
