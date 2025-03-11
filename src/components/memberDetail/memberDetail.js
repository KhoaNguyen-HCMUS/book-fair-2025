import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import './memberDetail.scss';

function MemberDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editedMember, setEditedMember] = useState(state?.member);

  const currentUserRole = localStorage.getItem('userRole');
  const member = state?.member;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedMember((prev) => ({
      ...prev,
      [name]: value,
    }));
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
          typeOb: 'member',
          id: member.id_member,
          data: {
            name: editedMember.name,
            role: editedMember.role,
          },
        }),
      });

      const result = await response.json();
      if (result.success) {
        // Update local state directly
        setEditedMember({
          ...member,
          name: editedMember.name,
          role: editedMember.role,
        });

        // Update the state object if needed
        if (state.member) {
          state.member = {
            ...state.member,
            name: editedMember.name,
            role: editedMember.role,
          };
        }

        toast.success('Cập nhật thành công');
        setIsEditing(false);
      } else {
        toast.error('Lỗi khi cập nhật: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Lỗi khi cập nhật');
    }
  };

  const removeVietnameseDiacritics = (str) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, (x) => (x === 'đ' ? 'd' : 'D'));
  };

  if (!member) {
    return <div>Không tìm thấy thông tin thành viên</div>;
  }

  return (
    <div className='member-detail'>
      <div className='top-button-container'>
        <button className='back-button' onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>

      <h2>Thông tin chi tiết thành viên</h2>

      <div className='details-grid'>
        <div className='detail-item'>
          <span className='label'>ID:</span>
          <span className='value'>{member.id_member}</span>
        </div>

        <div className='detail-item'>
          <span className='label'>Tên:</span>
          {isEditing ? (
            <input type='text' name='name' value={editedMember.name} onChange={handleChange} className='edit-input' />
          ) : (
            <span className='value'>{member.name}</span>
          )}
        </div>

        <div className='detail-item'>
          <span className='label'>Vai trò:</span>
          {isEditing ? (
            <select name='role' value={editedMember.role} onChange={handleChange} className='edit-input'>
              <option value='CTV'>CTV</option>
              <option value='BTC'>BTC</option>
              <option value='ER'>ER</option>
              <option value='Cashier'>Cashier</option>
              <option value='Admin'>Admin</option>
            </select>
          ) : (
            <span className='value'>{member.role}</span>
          )}
        </div>

        <div className='detail-item'>
          <span className='label'>Số sách:</span>
          <span className='value'>{member.count}</span>
        </div>
      </div>

      {currentUserRole === 'Admin' && (
        <div className='button-container'>
          {!isEditing ? (
            <button className='edit-button' onClick={() => setIsEditing(true)}>
              Chỉnh sửa
            </button>
          ) : (
            <>
              <button className='save-button' onClick={handleSave}>
                Lưu
              </button>
              <button
                className='cancel-button'
                onClick={() => {
                  setIsEditing(false);
                  setEditedMember(member);
                }}
              >
                Hủy
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default MemberDetail;
