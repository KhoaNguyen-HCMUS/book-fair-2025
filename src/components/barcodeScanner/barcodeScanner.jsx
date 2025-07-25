import BarcodeScanner from 'react-qr-barcode-scanner';

export default function BarcodeScannerComponent({ onScanSuccess, width = 500, height = 500 }) {
  const handleUpdate = (err, result) => {
    if (result) {
      if (onScanSuccess) {
        onScanSuccess(result.text); // Gọi callback khi quét thành công
      }
    } else {
      console.log('No result found');
    }
  };

  return (
    <>
      <BarcodeScanner
        width={width}
        height={height}
        onUpdate={handleUpdate} // Xử lý kết quả quét
      />
      <p>Đang quét</p>
    </>
  );
}
