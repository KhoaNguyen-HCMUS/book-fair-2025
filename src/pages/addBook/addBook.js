import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './addBook.scss';

import { FormConsignor } from '../../components/formConsignor/formConsignor.js';

import { FormConsignmentBook } from '../../components/formConsignmentBook/formConsignmentBook.js';

import { FormPublisherBook } from '../../components/formPublisherBook/formPublisherBook.js';

function AddBook() {
  const [activeForm, setActiveForm] = useState('consignor');

  const userRole = localStorage.getItem('userRole');

  const allowedRoles = ['ER', 'Admin', 'BTC'];

  const canAccessPublisherForm = allowedRoles.includes(userRole);

  const renderForm = () => {
    switch (activeForm) {
      case 'consignor':
        return <FormConsignor />;
      case 'consignment':
        return <FormConsignmentBook />;
      case 'publisher':
        return canAccessPublisherForm ? <FormPublisherBook /> : renderDontHavePermission();
      default:
        return null;
    }
  };

  return (
    <div className='add-book-container'>
      <div className='form-selector'>
        {['consignor', 'consignment', 'publisher'].map((type) => (
          <button
            key={type}
            className={`selector-btn ${activeForm === type ? 'active' : ''}`}
            onClick={() => setActiveForm(type)}
          >
            {type === 'consignor' && 'Thêm Người Ký Gửi'}
            {type === 'consignment' && 'Thêm Sách Ký Gửi'}
            {type === 'publisher' && 'Thêm Sách Nhà Xuất Bản'}
          </button>
        ))}
      </div>

      <div className='form-container'>{renderForm()}</div>
    </div>
  );
}

const renderDontHavePermission = () => {
  return (
    <div className='dont-have-permission'>
      <h2>Bạn không có quyền truy cập nhập sách Nhà Xuất Bản</h2>
    </div>
  );
};

export default AddBook;
