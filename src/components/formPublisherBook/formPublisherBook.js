import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { renderInput, renderSelect, formatCurrency, parseCurrency } from '../formComponents/formComponents.js';

export const FormPublisherBook = () => {
  const idBookGen = (prefix) => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}-${timestamp}-${random}`;
  };

  const [formData, setFormData] = useState({
    id: idBookGen('NXB'),
    name: '',
    publisher: '',
    age: '',
    stock: 1,
    originalPrice: '',
    typePrice: '',
    salePrice: '',
    refundPrice: '',
    status: true,
    validate: true,
    price: 0,
  });

  const handleReset = () => {
    setFormData({
      id: idBookGen('NXB'),
      name: '',
      publisher: '',
      age: '',
      stock: 1,
      originalPrice: '',
      typePrice: '',
      salePrice: '',
      refundPrice: '',
      status: true,
      validate: true,
      price: 0,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Book Data:', formData);
    // Add API call here
    toast.success('Thêm sách thành công');
    handleReset();
  };

  const CalculatePrice = (originalPrice, typePrice) => {
    const numericPrice = parseCurrency(originalPrice);

    return numericPrice - (numericPrice * typePrice) / 100;
  };

  const CalculateRefund = (salePrice) => {
    return salePrice * 0.95;
  };

  useEffect(() => {
    if (formData.originalPrice && formData.typePrice) {
      const salePrice = CalculatePrice(formData.originalPrice, formData.typePrice);
      const refundPrice = CalculateRefund(salePrice);

      setFormData((prev) => ({
        ...prev,
        salePrice: salePrice.toString(),
        refundPrice: refundPrice.toString(),
      }));
    }
  }, [formData.typePrice, formData.originalPrice]);

  return (
    <form className='form' onSubmit={handleSubmit}>
      <h2>Thêm Sách Nhà Xuất Bản</h2>
      {renderInput({
        label: 'ID Sách:',
        name: 'id',
        value: formData.id,
        disabled: true,
      })}
      {renderInput({
        label: 'Tên Sách:',
        name: 'name',
        type: 'text',
        value: formData.name,
        onChange: handleChange,
      })}

      {renderSelect({
        label: 'Độ Tuổi:',
        name: 'age',
        value: formData.age,
        onChange: handleChange,
        options: ['Không giới hạn', '16+', '18+'],
      })}

      {renderInput({
        label: 'Nhà Xuất Bản:',
        name: 'publisher',
        type: 'text',
        value: formData.publisher,
        onChange: handleChange,
      })}

      {renderInput({
        label: 'Giá Gốc:',
        name: 'originalPrice',
        type: 'text',
        value: formatCurrency(formData.originalPrice),
        note: 'Khi cần chỉnh sửa, xóa tất cả hoặc bấm nút Reset (↺) để xóa nhập lại',

        onChange: handleChange,
        onReset: () => setFormData((prev) => ({ ...prev, originalPrice: '' })),
      })}

      {renderInput({
        label: 'Chiết khấu (%):',
        name: 'typePrice',
        type: 'text',
        value: formData.typePrice,
        onChange: handleChange,
      })}
      {renderInput({
        label: 'Giá Bán:',
        name: 'salePrice',
        type: 'text',
        value: formatCurrency(formData.salePrice),
        disabled: true,
      })}
      {renderInput({
        label: 'Giá Hoàn Tiền:',
        name: 'refundPrice',
        type: 'text',
        value: formatCurrency(formData.refundPrice),
        disabled: true,
      })}
      {renderInput({
        label: 'Số Lượng:',
        name: 'stock',
        type: 'number',
        value: formData.stock,
        onChange: handleChange,
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

export default FormPublisherBook;
