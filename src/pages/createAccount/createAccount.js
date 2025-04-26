import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { renderInput, renderSelect } from '../../components/formComponents/formComponents.js';
import './createAccount.scss';
import { hashFunction } from '../../components/hashFunction/hashFunction.js';

function CreateAccount() {
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    name: '',
    role: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // Danh sách role cơ bản
  const baseRoleOptions = ['CTV', 'BTC', 'ER', 'Cashier', 'Admin'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormData({
      id: '',
      password: '',
      name: '',
      role: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id || !formData.password || !formData.name || !formData.role) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const API_ENDPOINT = process.env.REACT_APP_DOMAIN + process.env.REACT_APP_API_CREATE_OBJECT;
    const hashedPassword = await hashFunction(formData.password);


    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          typeOb: 'member',
          data: {
            id_member: formData.id,
            password: hashedPassword,
            name: formData.name,
            role: formData.role,
          },
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      if (result.success) {
        toast.success('Tạo tài khoản thành công!');
        handleReset();
      } else {
        if (result.message === 'id_member ready exists') {
          toast.error('ID đã tồn tại, vui lòng sử dụng ID khác!');
        } else {
          toast.error('Có lỗi xảy ra: ' + result.message);
        }
      }
    } catch (error) {
      toast.error('Có lỗi khi kết nối đến máy chủ!');
    }
  };

  return (
    <div className='create-account-page'>
      <form className='create-account-form' onSubmit={handleSubmit}>
        {renderInput({
          label: 'ID Tài khoản',
          name: 'id',
          value: formData.id,
          onChange: handleChange,
        })}
        <div className='password-input-container'>
          {renderInput({
            label: 'Password',
            name: 'password',
            value: formData.password,
            onChange: handleChange,
            type: showPassword ? 'text' : 'password',
            required: true,
          })}
          <button type='button' className='toggle-password' onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? '🙈' : '🙉'}
          </button>
        </div>

        {renderInput({
          label: 'Name',
          name: 'name',
          value: formData.name,
          onChange: handleChange,
        })}
        {renderSelect({
          label: 'Role',
          name: 'role',
          value: formData.role,
          onChange: handleChange,
          options: baseRoleOptions,
        })}
        <button type='submit' className='create-account-btn'>
          Tạo Tài Khoản
        </button>
      </form>
    </div>
  );
}

export default CreateAccount;
