import React, { useState } from 'react';
import { toast } from 'react-toastify';
import BankSelector from '../bankSelector/bankSelector.jsx';
import AddressSelector from '../addressSelector/addressSelector.jsx';

import { renderInput } from '../formComponents/formComponents.jsx';
import './formConsignor.scss';

export const FormConsignor = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    bank: 'N/A',
    account: 'N/A',
    accountName: 'N/A',
    amount: 0,
  });

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      bank: 'N/A',
      account: 'N/A',
      accountName: 'N/A',
      amount: 0,
    });
  };

  const removeNonNumeric = (value) => {
    return value.replace(/[^0-9]/g, '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBankChange = (bankValue) => {
    setFormData((prev) => ({
      ...prev,
      bank: bankValue,
    }));
  };

  const handleAddressChange = (addressValue) => {
    setFormData((prev) => ({
      ...prev,
      address: addressValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.address || formData.address.trim() === '') {
      toast.error('Vui lòng chọn địa chỉ');
      return;
    }

    if (formData.bank === 'N/A' || formData.account === 'N/A' || formData.accountName === 'N/A') {
      const confirm = window.confirm('Bạn có chắc chắn muốn thêm người ký gửi mà không có thông tin ngân hàng?');
      if (!confirm) {
        return;
      }
    }
    const URL = import.meta.env.VITE_DOMAIN + import.meta.env.VITE_API_CREATE_OBJECT;
    const userID = localStorage.getItem('userID');

    setIsLoading(true);
    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          typeOb: 'consignor',
          id_member: localStorage.getItem('userID'), // Assuming you store userID in localStorage
          data: {
            id_consignor: removeNonNumeric(formData.phone),
            name: formData.name,
            id_bank: formData.account,
            bank_name: formData.bank,
            holder_name: normalizeAccountName(formData.accountName),
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
    } catch {
      toast.error('Có lỗi khi thêm người ký gửi');
    } finally {
      setIsLoading(false);
    }
  };

  const normalizeAccountName = (name) => {
    if (!name) return '';
    return name
      .trim()
      .replace(/\s+/g, ' ')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();
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
          removeSpace: true,
        })}

        <AddressSelector
          label='Địa chỉ:'
          value={formData.address}
          onChange={handleAddressChange}
          placeholder='Chọn địa chỉ'
        />

        <BankSelector label='Ngân hàng:' value={formData.bank} onChange={handleBankChange} placeholder='N/A' />

        {renderInput({
          label: 'Số tài khoản:',
          name: 'account',
          type: 'text',
          value: formData.account,
          onChange: handleChange,
          removeSpaces: true,
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
        <button type='submit' disabled={isLoading} className={isLoading ? 'loading' : ''}>
          {isLoading ? 'Đang xử lý...' : 'Thêm Người Ký Gửi'}
        </button>
        <button type='button' onClick={handleReset} disabled={isLoading}>
          Làm mới
        </button>
      </div>
    </form>
  );
};

export default FormConsignor;
