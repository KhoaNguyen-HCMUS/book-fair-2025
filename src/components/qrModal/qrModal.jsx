import React from 'react';

const QRModal = ({ qrCodeLink, receiptId, onClose }) => {
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCodeLink)}&size=200x200`;

  return (
    <div className='modal-overlay'>
      <div className='modal-content'>
        <h3 className='text-xl font-bold mb-4'>Tra cứu hóa đơn</h3>
        <img src={qrApiUrl} alt={`QR Code for receipt ${receiptId}`} className='mb-4' />
        <p>
          Quét mã QR để tra cứu hóa đơn: <strong>{receiptId}</strong>
        </p>
        <button className='btn-secondary mt-4' onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  );
};

export default QRModal;
