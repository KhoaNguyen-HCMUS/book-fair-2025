import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './consignorDetail.scss';

function ConsignorDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [memberName, setMemberName] = useState('');

  const consignor = state?.consignor;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

      <div className='details-grid'>
        <div className='detail-item'>
          <span className='label'>ID/SĐT:</span>
          <span className='value'>{consignor.id_consignor}</span>
        </div>

        <div className='detail-item'>
          <span className='label'>Tên:</span>
          <span className='value'>{consignor.name}</span>
        </div>

        <div className='detail-item'>
          <span className='label'>Địa chỉ:</span>
          <span className='value'>{consignor.address}</span>
        </div>

        <div className='detail-item'>
          <span className='label'>Ngân hàng:</span>
          <span className='value'>{consignor.bank_name}</span>
        </div>

        <div className='detail-item'>
          <span className='label'>Số tài khoản:</span>
          <span className='value'>{consignor.id_bank}</span>
        </div>

        <div className='detail-item'>
          <span className='label'>Chủ tài khoản:</span>
          <span className='value'>{consignor.holder_name}</span>
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
    </div>
  );
}

export default ConsignorDetail;
