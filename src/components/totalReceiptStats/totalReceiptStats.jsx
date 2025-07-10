import React from 'react';
import './totalReceiptStats.scss';

const TotalReceiptStats = ({ data }) => {
  const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN');
  };

  const calculateTotals = (data) => {
    return data.reduce(
      (totals, item) => {
        totals.totalMoney += item.totalMoney;
        totals.totalReceipt += item.totalReceipt;
        totals.totalVoucher += item.totalVoucher;
        totals.totalCash += item.totalCash;
        totals.totalBanking += item.totalBanking;
        totals.totalKG += item.totalKG;
        totals.totalQG += item.totalQG;
        totals.totalTK += item.totalTK;
        return totals;
      },
      {
        totalMoney: 0,
        totalReceipt: 0,
        totalVoucher: 0,
        totalCash: 0,
        totalBanking: 0,
        totalKG: 0,
        totalQG: 0,
        totalTK: 0,
      }
    );
  };

  const totals = calculateTotals(data);

  return (
    <div className='total-receipt-stats'>
      <h1 className='title'>Thống kê hóa đơn</h1>
      <table className='stats-table'>
        <thead>
          <tr>
            <th>Mã thành viên</th>
            <th>Tên</th>
            <th>Tổng tiền</th>
            <th>Số hóa đơn</th>
            <th>Voucher</th>
            <th>Tiền mặt</th>
            <th>Chuyển khoản</th>
            <th>Ký gửi</th>
            <th>Quyên góp</th>
            <th>Theo kg</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id_member}>
              <td>{item.id_member}</td>
              <td>{item.name}</td>
              <td>{formatCurrency(item.totalMoney) || 0} </td>
              <td>{item.totalReceipt || 0}</td>
              <td>{formatCurrency(item.totalVoucher) || 0}</td>
              <td>{formatCurrency(item.totalCash) || 0}</td>
              <td>{formatCurrency(item.totalBanking) || 0}</td>
              <td>{formatCurrency(item.totalKG) || 0}</td>
              <td>{formatCurrency(item.totalQG) || 0}</td>
              <td>{formatCurrency(item.totalTK) || 0}</td>
            </tr>
          ))}
          <tr className='totals-row'>
            <td>Tổng cộng</td>
            <td> </td>
            <td>{formatCurrency(totals.totalMoney) || 0}</td>
            <td>{totals.totalReceipt || 0}</td>
            <td>{formatCurrency(totals.totalVoucher) || 0}</td>
            <td>{formatCurrency(totals.totalCash) || 0}</td>
            <td>{formatCurrency(totals.totalBanking) || 0}</td>
            <td>{formatCurrency(totals.totalKG) || 0}</td>
            <td>{formatCurrency(totals.totalQG) || 0}</td>
            <td>{formatCurrency(totals.totalTK) || 0}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TotalReceiptStats;
