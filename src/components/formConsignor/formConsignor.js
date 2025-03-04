import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { renderInput } from '../formComponents/formComponents.js';
import './formConsignor.scss';

export const FormConsignor = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    bank: '',
    account: '',
    accountName: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Consignor Data:', formData);

    const URL = process.env.REACT_APP_DOMAIN + process.env.REACT_APP_API_CREATE_OBJECT;
    const userID = localStorage.getItem('userID');

    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          typeOb: 'consignor',
          data: {
            id_consignor: formData.phone,
            name: formData.name,
            id_bank: formData.account,
            bank_name: formData.bank,
            holder_name: formData.accountName,
            cash_back: formData.amount,
            id_member: userID,
            address: formData.address,
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Người ký gửi đã được thêm');
        handleReset();
      } else {
        if (result.message === 'id_consignor already exists') {
          toast.error('Số điện thoại đã tồn tại');
        } else {
          toast.error('Có lỗi khi thêm người ký gửi');
        }
      }
    } catch (error) {
      toast.error('Có lỗi khi thêm người ký gửi');
      console.error('Error:', error);
    }
  };

  return (
    <form className='form' onSubmit={handleSubmit}>
      <h2>Thông Tin Người Ký Gửi</h2>
      <div className='form-content'>
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
      </div>

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
