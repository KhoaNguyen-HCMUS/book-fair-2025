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
      };
    }

    const stats = receipts.reduce(
      (acc, receipt) => {
        const amount = Math.floor(receipt.total_amount);
        const discount = Math.floor(receipt.voucher);
        const finalAmount = amount - discount;

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

    return stats;
  }, [receipts]);

  const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN') + ' VNĐ';
  };

  return (
    <div className='stats-row'>
      <div className='stat-item'>
        <span className='stat-label'>Tổng hóa đơn:</span>
        <span className='stat-value'>{statistics.totalReceipts}</span>
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
  );
}

export default ReceiptStatistics;
