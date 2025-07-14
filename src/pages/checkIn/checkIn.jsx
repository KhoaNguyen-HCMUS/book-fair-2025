import React, { useState, useCallback, useMemo } from 'react';
import BarcodeScanner from '../../components/barcodeScanner/barcodeScanner';
import './checkIn.scss';

const PROGRAMS = [
  { id: '1_KM', name: 'Lễ Khai Mạc' },
  { id: '2_LSVH', name: 'Talkshow Lịch Sử, Văn Hóa' },
  { id: '3_TV', name: 'Talkshow Tiếng Việt' },
  { id: '4_NT', name: 'Talkshow Nghệ Thuật' },
  { id: '5_DN', name: 'Đêm nhạc' },
];

const CHECK_IN_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  FAILURE: 'failure',
  ERROR: 'error',
};

// Custom hook for localStorage
const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? item : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setStoredValue = useCallback(
    (newValue) => {
      try {
        setValue(newValue);
        localStorage.setItem(key, newValue);
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  return [value, setStoredValue];
};

// Custom hook for API calls
const useCheckInAPI = () => {
  const [status, setStatus] = useState(CHECK_IN_STATUS.IDLE);
  const [errorMsg, setErrorMsg] = useState(null);

  const checkIn = useCallback(async (payload) => {
    setStatus(CHECK_IN_STATUS.LOADING);
    setErrorMsg(null);

    try {
      const URL = `${import.meta.env.VITE_DOMAIN}/api/check-in`;
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setStatus(CHECK_IN_STATUS.SUCCESS);
      } else {
        setStatus(CHECK_IN_STATUS.FAILURE);
        setErrorMsg(result.message || '');
      }
    } catch (error) {
      console.error('API Error:', error);
      setStatus(CHECK_IN_STATUS.ERROR);
      setErrorMsg(error.message || 'Đã xảy ra lỗi khi kết nối đến máy chủ');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus(CHECK_IN_STATUS.IDLE);
    setErrorMsg(null);
  }, []);

  return { status, errorMsg, checkIn, reset };
};

export default function CheckIn() {
  const [barcode, setBarcode] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useLocalStorage('selectedProgram', '');
  const { status, errorMsg, checkIn, reset } = useCheckInAPI();

  // Memoized values
  const selectedProgramName = useMemo(() => {
    return PROGRAMS.find((p) => p.id === selectedProgram)?.name || '';
  }, [selectedProgram]);

  const isScanning = status === CHECK_IN_STATUS.LOADING;

  const handleScan = useCallback(
    async (code) => {
      if (!selectedProgram) {
        alert('Vui lòng chọn chương trình trước khi quét mã!');
        return;
      }

      const idMember = localStorage.getItem('userID');
      if (!idMember) {
        alert('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!');
        return;
      }

      setBarcode(code);
      setShowModal(true);

      const payload = {
        attender_id: code,
        program_id: selectedProgram,
        id_member: idMember,
      };

      await checkIn(payload);
    },
    [selectedProgram, checkIn]
  );

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setBarcode(null);
    reset();
  }, [reset]);

  const handleProgramChange = useCallback(
    (event) => {
      setSelectedProgram(event.target.value);
    },
    [setSelectedProgram]
  );

  const renderStatusMessage = () => {
    switch (status) {
      case CHECK_IN_STATUS.LOADING:
        return <p style={{ fontWeight: 'bold', color: 'blue' }}>Đang xử lý check-in...</p>;
      case CHECK_IN_STATUS.SUCCESS:
        return <p style={{ fontWeight: 'bold', color: 'green' }}>Check-in thành công!</p>;
      case CHECK_IN_STATUS.FAILURE:
        return <p style={{ fontWeight: 'bold', color: 'red' }}>Check-in thất bại: {errorMsg}</p>;
      case CHECK_IN_STATUS.ERROR:
        return <p style={{ fontWeight: 'bold', color: 'orange' }}>Lỗi kết nối đến máy chủ</p>;
      default:
        return null;
    }
  };

  return (
    <div className='check-in'>
      <h1 className='title'>Quét mã barcode để check-in</h1>

      <div className='program-select'>
        <label htmlFor='program'>Chọn chương trình:</label>
        <select id='program' value={selectedProgram} onChange={handleProgramChange} disabled={isScanning}>
          <option value=''>-- Chọn chương trình --</option>
          {PROGRAMS.map((program) => (
            <option key={program.id} value={program.id}>
              {program.name}
            </option>
          ))}
        </select>
      </div>

      <div className='scanner-wrapper'>
        <BarcodeScanner onScanSuccess={handleScan} isEnabled={!!selectedProgram && !isScanning && !showModal} />
      </div>

      {showModal && (
        <div className='modal' onClick={handleCloseModal}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <h2>Kết quả quét mã</h2>
            <div className='scan-result'>
              <p>
                <strong>Mã quét được:</strong> {barcode}
              </p>
              <p>
                <strong>Chương trình:</strong> {selectedProgramName}
              </p>
              {renderStatusMessage()}
            </div>
            <button className='close-button' onClick={handleCloseModal} disabled={isScanning}>
              {isScanning ? 'Đang xử lý...' : 'Đóng'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
