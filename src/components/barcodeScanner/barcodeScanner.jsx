import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

export default function BarcodeScanner({ onScanSuccess, onScanError }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('barcode-scanner', {
      fps: 10,
      qrbox: { width: 300, height: 200 },
    });

    scanner.render(
      (decodedText) => {
        console.log('✅ Barcode found:', decodedText);
        if (onScanSuccess) {
          onScanSuccess(decodedText);
        }
      },
      (errorMessage) => {
        console.warn('⚠️ Lỗi quét:', errorMessage);
        if (onScanError) {
          onScanError(errorMessage);
        }
      }
    );

    return () =>
      scanner.clear().catch((error) => {
        console.error('❌ Lỗi khi clear scanner:', error);
      });
  }, [onScanSuccess, onScanError]);

  return <div id='barcode-scanner' style={{ width: '100%' }} />;
}
