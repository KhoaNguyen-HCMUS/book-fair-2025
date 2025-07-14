import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function BarcodeScanner({ onScanSuccess }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('scanner', {
      fps: 10,
      qrbox: { width: 300, height: 200 },
    });

    scanner.render((text) => {
      console.log('✅ Found:', text);
      if (onScanSuccess) {
        onScanSuccess(text);
      }
      scanner.clear();
    });

    return () => scanner.clear();
  }, [onScanSuccess]);

  return (
    <div>
      <div id='scanner' style={{ width: '100%', maxWidth: '400px', height: '300px', margin: 'auto' }} />
    </div>
  );
}
