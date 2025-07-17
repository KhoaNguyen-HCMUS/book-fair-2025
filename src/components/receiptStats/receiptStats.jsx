import React from 'react';
import './receiptStats.scss';

const ReceiptStatistics = ({ data }) => {
  const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN') + ' VNĐ';
  };

  return (
    <div className='statistics-container'>
      <table className='stats-table'>
        <thead>
          <tr>
            <th>Mã thành viên</th>
            <th>Tên thu ngân</th>
            <th>Số hóa đơn</th>
            <th>Tổng tiền</th>
            <th>Voucher</th>
            <th>Tiền mặt</th>
            <th>Chuyển khoản</th>
            <th>Ký gửi</th>
            <th>Quyên góp</th>
            <th>NXB</th>
            <th>Theo kg</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{data.id_member}</td>
            <td>{data.cashier_name}</td>
            <td>{data.totalReceipt}</td>
            <td>{formatCurrency(data.totalMoney)}</td>
            <td>{formatCurrency(data.totalVoucher)}</td>
            <td>{formatCurrency(data.totalCash)}</td>
            <td>{formatCurrency(data.totalBanking)}</td>
            <td>{formatCurrency(data.totalKG)}</td>
            <td>{formatCurrency(data.totalQG)}</td>
            <td>{formatCurrency(data.totalNXB)}</td>
            <td>{formatCurrency(data.totalTK)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ReceiptStatistics;
