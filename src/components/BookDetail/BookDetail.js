import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './BookDetail.scss';

function BookDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedBook, setEditedBook] = useState(state?.book || null);
  const book = state?.book;

  if (!book) {
    return <div>Book not found</div>;
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const URL = process.env.REACT_APP_DOMAIN + process.env.REACT_APP_API_UPDATE_OBJECT;
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          typeOb: 'product',
          id: editedBook.id_product,
          data: {
            id_member: editedBook.id_member,
            id_consignor: editedBook.id_consignor,
            name: editedBook.name,
            age: editedBook.age,
            genre: editedBook.genre,
            classify: editedBook.classify,
            bc_cost: editedBook.bc_cost,
            discount: editedBook.discount,
            price: editedBook.price,
            cash_back: editedBook.cash_back,
            quantity: editedBook.quantity,
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Cập nhật thành công');
        setIsEditing(false);
        // Update the local state with new data
        state.book = editedBook;
      } else {
        toast.error('Lỗi khi cập nhật: ' + result.message);
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật');
      console.error('Error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedBook((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedBook(book); // Reset to original values
  };

  return (
    <div className='book-detail'>
      <h2>Thông tin chi tiết sách</h2>
      <div className='details-grid'>
        <div className='detail-item'>
          <span className='label'>ID:</span>
          <span className='value'>{book.id_product}</span>
        </div>
        <div className='detail-item'>
          <span className='label'>ID Người ký gửi:</span>
          <span className='value'>{book.id_consignor}</span>
        </div>
        <div className='detail-item'>
          <span className='label'>Tên sách:</span>
          {isEditing ? (
            <input type='text' name='name' value={editedBook.name} onChange={handleChange} className='edit-input' />
          ) : (
            <span className='value'>{book.name}</span>
          )}
        </div>
        <div className='detail-item'>
          <span className='label'>Độ tuổi:</span>
          {isEditing ? (
            <input type='text' name='age' value={editedBook.age} onChange={handleChange} className='edit-input' />
          ) : (
            <span className='value'>{book.age}</span>
          )}
        </div>
        <div className='detail-item'>
          <span className='label'>Thể loại:</span>
          {isEditing ? (
            <input type='text' name='genre' value={editedBook.genre} onChange={handleChange} className='edit-input' />
          ) : (
            <span className='value'>{book.genre}</span>
          )}
        </div>
        <div className='detail-item'>
          <span className='label'>Phân loại:</span>
          {isEditing ? (
            <input
              type='text'
              name='classify'
              value={editedBook.classify}
              onChange={handleChange}
              className='edit-input'
            />
          ) : (
            <span className='value'>{book.classify}</span>
          )}
        </div>
        <div className='detail-item'>
          <span className='label'>Giá gốc:</span>
          {isEditing ? (
            <input
              type='number'
              name='bc_cost'
              value={editedBook.bc_cost}
              onChange={handleChange}
              className='edit-input'
            />
          ) : (
            <span className='value'>{book.bc_cost.toLocaleString('vi-VN')} VNĐ</span>
          )}
        </div>
        <div className='detail-item'>
          <span className='label'>Chiết khấu:</span>
          {isEditing ? (
            <input
              type='number'
              name='discount'
              value={editedBook.discount}
              onChange={handleChange}
              className='edit-input'
            />
          ) : (
            <span className='value'>{book.discount}%</span>
          )}
        </div>
        <div className='detail-item'>
          <span className='label'>Giá bán:</span>
          <span className='value'>{book.price.toLocaleString('vi-VN')} VNĐ</span>
        </div>
        <div className='detail-item'>
          <span className='label'>Tiền hoàn:</span>

          <span className='value'>{book.cash_back.toLocaleString('vi-VN')} VNĐ</span>
        </div>
        <div className='detail-item'>
          <span className='label'>Số lượng tồn kho:</span>
          <span className='value'>{(book.quantity - book.sold).toLocaleString('vi-VN')}</span>
        </div>
        <div className='detail-item'>
          <span className='label'>Xác thực:</span>
          <span className={`value ${book.validate === 1 ? 'validated' : 'not-validated'}`}>
            {book.validate === 1 ? 'Đã xác thực' : 'Chưa xác thực'}
          </span>
        </div>
      </div>

      <div className='button-container'>
        {!isEditing ? (
          <button
            className={`edit-button ${book.validate === 1 ? 'disabled' : ''}`}
            onClick={handleEdit}
            disabled={book.validate === 1}
          >
            {book.validate === 1 ? 'Không thể chỉnh sửa' : 'Chỉnh sửa'}
          </button>
        ) : (
          <>
            <button className='save-button' onClick={handleSave}>
              Lưu
            </button>
            <button className='cancel-button' onClick={handleCancel}>
              Hủy
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default BookDetail;
