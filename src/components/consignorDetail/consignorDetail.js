import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './consignorDetail.scss';
import { toast } from 'react-toastify';
import MyListBooks from '../../pages/myListBooks/myListBooks';

function ConsignorDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [memberName, setMemberName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedConsignor, setEditedConsignor] = useState(state?.consignor || null);

  const consignor = state?.consignor;
  const userID = localStorage.getItem('userID');
  const userRole = localStorage.getItem('userRole');
  const canEdit = consignor?.id_member === userID || userRole === 'BTC' || userRole === 'Admin';

  const removeVietnameseDiacritics = (str) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, (x) => (x === 'đ' ? 'd' : 'D'));
  };

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

  useEffect(() => {
    const fetchName = async () => {
      const name = await getNameMember(consignor.id_member);
      setMemberName(name);
    };
    fetchName();
  }, [consignor.id_member]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'holder_name') {
      const formattedValue = removeVietnameseDiacritics(value.toUpperCase());
      setEditedConsignor((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setEditedConsignor((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedConsignor(consignor);
  };

  const handleSave = async () => {
    try {
      const URL = `${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_API_UPDATE_OBJECT}`;
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          typeOb: 'consignor',
          id: consignor.id_consignor,
          data: {
            name: editedConsignor.name,
            address: editedConsignor.address,
            bank_name: editedConsignor.bank_name,
            id_bank: editedConsignor.id_bank,
            holder_name: editedConsignor.holder_name,
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Cập nhật thông tin thành công');
        setIsEditing(false);
        state.consignor = editedConsignor;
      } else {
        toast.error('Lỗi khi cập nhật: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Lỗi khi cập nhật thông tin');
    }
  };

  if (!consignor) {
    return <div>Không tìm thấy thông tin người ký gửi</div>;
  }

  return (
    <div className='consignor-detail'>
      <div className='top-button-container'>
        <button className='back-button' onClick={() => navigate(-1)}>
          ← Quay lại
        </button>
      </div>

      <h2>Thông tin chi tiết người ký gửi</h2>

      <div className='notes-container'>
        <span className='note warning'>*Khi nhập sai ID hoặc SĐT, vui lòng xóa người ký gửi và nhập lại</span>
      </div>

      <div className='details-grid'>
        <div className='detail-item'>
          <span className='label'>ID/SĐT:</span>
          <span className='value'>{consignor.id_consignor}</span>
        </div>

        <div className='detail-item'>
          <span className='label'>Tên:</span>
          {isEditing ? (
            <input
              type='text'
              name='name'
              value={editedConsignor.name}
              onChange={handleChange}
              className='edit-input'
            />
          ) : (
            <span className='value'>{consignor.name}</span>
          )}
        </div>

        <div className='detail-item'>
          <span className='label'>Địa chỉ:</span>
          {isEditing ? (
            <input
              type='text'
              name='address'
              value={editedConsignor.address}
              onChange={handleChange}
              className='edit-input'
            />
          ) : (
            <span className='value'>{consignor.address}</span>
          )}
        </div>

        <div className='detail-item'>
          <span className='label'>Ngân hàng:</span>
          {isEditing ? (
            <input
              type='text'
              name='bank_name'
              value={editedConsignor.bank_name}
              onChange={handleChange}
              className='edit-input'
            />
          ) : (
            <span className='value'>{consignor.bank_name}</span>
          )}
        </div>

        <div className='detail-item'>
          <span className='label'>Số tài khoản:</span>
          {isEditing ? (
            <input
              type='text'
              name='id_bank'
              value={editedConsignor.id_bank}
              onChange={handleChange}
              className='edit-input'
            />
          ) : (
            <span className='value'>{consignor.id_bank}</span>
          )}
        </div>

        <div className='detail-item'>
          <span className='label'>Chủ tài khoản:</span>
          {isEditing ? (
            <input
              type='text'
              name='holder_name'
              value={editedConsignor.holder_name}
              onChange={handleChange}
              className='edit-input'
            />
          ) : (
            <span className='value'>{consignor.holder_name}</span>
          )}
        </div>

        <div className='detail-item'>
          <span className='label'>Tiền hoàn:</span>
          <span className='value'>{consignor.cash_back.toLocaleString('vi-VN')} VNĐ</span>
        </div>

        <div className='detail-item'>
          <span className='label'>Người nhập:</span>
          <span className='value'>{memberName || 'Chưa có thông tin'} </span>
        </div>
      </div>
      <div className='button-container'>
        {!isEditing ? (
          canEdit && (
            <button className='edit-button' onClick={handleEdit}>
              Chỉnh sửa
            </button>
          )
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
      <h2>Danh sách sách đã ký gửi</h2>
      <MyListBooks userId={consignor.id_consignor} typeUser={'consignor'} />
    </div>
  );
}

export default ConsignorDetail;
