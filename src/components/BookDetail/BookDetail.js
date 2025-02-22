import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './BookDetail.scss';
import { formatCurrency, renderSelect } from '../../components/formComponents/formComponents.js';

function BookDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedBook, setEditedBook] = useState(state?.book || null);
  const book = state?.book;
  const userRole = localStorage.getItem('userRole');

  const ageOptions = ['Không giới hạn', '16+', '18+'];
  const genreOptions = [
    'Khoa học xã hội & Nhân văn',
    'Khoa học tự nhiên & Công nghệ',
    'Sách giáo dục & trường học',
    'Văn học Việt Nam',
    'Văn học Nước ngoài',
    'Văn học Nước ngoài biên phiên dịch',
    'Truyện tranh',
    'Khác',
  ];
  const classifyOptions = ['Sách Ký Gửi', 'Sách NXB', 'Sách Quyên Góp'];

  if (!book) {
    return <div>Book not found</div>;
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const calculatePrice = (originalPrice, discount, classify) => {
    const price = parseFloat(originalPrice);
    if (isNaN(price)) return 0;

    if (classify === 'Sách NXB') {
      // For NXB books: apply discount percentage
      return Math.round(price * (1 - discount / 100));
    } else {
      // For consignment books: multiply by percentage directly
      return Math.round(price * (discount / 100));
    }
  };

  const calculateRefund = (salePrice, originalPrice) => {
    const price = parseFloat(salePrice);
    const original = parseFloat(originalPrice);
    if (isNaN(price) || isNaN(original)) return 0;
    return price - original * 0.05;
  };

  const handleSave = async () => {
    let confirmMessage;
    const priceChanged = editedBook.bc_cost !== book.bc_cost || editedBook.discount !== book.discount;

    if (priceChanged) {
      const newPrice = calculatePrice(editedBook.bc_cost, editedBook.discount, editedBook.classify);
      const newRefund = calculateRefund(newPrice, editedBook.bc_cost);

      confirmMessage = `
    Thông tin sau khi tính toán:
    - Giá bán mới: ${newPrice.toLocaleString('vi-VN')} VNĐ
    - Tiền hoàn mới: ${newRefund.toLocaleString('vi-VN')} VNĐ
    
    Bạn có chắc chắn muốn lưu thay đổi?
    `;

      editedBook.price = newPrice;
      editedBook.cash_back = newRefund;
    } else {
      confirmMessage = 'Bạn có chắc chắn muốn lưu thay đổi?';
    }

    const isConfirmed = window.confirm(confirmMessage);

    if (!isConfirmed) {
      return;
    }
    editedBook.discount = parseInt(editedBook.discount);
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
            stock: editedBook.stock,
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
    if (name === 'bc_cost') {
      setEditedBook((prev) => ({
        ...prev,
        [name]: value.replace(/[^0-9]/g, ''),
      }));
    } else {
      setEditedBook((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedBook(book); // Reset to original values
  };

  const handleValidate = async () => {
    const isConfirmed = window.confirm('Bạn có chắc chắn muốn xác thực sách này?');
    const userId = localStorage.getItem('userID');
    if (!isConfirmed) {
      return;
    }
    try {
      const URL = process.env.REACT_APP_DOMAIN + process.env.REACT_APP_API_UPDATE_OBJECT;
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          typeOb: 'product',
          id: book.id_product,
          data: {
            validate: 1,
            id_validate: userId,
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Xác thực sách thành công');
        // Update the local state
        state.book.validate = 1;
        setEditedBook({ ...editedBook, validate: 1 });
      } else {
        toast.error('Lỗi khi xác thực: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Lỗi khi xác thực sách');
    }
  };

  return (
    <div className='book-detail'>
      <button className='back-button' onClick={() => navigate(-1)}>
        ← Quay lại
      </button>
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
            <select name='age' value={editedBook.age} onChange={handleChange} className='edit-input'>
              {ageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <span className='value'>{book.age}</span>
          )}
        </div>
        <div className='detail-item'>
          <span className='label'>Thể loại:</span>
          {isEditing ? (
            <select name='genre' value={editedBook.genre} onChange={handleChange} className='edit-input'>
              {genreOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <span className='value'>{book.genre}</span>
          )}
        </div>
        <div className='detail-item'>
          <span className='label'>Phân loại:</span>
          {isEditing ? (
            <select name='classify' value={editedBook.classify} onChange={handleChange} className='edit-input'>
              {classifyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <span className='value'>{book.classify}</span>
          )}
        </div>
        <div className='detail-item'>
          <span className='label'>Giá gốc:</span>
          {isEditing ? (
            <input
              type='text' // Changed from 'number' to 'text'
              name='bc_cost'
              value={formatCurrency(editedBook.bc_cost)}
              onChange={handleChange}
              className='edit-input'
            />
          ) : (
            <span className='value'>{formatCurrency(book.bc_cost)} VNĐ</span>
          )}
        </div>
        <div className='detail-item'>
          <span className='label'>{book.classify === 'Sách NXB' ? 'Chiết khấu:' : 'Loại giá bán:'}</span>
          {isEditing ? (
            book.classify === 'Sách NXB' ? (
              <input
                type='number'
                name='discount'
                value={editedBook.discount}
                onChange={handleChange}
                className='edit-input'
                min='0'
                max='100'
              />
            ) : (
              <select name='discount' value={editedBook.discount} onChange={handleChange} className='edit-input'>
                <option value='45'>45% giá bìa</option>
                <option value='65'>65% giá bìa</option>
              </select>
            )
          ) : (
            <span className='value'>
              {book.classify === 'Sách NXB'
                ? `${book.discount}%`
                : book.discount === 45
                ? '45% giá bìa'
                : book.discount === 65
                ? '65% giá bìa'
                : 'Sách đặc biệt'}
            </span>
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
          <>
            <button
              className='edit-button'
              onClick={handleEdit}
              disabled={book.validate === 1 && userRole !== 'BTC' && userRole !== 'Admin'}
            >
              {book.validate === 1 && userRole !== 'BTC' && userRole !== 'Admin' ? 'Không thể chỉnh sửa' : 'Chỉnh sửa'}
            </button>

            {(userRole === 'BTC' || userRole === 'Admin') && book.validate === 0 && (
              <button className='validate-button' onClick={handleValidate}>
                Xác thực sách
              </button>
            )}
          </>
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
