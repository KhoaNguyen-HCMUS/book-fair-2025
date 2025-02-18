import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { renderInput, renderSelect, formatCurrency, parseCurrency } from '../formComponents/formComponents.js';

export const FormConsignmentBook = () => {
  const idBookGen = (prefix) => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}-${timestamp}-${random}`;
  };

  const CalculatePrice = (originalPrice, typePrice) => {
    const price = parseFloat(parseCurrency(originalPrice));
    if (isNaN(price)) return '';

    switch (typePrice) {
      case '45%':
        return Math.round(price * 0.45);
      case '65%':
        return Math.round(price * 0.65);
      default:
        return price;
    }
  };

  const CalculateRefund = (salePrice, originalPrice) => {
    // Parse both prices to numbers
    const numericSalePrice = parseFloat(parseCurrency(salePrice));
    const numericOriginalPrice = parseFloat(parseCurrency(originalPrice));

    if (isNaN(numericSalePrice) || isNaN(numericOriginalPrice)) return '';

    // Calculate refund: sale price minus 5% of original price
    return Math.round(numericSalePrice - numericOriginalPrice * 0.05);
  };

  const timeGen = () => {
    const date = new Date();
    return date.toISOString();
  };

  const getNameConsignor = (numberPhone) => {
    // Add API call here
    return 'Nguyễn Văn A' + numberPhone;
  };

  const [formData, setFormData] = useState({
    id: idBookGen('BK'),
    idConsignor: '',
    nameConsignor: '',
    time: timeGen(),
    name: '',
    publisher: '',
    author: '',
    age: '',
    category: '',
    type: '',
    originalPrice: '',
    typePrice: '',
    salePrice: '',
    refundPrice: '',
    sold: 0,
    validate: false,
    stock: 1,
  });

  const handleReset = () => {
    const tempNumber = formData.idConsignor;
    setFormData({
      id: idBookGen('BK'),
      idConsignor: tempNumber,
      nameConsignor: getNameConsignor(formData.idConsignor),
      time: timeGen(),
      name: '',
      publisher: '',
      author: '',
      age: '',
      category: '',
      type: '',
      originalPrice: '',
      typePrice: '',
      salePrice: '',
      refundPrice: '',
      sold: 0,
      validate: false,
      stock: 1,
    });
  };

  const handleSalePrice = (value, typePrice, originalPrice) => {
    // For special books - allow manual input
    if (typePrice === 'Sách đặc biệt') {
      const numericValue = parseCurrency(value);
      return {
        salePrice: numericValue,
        refundPrice: CalculateRefund(numericValue).toString(),
      };
    }

    // For percentage-based prices (45% and 65%)
    const calculatedPrice = CalculatePrice(originalPrice, typePrice);
    return {
      salePrice: calculatedPrice.toString(),
      refundPrice: CalculateRefund(calculatedPrice).toString(),
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'typePrice') {
      const prices = handleSalePrice(value, value, formData.originalPrice);
      setFormData((prev) => ({
        ...prev,
        typePrice: value,
        ...prices,
      }));
    } else if (name === 'salePrice' && formData.typePrice === 'Sách đặc biệt') {
      const prices = handleSalePrice(value, formData.typePrice, formData.originalPrice);
      setFormData((prev) => ({
        ...prev,
        ...prices,
      }));
    } else if (name === 'originalPrice') {
      const numericValue = parseCurrency(value);
      const prices = handleSalePrice(value, formData.typePrice, numericValue);
      setFormData((prev) => ({
        ...prev,
        originalPrice: numericValue,
        ...prices,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    console.log(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Book Data:', formData);
    try {
      const bookData = {
        typeOb: 'product',
        data: {
          id_product: formData.id,
          id_member: localStorage.getItem('userID'), // Assuming you store userID in localStorage
          id_consignor: formData.idConsignor,
          name: formData.name,
          age: formData.age,
          genre: formData.category,
          classify: formData.type,
          bc_cost: parseFloat(parseCurrency(formData.originalPrice)),
          discount:
            formData.typePrice === '45%'
              ? 55
              : formData.typePrice === '65%'
              ? 35
              : Math.round(
                  (1 -
                    parseFloat(parseCurrency(formData.salePrice)) / parseFloat(parseCurrency(formData.originalPrice))) *
                    100
                ),
          price: parseFloat(parseCurrency(formData.salePrice)),
          cash_back: parseFloat(parseCurrency(formData.refundPrice)),
          quantity: 1,
        },
      };
      const URL = process.env.REACT_APP_DOMAIN + process.env.REACT_APP_API_CREATE_OBJECT;
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Thêm sách thành công');
        handleReset();
      } else {
        toast.error('Lỗi khi thêm sách: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Lỗi khi thêm sách');
    }
    handleReset();
  };

  useEffect(() => {
    if (formData.originalPrice && formData.typePrice) {
      const salePrice = CalculatePrice(formData.originalPrice, formData.typePrice);

      // Only calculate refund if we have a valid sale price
      if (salePrice) {
        const refundPrice = CalculateRefund(salePrice, formData.originalPrice);

        setFormData((prev) => ({
          ...prev,
          salePrice: salePrice.toString(),
          refundPrice: refundPrice.toString(),
        }));
      }
    }
  }, [formData.typePrice, formData.originalPrice]);

  useEffect(() => {
    if (formData.idConsignor) {
      setFormData((prev) => ({
        ...prev,
        nameConsignor: getNameConsignor(formData.idConsignor),
      }));
    }
  }, [formData.idConsignor]);

  return (
    <form className='form' onSubmit={handleSubmit}>
      <h2>Thêm Sách Ký Gửi</h2>
      {renderInput({
        label: 'ID Sách:',
        name: 'id',
        value: formData.id,
        disabled: true,
      })}

      {renderInput({
        label: 'ID Người Ký Gửi:',
        name: 'idConsignor',
        type: 'text',
        value: formData.idConsignor,
        onChange: handleChange,
      })}

      {renderInput({
        label: 'Tên Người Ký Gửi',
        name: 'nameConsignor',
        value: formData.nameConsignor, // Changed from getNameConsignor(formData.idConsignor)
        disabled: true,
        onChange: handleChange,
      })}

      {renderInput({
        label: 'Tên Sách:',
        name: 'name',
        type: 'text',
        value: formData.title,
        onChange: handleChange,
      })}

      {renderInput({
        label: 'Thời Gian:',
        name: 'time',
        type: 'text',
        value: formData.time,
        disabled: true,
        onChange: handleChange,
      })}

      {renderInput({
        label: 'Tên Tác Giả:',
        name: 'author',
        type: 'text',
        value: formData.author,
        onChange: handleChange,
      })}

      {renderInput({
        label: 'Nhà Xuất Bản:',
        name: 'publisher',
        type: 'text',
        value: formData.publisher,
        onChange: handleChange,
      })}

      {renderSelect({
        label: 'Thể Loại:',
        name: 'category',
        value: formData.category,
        onChange: handleChange,
        options: [
          'Khoa học xã hội & Nhân văn',
          'Khoa học tự nhiên & Công nghệ',
          'Sách giáo dục & trường học',
          'Văn học Việt Nam',
          'Văn học Nước ngoài ',
          'Văn học Nước ngoài biên phiên dịch',
          'Truyện tranh',
          'Khác',
        ],
      })}

      {renderSelect({
        label: 'Độ Tuổi:',
        name: 'age',
        value: formData.age,
        onChange: handleChange,
        options: ['Không giới hạn', '16+', '18+'],
      })}

      {renderSelect({
        label: 'Phân Loại Sách:',
        name: 'type',
        value: formData.type,
        onChange: handleChange,
        options: ['Sách Ký Gửi', 'Sách Quyên Góp'],
      })}

      {renderInput({
        label: 'Giá Bìa:',
        name: 'originalPrice',
        type: 'text',
        value: formatCurrency(formData.originalPrice),
        onChange: handleChange,
        onReset: () => {
          setFormData((prev) => ({
            ...prev,
            originalPrice: '',
            salePrice: '',
            refundPrice: '',
          }));
        },
        note: 'Khi cần chỉnh sửa, xóa tất cả hoặc bấm nút Reset (↺) để xóa nhập lại',
      })}

      {renderSelect({
        label: 'Loại Giá Bán:',
        name: 'typePrice',
        value: formData.typePrice,
        onChange: handleChange,
        options: ['45%', '65%', 'Sách đặc biệt'],
      })}

      {renderInput({
        label: 'Giá Bán:',
        name: 'salePrice',
        type: 'text',
        value: formatCurrency(formData.salePrice),
        onChange: handleChange,
        disabled: formData.typePrice !== 'Sách đặc biệt',
        note:
          formData.typePrice === 'Sách đặc biệt'
            ? '* Sách đặc biệt, vui lòng nhập giá bán.'
            : '* Giá được tính tự động theo %',
        onReset:
          formData.typePrice === 'Sách đặc biệt'
            ? () => {
                setFormData((prev) => ({
                  ...prev,
                  salePrice: '',
                  refundPrice: '',
                }));
              }
            : undefined,
      })}

      {renderInput({
        label: 'Số Tiền Giải Ngân:',
        name: 'refundPrice',
        type: 'text',
        value: formatCurrency(CalculateRefund(parseCurrency(formData.salePrice), formData.originalPrice)),
        onChange: handleChange,
        disabled: true,
      })}

      <div className='button-group'>
        <button type='submit'>Thêm Sách</button>
        <button type='button' onClick={handleReset}>
          Reset
        </button>
      </div>
    </form>
  );
};
