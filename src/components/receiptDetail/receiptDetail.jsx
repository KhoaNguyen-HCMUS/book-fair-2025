import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './receiptDetail.scss';
import { useNavigate } from 'react-router-dom';

function ReceiptDetail() {
  const { receiptId } = useParams(); // Lấy ID đơn hàng từ URL
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receiptDetails, setReceiptDetails] = useState({});
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    const fetchReceiptDetails = async () => {
      try {
        const URL = `${import.meta.env.VITE_DOMAIN_BACKUP}${import.meta.env.VITE_API_GET_RECEIPT_BY_ID}${receiptId}`;
        const response = await fetch(URL);
        const result = await response.json();

        if (result.success) {
          setReceiptDetails(result.receipt);
          setBooks(result.orders);
        } else {
          toast.error('Lỗi khi tải chi tiết đơn hàng');
        }
      } catch {
        toast.error('Lỗi khi tải chi tiết đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchReceiptDetails();
  }, [receiptId]);

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      return;
    }
    try {
      const userID = localStorage.getItem('userID');
      const URL = `${import.meta.env.VITE_DOMAIN_BACKUP}${
        import.meta.env.VITE_API_DELETE_RECEIPT
      }${receiptId}&id_member=${userID}`;
      const response = await fetch(URL, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (result.success) {
        toast.success('Xóa đơn hàng thành công');
        navigate(-1); // Go back to previous page
      } else {
        toast.error('Lỗi khi xóa đơn hàng');
      }
    } catch {
      toast.error('Lỗi khi xóa đơn hàng');
    }
  };
  return (
    <div className='receipt-detail'>
      <div className='top-button-container'>
        <button className='back-button' onClick={() => navigate(-1)}>
          ← Quay lại
        </button>
        {(userRole === 'BTC' || userRole === 'Admin') && (
          <button className='delete-button' onClick={handleDelete}>
            Xóa
          </button>
        )}
      </div>
      <h3>Chi tiết đơn hàng #{receiptId}</h3>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className='receipt-info'>
          <p>
            <strong>Tên Thu Ngân:</strong> {receiptDetails.name_cashier}
          </p>
          <p>
            <strong>Thời gian: </strong>
            {receiptDetails.createAt}
          </p>
          <p>
            <strong>Thanh toán: </strong>
            {receiptDetails.payment_method === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}
          </p>
          <p>
            <strong>Tổng tiền: </strong> {Math.floor(receiptDetails.total_amount).toLocaleString('vi-VN')}
          </p>
          <p>
            <strong> Tiền giảm: </strong> {receiptDetails.voucher ? receiptDetails.voucher : 0} ₫
          </p>
          <table className='book-table'>
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã sách</th>
                <th>Tên sách</th>
                <th>Số lượng</th>
                <th>Giá</th>
                <th>Tổng</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr
                  key={book.id_product}
                  onClick={() => navigate(`/bookDetail/${book.id_product}`, { state: { book } })}
                  style={{ cursor: 'pointer' }}
                  className='book-row'
                >
                  <td>{index + 1}</td>
                  <td>{book.id_product}</td>
                  <td>{book.name}</td>
                  <td>{book.quantity}</td>
                  <td>{parseFloat(book.price).toLocaleString('vi-VN')} ₫</td>
                  <td>{(book.quantity * book.price).toLocaleString('vi-VN')} ₫</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ReceiptDetail;
