import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './addBook.scss';

function AddBook() {
  const [activeForm, setActiveForm] = useState('consigner');

  const renderForm = () => {
    switch (activeForm) {
      case 'consigner':
        return <ConsignerForm />;
      case 'consignment':
        return <ConsignmentBookForm />;
      case 'publisher':
        return <PublisherBookForm />;
      default:
        return null;
    }
  };

  return (
    <div className='add-book-container'>
      <div className='form-selector'>
        {['consigner', 'consignment', 'publisher'].map((type) => (
          <button
            key={type}
            className={`selector-btn ${activeForm === type ? 'active' : ''}`}
            onClick={() => setActiveForm(type)}
          >
            {type === 'consigner' && 'Thêm Người Ký Gửi'}
            {type === 'consignment' && 'Thêm Sách Ký Gửi'}
            {type === 'publisher' && 'Thêm Sách Nhà Xuất Bản'}
          </button>
        ))}
      </div>

      <div className='form-container'>{renderForm()}</div>
    </div>
  );
}

const ConsignerForm = () => {
  const IdConsignor = (prefix) => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}-${timestamp}-${random}`;
  };

  const [formData, setFormData] = useState({
    id: IdConsignor('CG'),
    name: '',
    phone: '',
    email: '',
    address: '',
    bank: '',
    account: '',
    accountName: '',
    relationship: '',
    amount: 0,
  });

  const handleReset = () => {
    setFormData({
      id: IdConsignor('CG'), // Generate new ID
      name: '',
      phone: '',
      email: '',
      address: '',
      bank: '',
      account: '',
      accountName: '',
      relationship: '',
      amount: 0,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Consigner Data:', formData);
    // Add API call here
  };

  return (
    <form className='form' onSubmit={handleSubmit}>
      <h2>Thông Tin Người Ký Gửi</h2>
      {renderInput({
        label: 'ID',
        name: 'id',
        value: formData.id,
        disabled: true,
      })}
      {renderInput({
        label: 'Tên:',
        name: 'name',
        type: 'text',
        value: formData.name,
        onChange: handleChange,
      })}

      {renderInput({
        label: 'Số điện thoại:',
        name: 'phone',
        type: 'tel',
        value: formData.phone,
        onChange: handleChange,
      })}

      {renderInput({
        label: 'Địa chỉ:',
        name: 'address',
        type: 'text',
        value: formData.address,
        onChange: handleChange,
      })}

      {renderInput({
        label: 'Ngân hàng:',
        name: 'bank',
        type: 'text',
        value: formData.bank,
        onChange: handleChange,
      })}

      {renderInput({
        label: 'Số tài khoản:',
        name: 'account',
        type: 'text',
        value: formData.account,
        onChange: handleChange,
      })}

      {renderInput({
        label: 'Tên tài khoản:',
        name: 'accountName',
        type: 'text',
        placeholder: 'Họ và Tên Chủ Tài Khoản',
        value: formData.accountName,
        onChange: handleChange,
      })}

      {renderInput({
        label: 'Mối quan hệ của Tên tài khoản với người nhận ký gửi:',
        name: 'relationship',
        type: 'text',
        placeholder: 'Cha, mẹ, chính chủ,...',
        value: formData.relationship,
        onChange: handleChange,
      })}

      {renderInput({
        label: 'Số tiền giải ngân',
        name: 'amount',
        value: '0',
        type: 'text',
        disabled: true,
        value: formData.amount,
      })}
      <div className='button-group'>
        <button type='submit'>Thêm Người Ký Gửi</button>
        <button type='button' onClick={handleReset} className='reset-button'>
          Làm Mới
        </button>
      </div>
    </form>
  );
};

const ConsignmentBookForm = () => (
  <form className='form'>
    <h2>Thêm Sách Ký Gửi</h2>
    {renderInput('Tên Sách:', 'text')}
    {renderSelect('Người Ký Gửi:', [])}
    {renderInput('Giá:', 'number')}
    <button type='submit'>Thêm Sách</button>
  </form>
);

const PublisherBookForm = () => (
  <form className='form'>
    <h2>Thêm Sách Nhà Xuất Bản</h2>
    {renderInput('Tên Sách:', 'text')}
    {renderInput('Nhà Xuất Bản:', 'text')}
    {renderInput('Giá:', 'number')}
    <button type='submit'>Thêm Sách</button>
  </form>
);

const renderInput = ({ label, type = 'text', value, onChange, placeholder, disabled = false, name }) => (
  <div className='form-group'>
    <label>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={disabled ? 'disabled-input' : ''}
    />
  </div>
);

const renderSelect = (label, options) => (
  <div className='form-group'>
    <label>{label}</label>
    <select required>
      <option value=''>Chọn {label.toLowerCase()}</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default AddBook;
