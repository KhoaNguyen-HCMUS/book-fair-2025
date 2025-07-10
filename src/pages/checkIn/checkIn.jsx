import React, { useState } from 'react';
import BarcodeScanner from '../../components/barcodeScanner/barcodeScanner';
import './checkIn.scss';

export default function CheckIn() {
  const [barcode, setBarcode] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleScan = async (code) => {
    console.log('📤 Gửi API với mã:', code);
    setBarcode(code);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setBarcode(null);
    window.location.reload(); // Reload lại trang
  };

  return (
    <div className='check-in'>
      <h1 className='title'>Quét mã barcode để check-in</h1>
      <div>
        <BarcodeScanner onScanSuccess={handleScan} />
      </div>

      {showModal && (
        <div className='modal'>
          <div className='modal-content'>
            <h2>Mã quét được:</h2>
            <p>{barcode}</p>
            <button className='close-button' onClick={handleCloseModal}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
