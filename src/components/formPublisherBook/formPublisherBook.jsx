import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { renderInput, renderSelect, formatCurrency, parseCurrency } from '../formComponents/formComponents.jsx';
import './formPublisherBook.scss';
export const FormPublisherBook = () => {
  const [formData, setFormData] = useState({
    id: '',
    id_publisher: '',
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
    const tempIdPublisher = formData.id_publisher;
    setFormData({
      id: '',
      id_publisher: tempIdPublisher,
      name: '',
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

    if (name === 'typePrice') {
      // Convert to number and validate range
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        const clampedValue = Math.min(Math.max(numValue, 1), 99);
        setFormData((prev) => ({
          ...prev,
          [name]: clampedValue.toString(),
        }));
      } else if (value === '') {
        // Allow empty input for better UX
        setFormData((prev) => ({
          ...prev,
          [name]: '',
        }));
      }
    } else {
      // Handle other fields normally
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const removeNonNumeric = (value) => {
    return value.replace(/[^0-9]/g, '');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id_publisher || !formData.publisher) {
      toast.error('Vui lòng nhập ID Nhà Xuất Bản và bấm tìm kiếm');
      return;
    }
    if (formData.stock < 1) {
      toast.error('Số lượng sách phải lớn hơn 0');
      return;
    }
    try {
      const bookData = {
        typeOb: 'product',
        id_member: localStorage.getItem('userID'), // Assuming you store userID in localStorage

        data: {
          id_product: formData.id,
          id_member: localStorage.getItem('userID'),
          id_consignor: removeNonNumeric(formData.id_publisher),
          name: formData.name,
          age: formData.age,
          genre: formData.category || 'Không xác định', // Add default value
          classify: formData.type,
          bc_cost: parseFloat(parseCurrency(formData.originalPrice)) || 0,
          discount: parseFloat(formData.typePrice) - 5 || 0,
          price: parseFloat(parseCurrency(formData.salePrice)) || 0,
          cash_back: parseFloat(parseCurrency(formData.refundPrice)) || 0,
          quantity: parseInt(formData.stock) || 1,
          validate: 0, // Set initial validate status
          sold: 0, // Set initial sold count
        },
      };

      const URL = import.meta.env.VITE_DOMAIN + import.meta.env.VITE_API_CREATE_OBJECT;
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
    } catch {
      toast.error('Lỗi khi thêm sách');
    }
  };

  const CalculateSalePrice = (originalPrice, typePrice) => {
    const numericPrice = parseCurrency(originalPrice);
    const numericTypePrice = parseFloat(typePrice);

    if (isNaN(numericPrice) || isNaN(numericTypePrice) || numericPrice <= 0 || numericTypePrice <= 0) {
      return 0;
    }

    try {
      // Calculate base price with discount
      const discountAmount = numericPrice * (numericTypePrice / 100);
      const basePrice = numericPrice - discountAmount;

      // Add 5% markup
      const markupAmount = numericPrice * 0.05;
      const finalPrice = basePrice + markupAmount;

      // Round to nearest 1000 VND
      return Math.round(finalPrice);
    } catch (error) {
      console.error('Lỗi khi tính toán giá bán', error);
      return 0;
    }
  };

  const CalculateRefund = (salePrice, originalPrice) => {
    const numericSalePrice = parseCurrency(salePrice);
    const numericOriginalPrice = parseCurrency(originalPrice);

    if (isNaN(numericSalePrice) || isNaN(numericOriginalPrice) || numericSalePrice <= 0 || numericOriginalPrice <= 0) {
      return 0;
    }

    try {
      // Calculate publisher's share (5% of original price)
      const publisherShare = numericOriginalPrice * 0.05;

      // Refund is sale price minus publisher's share
      const refundAmount = numericSalePrice - publisherShare;

      // Round to nearest 1000 VND
      return Math.round(refundAmount);
    } catch (error) {
      console.error('Lỗi khi tính toán hoàn tiền', error);
      return 0;
    }
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
      const URL = `${import.meta.env.VITE_DOMAIN}${import.meta.env.VITE_API_GET_CONSIGNOR_BY_ID}${numberPhone}`;
      const response = await fetch(URL);
      const data = await response.json();

      if (data.success && data.data) {
        if (data.data.id_member !== localStorage.getItem('userID')) {
          toast.error('Người ký gửi không thuộc quyền sở hữu của bạn');
          setFormData((prev) => ({
            ...prev,
            publisher: '',
            id_publisher: '',
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            publisher: data.data.name,
          }));
        }
      } else {
        toast.error('Không tìm thấy thông tin Nhà Xuất Bản');
        setFormData((prev) => ({
          ...prev,
          publisher: '',
        }));
      }
    } catch {
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
      <div className='form-content'>
        <div className='input-group'>
          {renderInput({
            label: 'ID Nhà Xuất Bản:',
            name: 'id_publisher',
            type: 'text',
            value: formData.id_publisher,
            onChange: handleChange,
            onKeyPress: handleKeyPress,
            removeSpace: true,
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
          label: 'ID Sách:',
          name: 'id',
          value: formData.id,
          onChange: handleChange,
          removeSpace: true,
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
        })}

        {renderInput({
          label: 'Chiết khấu (%):',
          name: 'typePrice',
          type: 'number',
          min: '1',
          max: '99',
          step: '1',
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
          min: '1',
          step: '1',
        })}
      </div>

      <div className='button-group'>
        <button type='submit'>Thêm Sách</button>
        <button type='button' onClick={handleReset}>
          Làm mới
        </button>
      </div>
    </form>
  );
};

export default FormPublisherBook;
