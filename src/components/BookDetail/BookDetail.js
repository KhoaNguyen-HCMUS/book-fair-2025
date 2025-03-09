import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './BookDetail.scss';
import { formatCurrency, renderSelect } from '../../components/formComponents/formComponents.js';

function BookDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedBook, setEditedBook] = useState(state?.book || null);
  const [memberName, setMemberName] = useState('');
  const [validatorName, setValidatorName] = useState('');

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

  const canEdit =
    userRole === 'BTC' ||
    userRole === 'Admin' ||
    userRole === 'CTV' ||
    book?.id_member === localStorage.getItem('userID');

  const getNameMember = async (id) => {
    try {
      const URL = `${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_API_GET_MEMBER_BY_ID}${id}`;
      const response = await fetch(URL);
      const result = await response.json();
      return result.data.name;
    } catch (error) {
      console.error('Error:', error);
      return 'Error';
    }
  };

  const calculatePrice = (originalPrice, discount, classify, salePrice) => {
    const price = parseFloat(originalPrice);

    if (isNaN(price)) return 0;

    if (classify === 'Sách Ký Gửi' && (discount === '0' || discount === '100')) {
      return parseInt(salePrice);
    }

    if (classify === 'Sách NXB') {
      // For NXB books: apply discount percentage
      return Math.round(price * (1 - discount / 100));
    } else {
      // For consignment books: multiply by percentage directly
      return Math.round(price * (1 - discount / 100));
    }
  };

  const calculateRefund = (salePrice, originalPrice) => {
    const price = parseFloat(salePrice);
    const original = parseFloat(originalPrice);

    if (isNaN(price) || isNaN(original)) return 0;
    if (originalPrice === 0) return salePrice * 0.9;
    return price - original * 0.05;
  };

  const handleSave = async () => {
    if (editedBook.discount > 100) {
      toast.error('Chiết khấu không được lớn hơn 100%');
      return;
    }
    let confirmMessage = '';
    const priceChanged =
      editedBook.bc_cost !== book.bc_cost ||
      editedBook.discount !== book.discount ||
      (book.classify === 'Sách Quyên Góp' && editedBook.price !== book.price);

    if (editedBook.price === 0 || editedBook.price === '') {
      confirmMessage = 'Giá bán đang bằng 0\n';
    } else if (priceChanged) {
      if (book.classify === 'Sách Quyên Góp') {
        // For donated books, use the manually entered price
        confirmMessage = `
    Thông tin sau khi thay đổi:
    - Giá bán mới: ${parseInt(editedBook.price).toLocaleString('vi-VN')} VNĐ
    
    Bạn có chắc chắn muốn lưu thay đổi?
    `;
      } else {
        // Existing price calculation logic for other book types

        const newPrice = calculatePrice(editedBook.bc_cost, editedBook.discount, editedBook.classify, editedBook.price);
        const newRefund = calculateRefund(newPrice, editedBook.bc_cost);

        confirmMessage = `
    Thông tin sau khi tính toán:
    - Giá bán mới: ${newPrice.toLocaleString('vi-VN')} VNĐ
    - Tiền hoàn mới: ${newRefund.toLocaleString('vi-VN')} VNĐ
    
    Bạn có chắc chắn muốn lưu thay đổi?
    `;

        editedBook.price = newPrice;
        editedBook.cash_back = newRefund;
      }
    } else {
      confirmMessage += 'Bạn có chắc chắn muốn lưu thay đổi?';
    }

    const isConfirmed = window.confirm(confirmMessage);

    if (!isConfirmed) {
      return;
    }

    // Set discount to 100 for donated books
    editedBook.discount = book.classify === 'Sách Quyên Góp' ? 100 : parseInt(editedBook.discount);
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
            quantity: editedBook.stock,
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
    if (name === 'bc_cost' || name === 'price') {
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

  const handleDelete = async () => {
    if (book.validate === 1 && userRole !== 'BTC' && userRole !== 'Admin') {
      toast.error('Không thể xóa sách đã xác thực');
      return;
    }

    const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa sách này?');
    if (!isConfirmed) return;

    try {
      const URL = `${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_API_DELETE_BOOK}${book.id_product}`;
      const response = await fetch(URL, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Xóa sách thành công');
        navigate(-1);
      } else {
        toast.error('Lỗi khi xóa sách: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Lỗi khi xóa sách');
    }
  };

  const handleValidate = async () => {
    let confirmMessage = ' ';
    if (book.price === 0 || book.price === '') {
      confirmMessage = 'Giá bán đang bằng 0\n Bạn có chắc chắn muốn xác thực sách này?';
    } else {
      confirmMessage = 'Bạn có chắc chắn muốn xác thực sách này?';
    }

    const isConfirmed = window.confirm(confirmMessage);
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
        state.book.validate = 1;
        state.book.id_validate = userId;
        setEditedBook({ ...editedBook, validate: 1, id_validate: userId });

        // Fetch and update validator name
        const validatorName = await getNameMember(userId);
        setValidatorName(validatorName);

        toast.success('Xác thực sách thành công');
      } else {
        toast.error('Lỗi khi xác thực: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Lỗi khi xác thực sách');
    }
  };

  useEffect(() => {
    const fetchNames = async () => {
      if (book.id_member) {
        const memberName = await getNameMember(book.id_member);
        setMemberName(memberName);
      }
      if (book.validate === 1 && book.id_validate) {
        const validatorName = await getNameMember(book.id_validate);
        setValidatorName(validatorName);
      }
    };
    fetchNames();
  }, [book.id_member, book.validate, book.id_validate]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedBook({
      ...book,
      discount: book.discount === 100 ? '100' : book.discount.toString(),
      price: book.price,
      bc_cost: book.bc_cost,
    });
  };

  if (!book) {
    return <div>Book not found</div>;
  }
  return (
    <div className='book-detail'>
      <div className='top-button-container'>
        <button className='back-button' onClick={() => navigate(-1)}>
          ← Quay lại
        </button>
        <button
          className='delete-button'
          onClick={handleDelete}
          disabled={(book.validate === 1 && userRole !== 'BTC' && userRole !== 'Admin') || !canEdit}
        >
          {!canEdit
            ? 'Không có quyền xóa'
            : book.validate === 1 && userRole !== 'BTC' && userRole !== 'Admin'
            ? 'Không thể xóa'
            : 'Xóa sách'}
        </button>
      </div>

      <h2>Thông tin chi tiết sách</h2>
      <div className='notes-container'>
        <span className='note warning'>
          <i className='fas fa-exclamation-circle'></i>
          *Khi nhập sai ID sách hoặc Phân loại sách, vui lòng xóa sách nhập lại
        </span>
        <span className='note info'>
          <i className='fas fa-info-circle'></i>
          *Đối với Sách Ký Gửi, Giá bán và tiền hoàn sẽ được tính tự động khi chỉnh sửa thông tin
        </span>
      </div>
      <div className='details-grid'>
        <div className='detail-item'>
          <span className='label'>ID Sách:</span>
          <span className='value'>{book.id_product}</span>
        </div>
        <div className='detail-item'>
          <span className='label'>Phân loại:</span>
          <span className='value'>{book.classify}</span>
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
          <span className='label'>Giá bìa:</span>
          {isEditing &&
          !(editedBook.classify === 'Sách Ký Gửi' && (editedBook.discount === '100' || editedBook.discount === '0')) ? (
            <input
              type='text'
              name='bc_cost'
              value={formatCurrency(editedBook.bc_cost)}
              onChange={handleChange}
              className='edit-input'
            />
          ) : (
            <span className='value'>{formatCurrency(book.bc_cost) || 0} VNĐ</span>
          )}
        </div>

        <div className='detail-item'>
          <span className='label'>{book.classify === 'Sách NXB' ? 'Chiết khấu:' : 'Loại giá bán:'}</span>
          {isEditing ? (
            book.classify === 'Sách NXB' ? (
              <input
                type='number'
                name='discount'
                value={editedBook.discount + 5}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value) - 5;
                  setEditedBook((prev) => ({
                    ...prev,
                    discount: newValue,
                  }));
                }}
                className='edit-input'
                min='5'
                max='99'
              />
            ) : book.classify === 'Sách Quyên Góp' ? (
              // For donated books - show fixed text
              <span className='value'>Sách Đồng Giá</span>
            ) : (
              // For consignment books - show dropdown
              <select name='discount' value={editedBook.discount} onChange={handleChange} className='edit-input'>
                <option value='100'>Sách Đặc Biệt</option>
                <option value='55'>45% giá bìa</option>
                <option value='35'>65% giá bìa</option>
              </select>
            )
          ) : (
            // Display mode
            <span className='value'>
              {book.classify === 'Sách NXB'
                ? `${book.discount + 5}%`
                : book.classify === 'Sách Quyên Góp'
                ? 'Sách Đồng Giá'
                : book.discount === 100
                ? 'Sách Đặc Biệt'
                : book.discount === 55
                ? '45% giá bìa'
                : book.discount === 35
                ? '65% giá bìa'
                : 'Sách Đặc Biệt'}
            </span>
          )}
        </div>

        <div className='detail-item'>
          <span className='label'>Giá bán:</span>
          {isEditing &&
          (userRole === 'BTC' || userRole === 'Admin') &&
          (book.classify === 'Sách Quyên Góp' ||
            (book.classify === 'Sách Ký Gửi' && (editedBook.discount === '0' || editedBook.discount === '100'))) ? (
            <input
              type='text'
              name='price'
              value={formatCurrency(editedBook.price)}
              onChange={handleChange}
              className='edit-input'
            />
          ) : (
            <span className='value'>{formatCurrency(book.price) || 0} VNĐ</span>
          )}
        </div>

        <div className='detail-item'>
          <span className='label'>Tiền hoàn:</span>
          <span className='value'>{formatCurrency(book.cash_back) || 0} VNĐ</span>
        </div>
        <div className='detail-item'>
          <span className='label'>Số lượng tồn kho:</span>
          {isEditing ? (
            <input
              type='number'
              name='stock'
              value={editedBook.stock}
              onChange={handleChange}
              className='edit-input'
              min='1'
            />
          ) : (
            <span className='value'>{book.stock.toLocaleString('vi-VN')}</span>
          )}
        </div>
        <div className='detail-item'>
          <span className='label'>Xác thực:</span>
          <span className={`value ${book.validate === 1 ? 'validated' : 'not-validated'}`}>
            {book.validate === 1 ? 'Đã xác thực' : 'Chưa xác thực'}
          </span>
        </div>

        <div className='detail-item'>
          <span className='label'>Người nhập:</span>
          <span className='value'>{memberName || 'Chưa có thông tin'}</span>
        </div>

        <div className='detail-item'>
          <span className='label'>Người xác thực:</span>
          <span className='value'>{validatorName || 'Chưa có thông tin'}</span>
        </div>
      </div>

      <div className='button-container'>
        {!isEditing ? (
          <>
            <button
              className='edit-button'
              onClick={handleEdit}
              disabled={(book.validate === 1 && userRole !== 'BTC' && userRole !== 'Admin') || !canEdit}
            >
              {!canEdit
                ? 'Không có quyền chỉnh sửa'
                : book.validate === 1 && userRole !== 'BTC' && userRole !== 'Admin'
                ? 'Không thể chỉnh sửa'
                : 'Chỉnh sửa'}
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
