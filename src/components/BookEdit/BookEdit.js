import React, { useState } from 'react';
import './BookEdit.scss';

const BookEdit = ({ book, onSave }) => {
  const [formData, setFormData] = useState({ ...book });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className='book-edit' onSubmit={handleSubmit}>
      <h2>Chỉnh sửa thông tin sách</h2>
      <div className='edit-item'>
        <label>ID:</label>
        <input type='text' name='id_product' value={formData.id_product} onChange={handleChange} readOnly />
      </div>
      <div className='edit-item'>
        <label>Tên sách:</label>
        <input type='text' name='name' value={formData.name} onChange={handleChange} />
      </div>
      <div className='edit-item'>
        <label>Thể loại:</label>
        <input type='text' name='genre' value={formData.genre} onChange={handleChange} />
      </div>
      <div className='edit-item'>
        <label>Phân loại:</label>
        <input type='text' name='classify' value={formData.classify} onChange={handleChange} />
      </div>
      <div className='edit-item'>
        <label>Giá bán:</label>
        <input type='number' name='price' value={formData.price} onChange={handleChange} />
      </div>
      <div className='edit-item'>
        <label>Số lượng tồn:</label>
        <input type='number' name='quantity' value={formData.quantity - formData.sold} onChange={handleChange} />
      </div>
      <div className='edit-item'>
        <label>Xác thực:</label>
        <select name='validate' value={formData.validate} onChange={handleChange}>
          <option value={1}>Đã xác thực</option>
          <option value={0}>Chưa xác thực</option>
        </select>
      </div>
      <button type='submit'>Lưu</button>
    </form>
  );
};

export default BookEdit;
