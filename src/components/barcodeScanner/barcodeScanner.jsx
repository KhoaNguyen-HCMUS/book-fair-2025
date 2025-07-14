import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

export default function BarcodeScanner({ onScanSuccess, isEnabled = true }) {
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');

  useEffect(() => {
    const savedCamera = localStorage.getItem('selectedCamera');
    if (savedCamera) {
      setSelectedCamera(savedCamera); // Sử dụng camera đã lưu trong localStorage
    }
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    const initScanner = async () => {
      try {
        readerRef.current = new BrowserMultiFormatReader();

        await navigator.mediaDevices.getUserMedia({ video: true });

        const videoInputDevices = await readerRef.current.listVideoInputDevices();
        setCameras(videoInputDevices);

        if (videoInputDevices.length > 0) {
          const backCamera = videoInputDevices.find(
            (device) => device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('rear')
          );
          setSelectedCamera(backCamera?.deviceId || videoInputDevices[0].deviceId);
        }
      } catch (err) {
        console.error('Error initializing scanner:', err);
        setError('Không thể khởi tạo camera');
      }
    };

    initScanner();

    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
      }
    };
  }, [isEnabled]);

  useEffect(() => {
    if (!selectedCamera || !isEnabled) {
      if (readerRef.current) {
        readerRef.current.reset();
      }
      return;
    }

    const startScanning = async () => {
      try {
        setIsScanning(true);
        setError(null);

        await readerRef.current.decodeFromVideoDevice(selectedCamera, videoRef.current, (result, error) => {
          if (result) {
            console.log('✅ Barcode found:', result.getText());
            onScanSuccess?.(result.getText());
            readerRef.current.reset();
            startScanning();
          }
          if (error && !(error instanceof NotFoundException)) {
            console.warn('Scanner error:', error);
          }
        });
      } catch (err) {
        console.error('Error starting scan:', err);
        setError('Không thể bắt đầu quét mã');
        setIsScanning(false);
      }
    };

    startScanning();

    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
        setIsScanning(false);
      }
    };
  }, [selectedCamera, onScanSuccess, isEnabled]);

  const handleCameraChange = (deviceId) => {
    setSelectedCamera(deviceId);
    localStorage.setItem('selectedCamera', deviceId); // Lưu camera đã chọn vào localStorage
  };

  if (!isEnabled) {
    return <div className='scanner-disabled'>Scanner is disabled</div>;
  }

  return (
    <div className='zxing-scanner'>
      {cameras.length > 1 && (
        <div className='camera-selector'>
          <select value={selectedCamera} onChange={(e) => handleCameraChange(e.target.value)}>
            {cameras.map((camera) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label || `Camera ${camera.deviceId}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className='video-container'>
        <video
          ref={videoRef}
          style={{
            width: '100%',
            maxWidth: '400px',
            height: '300px',
            objectFit: 'cover',
            border: '2px solid #ddd',
            borderRadius: '8px',
          }}
          playsInline
          muted
        />

        <div className='scanning-overlay'>
          <div className='scanning-line' />
          <div className='corner-markers'>
            <div className='corner top-left' />
            <div className='corner top-right' />
            <div className='corner bottom-left' />
            <div className='corner bottom-right' />
          </div>
        </div>
      </div>

      {error && (
        <div className='error-message' style={{ color: 'red', marginTop: '10px' }}>
          {error}
        </div>
      )}

      {isScanning && (
        <div className='scanning-status' style={{ color: 'green', marginTop: '10px' }}>
          📱 Đang quét... Di chuyển camera gần mã barcode
        </div>
      )}
    </div>
  );
}
