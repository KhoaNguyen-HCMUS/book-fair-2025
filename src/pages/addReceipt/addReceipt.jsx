import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { generateInvoicePDF } from '../../components/printReceipt/printReceipt.jsx';
import QRModal from '../../components/qrModal/qrModal.jsx';

import './addReceipt.scss';

function AddReceipt() {
  const [ReceiptItems, setReceiptItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const userId = localStorage.getItem('userID');

  const [discountAmount, setDiscountAmount] = useState(0);
  const [voucherCode, setVoucherCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showQRModal, setShowQRModal] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const [showQRInvoice, setShowQRInvoice] = useState(false);
  const [qrCodeLink, setQRCodeLink] = useState('');
  const [receiptId, setReceiptId] = useState('');

  const BANK_ID = '970418'; // BIDV
  const ACCOUNT_NO = '8680059374';

  const voucherOptions = [
    { value: '0', label: 'Không', discount: 0 },
    { value: '10000', label: '10,000', discount: 10000 },
    { value: '20000', label: '20,000', discount: 20000 },
    { value: '30000', label: '30,000', discount: 30000 },
  ];

  const generateQRCode = () => {
    const transferContent = `Payment ${userId}`;
    const amountToPay = totalPrice - discountAmount;
    return `https://api.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-ttfzC3g.jpg?&amount=${amountToPay}&addInfo=${encodeURIComponent(
      transferContent
    )}`;
  };

  const fetchBooks = async () => {
    try {
      const URL = import.meta.env.VITE_DOMAIN_BACKUP + '/api/get-object-list?typeOb=product';
      const response = await fetch(URL);
      const result = await response.json();
      if (result.success) {
        setBooks(result.data);
      }
    } catch {
      toast.error('Error fetching books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const newTotalPrice = ReceiptItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(newTotalPrice);
  }, [ReceiptItems]);

  const handleAddBook = (book) => {
    if (!book || book.stock <= 0) {
      toast.error('Sách không còn trong kho');
      return;
    }

    setReceiptItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id_product === book.id_product);
      if (existingItem) {
        if (existingItem.quantity < book.stock) {
          return prevItems.map((item) =>
            item.id_product === book.id_product ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          toast.error('Sách đã hết');
          return prevItems;
        }
      } else {
        return [...prevItems, { ...book, quantity: 1 }];
      }
    });
  };

  const handleIncreaseQuantity = (id_product) => {
    setReceiptItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id_product === id_product) {
          if (item.quantity < item.stock) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            toast.error('Sách đã hết!');
          }
        }
        return item;
      })
    );
  };

  const handleDecreaseQuantity = (id_product) => {
    setReceiptItems((prevItems) =>
      prevItems.reduce((acc, item) => {
        if (item.id_product === id_product) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
          // if quantity is 1, skipping the item removes it from ReceiptItems
        } else {
          acc.push(item);
        }
        return acc;
      }, [])
    );
  };

  // Remove the Receipt item completely
  const handleRemoveBook = (id_product) => {
    setReceiptItems((prevItems) => prevItems.filter((item) => item.id_product !== id_product));
  };

  const handleVoucherChange = (e) => {
    const selectedVoucher = e.target.value;
    const voucherOption = voucherOptions.find((option) => option.value === selectedVoucher);

    if (voucherOption) {
      if (voucherOption.discount > totalPrice) {
        toast.error('Mã giảm giá không được lớn hơn tổng hóa đơn!');
        return;
      }

      setVoucherCode(selectedVoucher);
      setDiscountAmount(voucherOption.discount);
    }
  };

  const handleResetReceipt = () => {
    setReceiptItems([]); // Clear Receipt items after successful submission
    setVoucherCode(''); // Clear voucher code
    setDiscountAmount(0); // Reset discount amount
    setPaymentMethod('bank'); // Reset payment method
    setShowQRModal(false);
    setPaymentConfirmed(false);
    fetchBooks(); // Refresh book list
  };

  const handleSubmitReceipt = async () => {
    if (isSubmitting) return;

    if (ReceiptItems.length === 0) {
      toast.error('Vui lòng thêm sách vào đơn hàng!');
      return;
    }

    if (paymentMethod === 'bank' && !showQRModal && !paymentConfirmed) {
      setShowQRModal(true);
      return;
    }

    await sendingReceipt();
  };

  const handlePrintReceipt = async (result) => {
    await generateInvoicePDF(result.receipt, result.orders);
  };

  const sendingReceipt = async () => {
    setIsSubmitting(true);

    const dataToSend = {
      typeOb: 'receipt',
      data: {
        receipt: {
          id_member: userId,
          method_payment: paymentMethod,
          voucher: voucherCode,
          total_amount: totalPrice,
        },
        order: ReceiptItems.map((book) => ({
          id_product: book.id_product,
          quantity: book.quantity,
          price: book.price,
          id_consignor: book.id_consignor,
          id_member: userId,
        })),
      },
    };
    try {
      const URL = import.meta.env.VITE_DOMAIN_BACKUP + import.meta.env.VITE_API_CREATE_OBJECT;

      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Đơn hàng đã được tạo thành công!');
        handleResetReceipt();
        setReceiptId(result.receipt.id_receipt);
        setQRCodeLink(`https://hoadon-hoisachmohoimo.vercel.app/hoa-don/${result.receipt.id_receipt}`);
        setShowQRInvoice(true);
        handlePrintReceipt(result);
      } else {
        handleSubmissionError(result);
      }
    } catch (error) {
      toast.error('Lỗi kết nối đến máy chủ');
      console.error('Error submitting Receipt:', error);
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  const handleConfirmPayment = async () => {
    setPaymentConfirmed(true);
    setShowQRModal(false);
    await sendingReceipt();
  };

  const handleCloseQRModal = () => {
    setShowQRModal(false);
    setPaymentConfirmed(false);
  };

  const handleSubmissionError = (result) => {
    if (result.message === 'Book unavailable') {
      toast.error('Sách không còn trong kho, vui lòng kiểm tra lại!');
      handleResetReceipt();
    } else if (result.message === 'Invalid voucher') {
      toast.error('Mã giảm giá không hợp lệ!');
    } else {
      toast.error('Xảy ra lỗi');
    }
    console.error('Xảy ra lỗi:', result.message);
  };

  // Filter books based on search term and stock availability
  const filteredBooks = books
    .filter(
      (book) =>
        (book.name && book.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (book.id_product && book.id_product.toString().includes(searchTerm))
    )
    .filter((book) => book.stock > 0);

  // Get current page of books
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);

  // Handle pagination
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredBooks.length / itemsPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const getAvailableVouchers = () => {
    return voucherOptions.filter((voucher) => voucher.discount <= totalPrice);
  };

  const inputRef = React.useRef();

  const handleInput = (e) => {
    let value = e.target.value;
    setCurrentPage(1);

    const trimmed = value.trim();
    setSearchTerm(value);

    if (/^\d{5,13}$/.test(trimmed)) {
      const book = books.find((b) => b.id_product.toString() === trimmed);
      if (book) {
        handleAddBook(book);
        setSearchTerm('');
        if (inputRef.current) inputRef.current.value = '';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = searchTerm.trim();
      if (/^\d{5,13}$/.test(value)) {
        const book = books.find((b) => b.id_product.toString() === value);
        if (book) {
          handleAddBook(book);
          setSearchTerm('');
          // toast.success(`Đã thêm: ${book.name}`);
          if (inputRef.current) inputRef.current.value = '';
        }
      }
    }
  };

  return (
    <div className='addReceipt'>
      <div className='container-wrapper'>
        {/* Left Container: Book Grid */}
        <div className='left-container'>
          <div className='search-bar'>
            <input
              ref={inputRef}
              type='text'
              placeholder='Quét mã hoặc nhập tên sách'
              value={searchTerm}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              autoComplete='off'
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
              >
                X
              </button>
            )}
          </div>
          <div className='book-list'>
            {loading ? (
              <h6>Loading books...</h6>
            ) : (
              <table className='book-table'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Stock</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBooks.map((book) => (
                    <tr key={book.id_product}>
                      <td>{book.id_product}</td>
                      <td>{book.name}</td>
                      <td>{book.stock}</td>
                      <td>
                        {book.price.toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        })}
                      </td>
                      <td>
                        <button onClick={() => handleAddBook(book)}>Thêm</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className='pagination'>
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
              Trang đầu
            </button>
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              Trước
            </button>
            <span>
              Trang {currentPage} / {Math.ceil(filteredBooks.length / itemsPerPage)}
            </span>
            <button onClick={handleNextPage} disabled={currentPage === Math.ceil(filteredBooks.length / itemsPerPage)}>
              Trang sau
            </button>
          </div>
        </div>

        <div className='right-container'>
          <div className='Receipt-summary'>
            <h4>Đơn hàng</h4>

            <div className='voucher-group'>
              <label htmlFor='voucher-select'>Mã giảm giá:</label>
              <select id='voucher-select' value={voucherCode} onChange={handleVoucherChange} className='voucher-select'>
                {getAvailableVouchers().map((voucher) => (
                  <option key={voucher.value} value={voucher.value}>
                    {voucher.label}
                  </option>
                ))}
              </select>
            </div>

            <div className='Receipt-items'>
              {ReceiptItems.map((item) => (
                <div key={item.id_product} className='Receipt-item'>
                  <div className='item-info'>
                    <div className='item-id'>ID: {item.id_product}</div>
                    <div className='item-name'>{item.name}</div>

                    <div className='item-price'>
                      {item.price.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </div>
                  </div>

                  <div className='quantity-controls'>
                    <button onClick={() => handleDecreaseQuantity(item.id_product)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleIncreaseQuantity(item.id_product)}>+</button>
                  </div>

                  <button className='remove-button' onClick={() => handleRemoveBook(item.id_product)}>
                    X
                  </button>
                </div>
              ))}

              {ReceiptItems.length === 0 && <h2>Chưa có sách nào được thêm vào đơn hàng</h2>}
            </div>

            <div className='Receipt-summary-footer'>
              <div className='total-row'>
                <span>Tạm tính:</span>
                <span>
                  {totalPrice.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </span>
              </div>

              <div className='total-row'>
                <span>Giảm giá:</span>
                <span>
                  {discountAmount.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </span>
              </div>

              <div className='total-row total-price'>
                <span>Tổng cộng:</span>
                <span>
                  {(totalPrice - discountAmount).toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </span>
              </div>

              <div className='payment-method'>
                <span>Phương thức thanh toán:</span>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <option value='' disabled>
                    Chọn phương thức
                  </option>
                  <option value='cash'>Tiền mặt</option>
                  <option value='bank'>Chuyển khoản</option>
                </select>
              </div>

              <div className='action-buttons'>
                <button className='btn-success' onClick={handleSubmitReceipt} disabled={isSubmitting}>
                  {isSubmitting ? 'Đang xử lý...' : 'Thanh toán'}
                </button>
                <button className='btn-danger' onClick={handleResetReceipt} disabled={isSubmitting}>
                  Xóa đơn hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <img src={generateQRCode()} alt='QR Code for payment' />
            <p>
              Số tiền:{' '}
              {(totalPrice - discountAmount).toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
              })}
            </p>
            <div className='btn-group'>
              <button className='btn-secondary' onClick={handleCloseQRModal}>
                Trở về
              </button>
              <button className='btn-success' onClick={handleConfirmPayment}>
                Đã chuyển khoản
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Invoice Modal */}
      {showQRInvoice && (
        <QRModal
          isOpen={showQRInvoice}
          onClose={() => setShowQRInvoice(false)}
          qrCodeLink={qrCodeLink}
          receiptId={receiptId}
        />
      )}
    </div>
  );
}

export default AddReceipt;
