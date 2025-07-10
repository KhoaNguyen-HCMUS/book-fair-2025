import React, { useState } from 'react';
import BarcodeScanner from '../../components/BarcodeScanner/BarcodeScanner';
import './checkIn.scss';

export default function CheckIn() {
  const [barcode, setBarcode] = useState(null);
  const [error, setError] = useState(null);

  const handleScanSuccess = (decodedText) => {
    setBarcode(decodedText);
    setError(null);
  };

  const handleScanError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <div className='check-in'>
      <h1 className='title'>Quét mã barcode để check-in</h1>
      <div className='scanner-container'>
        <BarcodeScanner onScanSuccess={handleScanSuccess} onScanError={handleScanError} />
      </div>
      {barcode && (
        <div className='result'>
          <h2>Mã barcode quét được:</h2>
          <p>{barcode}</p>
        </div>
      )}
      {error && (
        <div className='error'>
          <h2>Lỗi khi quét:</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
