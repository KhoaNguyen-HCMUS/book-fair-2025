import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { renderInput, renderSelect, formatCurrency, parseCurrency } from '../formComponents/formComponents.js';

export const FormPublisherBook = () => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    publisher: '',
    age: '',
    stock: 1,
    type: 'Sách NXB',
    originalPrice: '',
    typePrice: '',
    salePrice: '',
    refundPrice: '',
    status: true,
    validate: true,
    price: 0,
  });

  const handleReset = () => {
    const tempPublisher = formData.publisher;
    setFormData({
      id: '',
      id_publisher: '',
      name: '',
      publisher: tempPublisher,
      age: '',
      stock: 1,
      type: 'Sách NXB',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookData = {
        typeOb: 'product',
        data: {
          id_product: formData.id,
          id_member: localStorage.getItem('userID'),
          id_consignor: formData.id_publisher,
          name: formData.name,
          age: formData.age,
          genre: formData.category || 'Không xác định', // Add default value
          classify: formData.type,
          bc_cost: parseFloat(parseCurrency(formData.originalPrice)) || 0,
          discount: parseFloat(formData.typePrice) || 0,
          price: parseFloat(parseCurrency(formData.salePrice)) || 0,
          cash_back: parseFloat(parseCurrency(formData.refundPrice)) || 0,
          quantity: parseInt(formData.stock) || 1,
          validate: 0, // Set initial validate status
          sold: 0, // Set initial sold count
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
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError("Oops, we haven't got JSON!");
      }
      const result = await response.json();

      if (result.success) {
        toast.success('Thêm sách thành công');
        handleReset();
      } else {
        if (result.message === 'id_product already exists') {
          toast.error('ID sách đã tồn tại, vui lòng kiểm tra lại hoặc đổi ID khác');
        } else {
          toast.error('Lỗi khi thêm sách: ' + result.message);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Lỗi khi thêm sách');
    }
  };

  const CalculateSalePrice = (originalPrice, typePrice) => {
    const numericPrice = parseCurrency(originalPrice);

    return numericPrice - (numericPrice * typePrice) / 100;
  };

  const CalculateRefund = (salePrice, originalPrice) => {
    const numericSalePrice = parseFloat(parseCurrency(salePrice));
    const numericOriginalPrice = parseFloat(parseCurrency(originalPrice));

    if (isNaN(numericSalePrice) || isNaN(numericOriginalPrice)) return '';

    return Math.round(numericSalePrice - numericOriginalPrice * 0.05);
  };

  useEffect(() => {
    if (formData.originalPrice && formData.typePrice) {
      const salePrice = CalculateSalePrice(formData.originalPrice, formData.typePrice);
      const refundPrice = CalculateRefund(salePrice, formData.originalPrice);

      setFormData((prev) => ({
        ...prev,
        salePrice: salePrice.toString(),
        refundPrice: refundPrice.toString(),
      }));
    }
  }, [formData.typePrice, formData.originalPrice]);

  const handleSearch = async () => {
    if (formData.id_publisher) {
      await getNamePublisher(formData.id_publisher);
    }
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      await handleSearch();
    }
  };

  const getNamePublisher = async (numberPhone) => {
    try {
      const URL = `${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_API_GET_CONSIGNOR_BY_ID}${numberPhone}`;
      const response = await fetch(URL);
      const data = await response.json();

      if (data.success && data.data) {
        setFormData((prev) => ({
          ...prev,
          publisher: data.data.name,
        }));
      } else {
        toast.error('Không tìm thấy thông tin Nhà Xuất Bản');
        setFormData((prev) => ({
          ...prev,
          publisher: '',
        }));
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Lỗi khi lấy thông tin Nhà Xuất Bản');
      setFormData((prev) => ({
        ...prev,
        publisher: '',
      }));
    }
  };
  return (
    <form className='form' onSubmit={handleSubmit}>
      <h2>Thêm Sách Nhà Xuất Bản</h2>
      {renderInput({
        label: 'ID Sách:',
        name: 'id',
        value: formData.id,
        onChange: handleChange,
      })}

      <div className='input-group'>
        {renderInput({
          label: 'ID Nhà Xuất Bản:',
          name: 'id_publisher',
          type: 'text',
          value: formData.id_publisher,
          onChange: handleChange,
          onKeyPress: handleKeyPress,
        })}
        <button type='button' className='search-button' onClick={handleSearch}>
          Tìm
        </button>
      </div>
      {renderInput({
        label: 'Nhà Xuất Bản:',
        name: 'publisher',
        type: 'text',
        value: formData.publisher,
        disabled: true,
        onChange: handleChange,
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
        label: 'Giá Gốc:',
        name: 'originalPrice',
        type: 'text',
        value: formatCurrency(formData.originalPrice),

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
