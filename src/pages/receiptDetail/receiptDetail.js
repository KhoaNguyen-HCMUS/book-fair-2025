import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './receiptDetail.scss';

function ReceiptDetail() {
  const { receiptId } = useParams(); // Lấy ID hóa đơn từ URL
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceiptDetails = async () => {
      try {
        const URL = `${process.env.REACT_APP_DOMAIN_BACKUP}${process.env.REACT_APP_API_GET_RECEIPT_BY_ID}${receiptId}`;
        const response = await fetch(URL);
        const result = await response.json();

        if (result.success) {
          setBooks(result.data);
        } else {
          toast.error('Lỗi khi tải chi tiết hóa đơn');
        }
      } catch (error) {
        toast.error('Lỗi khi tải chi tiết hóa đơn');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceiptDetails();
  }, [receiptId]);

  return (
    <div className='receipt-detail'>
      <h1>Chi tiết hóa đơn #{receiptId}</h1>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className='book-table'>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên sách</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Tổng</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={book.id_product}>
                <td>{index + 1}</td>
                <td>{book.name}</td>
                <td>{book.quantity}</td>
                <td>{parseFloat(book.price).toLocaleString('vi-VN')} ₫</td>
                <td>{(book.quantity * book.price).toLocaleString('vi-VN')} ₫</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ReceiptDetail;
