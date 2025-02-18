import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { renderInput, renderSelect, formatCurrency, parseCurrency } from '../formComponents/formComponents.js';

export const FormConsignmentBook = () => {
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


  const [formData, setFormData] = useState({
    id: '',
    idConsignor: '',
    nameConsignor: '',
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
      id: '',
      idConsignor: tempNumber,
      nameConsignor: getNameConsignor(formData.idConsignor),
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
              ? 45
              : formData.typePrice === '65%'
              ? 65
              : Math.round(
                  (parseFloat(parseCurrency(formData.salePrice)) / parseFloat(parseCurrency(formData.originalPrice))) *
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

  const handleSearch = async () => {
    if (formData.idConsignor) {
      await getNameConsignor(formData.idConsignor);
    }
  };

  // Add handleKeyPress function
  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      await handleSearch();
    }
  };

  const getNameConsignor = async (numberPhone) => {
    try {
      const URL = `${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_API_GET_CONSIGNOR_BY_ID}${numberPhone}`;
      const response = await fetch(URL);
      const data = await response.json();

      if (data.success && data.data) {
        setFormData((prev) => ({
          ...prev,
          nameConsignor: data.data.name,
        }));
      } else {
        toast.error('Không tìm thấy thông tin người ký gửi');
        setFormData((prev) => ({
          ...prev,
          nameConsignor: '',
        }));
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Lỗi khi lấy thông tin người ký gửi');
      setFormData((prev) => ({
        ...prev,
        nameConsignor: '',
      }));
    }
  };

  return (
    <form className='form' onSubmit={handleSubmit}>
      <h2>Thêm Sách Ký Gửi</h2>
      {renderInput({
        label: 'ID Sách:',
        name: 'id',
        value: formData.id,
        onChange: handleChange,
      })}

      <div className='input-group'>
        {renderInput({
          label: 'ID Người Ký Gửi:',
          name: 'idConsignor',
          type: 'text',
          value: formData.idConsignor,
          onChange: handleChange,
          onKeyPress: handleKeyPress,
        })}
        <button type='button' className='search-button' onClick={handleSearch}>
          Tìm
        </button>
      </div>

      {renderInput({
        label: 'Tên Người Ký Gửi',
        name: 'nameConsignor',
        value: formData.nameConsignor,
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
