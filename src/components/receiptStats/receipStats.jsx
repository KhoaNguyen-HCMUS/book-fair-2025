import React, { useMemo } from 'react';
import './receiptStats.scss';

function ReceiptStatistics({ receipts }) {
  const statistics = useMemo(() => {
    if (!receipts || receipts.length === 0) {
      return {
        totalReceipts: 0,
        bankTransferAmount: 0,
        cashAmount: 0,
        totalDiscount: 0,
        totalAmount: 0,
        finalAmount: 0,
        bankTransferCount: 0,
        cashCount: 0,
        cashierStats: {},
        totalCashiers: 0,
      };
    }

    const cashierStats = {};

    const stats = receipts.reduce(
      (acc, receipt) => {
        const amount = Math.floor(receipt.total_amount);
        const discount = Math.floor(receipt.voucher);
        const finalAmount = amount - discount;
        const cashierName = receipt.name_cashier || 'Chưa có tên';

        // Tổng thống kê chung
        acc.totalReceipts += 1;
        acc.totalAmount += amount;
        acc.totalDiscount += discount;
        acc.finalAmount += finalAmount;

        if (receipt.payment_method === 'bank') {
          acc.bankTransferAmount += finalAmount;
          acc.bankTransferCount += 1;
        } else {
          acc.cashAmount += finalAmount;
          acc.cashCount += 1;
        }

        // Thống kê theo thu ngân
        if (!cashierStats[cashierName]) {
          cashierStats[cashierName] = {
            name: cashierName,
            totalReceipts: 0,
            bankTransferAmount: 0,
            cashAmount: 0,
            totalDiscount: 0,
            totalRevenue: 0,
          };
        }

        cashierStats[cashierName].totalReceipts += 1;
        cashierStats[cashierName].totalDiscount += discount;
        cashierStats[cashierName].totalRevenue += finalAmount;

        if (receipt.payment_method === 'bank') {
          cashierStats[cashierName].bankTransferAmount += finalAmount;
        } else {
          cashierStats[cashierName].cashAmount += finalAmount;
        }

        return acc;
      },
      {
        totalReceipts: 0,
        bankTransferAmount: 0,
        cashAmount: 0,
        totalDiscount: 0,
        totalAmount: 0,
        finalAmount: 0,
        bankTransferCount: 0,
        cashCount: 0,
      }
    );

    stats.cashierStats = cashierStats;
    stats.totalCashiers = Object.keys(cashierStats).length;

    return stats;
  }, [receipts]);

  const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN') + ' VNĐ';
  };

  return (
    <div className='statistics-container'>
      {/* Thống kê tổng quan */}
      <div className='stats-row'>
        <div className='stat-item'>
          <span className='stat-label'>Tổng hóa đơn:</span>
          <span className='stat-value'>{statistics.totalReceipts}</span>
        </div>

        <div className='stat-item'>
          <span className='stat-label'>Số thu ngân:</span>
          <span className='stat-value'>{statistics.totalCashiers}</span>
        </div>

        <div className='stat-item'>
          <span className='stat-label'>Chuyển khoản:</span>
          <span className='stat-value'>{formatCurrency(statistics.bankTransferAmount)}</span>
        </div>

        <div className='stat-item'>
          <span className='stat-label'>Tiền mặt:</span>
          <span className='stat-value'>{formatCurrency(statistics.cashAmount)}</span>
        </div>

        <div className='stat-item'>
          <span className='stat-label'>Tổng giảm giá:</span>
          <span className='stat-value discount'>{formatCurrency(statistics.totalDiscount)}</span>
        </div>

        <div className='stat-item total'>
          <span className='stat-label'>Tổng doanh thu:</span>
          <span className='stat-value'>{formatCurrency(statistics.finalAmount)}</span>
        </div>
      </div>

      {/* Thống kê từng thu ngân */}
      {statistics.totalCashiers > 0 && (
        <div className='cashier-stats'>
          <h4 className='cashier-title'>📊 Thống kê theo thu ngân</h4>
          <div className='cashier-table'>
            <table>
              <thead>
                <tr>
                  <th>Tên thu ngân</th>
                  <th>Số hóa đơn</th>
                  <th>Chuyển khoản</th>
                  <th>Tiền mặt</th>
                  <th>Giảm giá</th>
                  <th>Tổng doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(statistics.cashierStats)
                  .sort((a, b) => b.totalRevenue - a.totalRevenue)
                  .map((cashier, index) => (
                    <tr key={cashier.name} className={index < 3 ? 'top-performer' : ''}>
                      <td className='cashier-name'>{cashier.name}</td>
                      <td className='receipt-count'>{cashier.totalReceipts}</td>
                      <td className='bank-amount'>{formatCurrency(cashier.bankTransferAmount)}</td>
                      <td className='cash-amount'>{formatCurrency(cashier.cashAmount)}</td>
                      <td className='discount-amount'>{formatCurrency(cashier.totalDiscount)}</td>
                      <td className='total-revenue'>
                        <strong>{formatCurrency(cashier.totalRevenue)}</strong>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReceiptStatistics;
