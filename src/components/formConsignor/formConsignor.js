import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { renderInput } from '../formComponents/formComponents.js';

export const FormConsignor = () => {
  const [formData, setFormData] = useState({
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
    console.log('Consignor Data:', formData);
    // Add API call here
    toast.success('Người ký gửi đã được thêm');
    handleReset();
  };

  return (
    <form className='form' onSubmit={handleSubmit}>
      <h2>Thông Tin Người Ký Gửi</h2>
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
        label: 'Mối quan hệ của Chủ tài khoản với người nhận ký gửi:',
        name: 'relationship',
        type: 'text',
        placeholder: 'Cha, mẹ, chính chủ,...',
        value: formData.relationship,
        onChange: handleChange,
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

export default FormConsignor;
