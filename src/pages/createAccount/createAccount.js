import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { renderInput, renderSelect } from '../../components/formComponents/formComponents.js';
import './createAccount.scss';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.id || !formData.password || !formData.name || !formData.role) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    // Gọi API hoặc xử lý tạo tài khoản ở đây
    console.log('Tạo tài khoản', formData);
    toast.success('Tạo tài khoản thành công');
    handleReset();
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
