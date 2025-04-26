import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { renderInput, renderSelect, formatCurrency, parseCurrency } from '../formComponents/formComponents.jsx';

import './formConsignmentBook.scss';

export const FormConsignmentBook = () => {
  const CalculatePrice = (originalPrice, typePrice) => {
    const price = parseFloat(parseCurrency(originalPrice));
    if (isNaN(price)) return '';

    switch (typePrice) {
      case '45%':
        return Math.round(price * 0.45);
      case '65%':
        return Math.round(price * 0.65);
      case 'Sách đặc biệt':
        return 0;
      default:
        return price;
    }
  };

  const CalculateRefund = (salePrice, originalPrice) => {
    // Parse both prices to numbers
    const numericSalePrice = parseFloat(parseCurrency(salePrice));
    const numericOriginalPrice = parseFloat(parseCurrency(originalPrice));
    if (salePrice === '0' || isNaN(numericSalePrice) || isNaN(numericOriginalPrice)) return '0';

    // Calculate refund: sale price minus 5% of original price
    return Math.round(numericSalePrice - numericOriginalPrice * 0.05);
  };

  const [formData, setFormData] = useState({
    id: '',
    idConsignor: '',
    nameConsignor: '',
    name: '',
    publisher: '',
    author: 'N/A',
    age: '',
    category: '',
    type: 'Sách Ký Gửi',
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
      name: ' ',
      publisher: '',
      author: 'N/A',
      age: '',
      category: '',
      type: 'Sách Ký Gửi',
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
    // For special books - set values to 0
    if (typePrice === 'Sách đặc biệt') {
      return {
        originalPrice: '0',
        salePrice: '0',
        refundPrice: '0',
        discount: 100,
      };
    }

    // For percentage-based prices (45% and 65%)
    const calculatedPrice = CalculatePrice(originalPrice, typePrice);
    return {
      salePrice: calculatedPrice.toString(),
      refundPrice: CalculateRefund(calculatedPrice, originalPrice).toString(),
      discount: typePrice === '45%' ? 55 : 35,
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
        originalPrice: value === 'Sách đặc biệt' ? '0' : prev.originalPrice,
      }));
    } else if (name === 'originalPrice' && formData.typePrice === 'Sách đặc biệt') {
      return;
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nameConsignor) {
      toast.error('Vui lòng nhập số điện thoại người ký gửi và bấm tìm');
      return;
    }
    try {
      const bookData = {
        typeOb: 'product',
        id_member: localStorage.getItem('userID'), // Assuming you store userID in localStorage
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
              : formData.typePrice === 'Sách đặc biệt'
              ? 100
              : 0,
          price: parseFloat(parseCurrency(formData.salePrice)),
          cash_back: parseFloat(parseCurrency(formData.refundPrice)),
          quantity: 1,
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
      const URL = `${import.meta.env.VITE_DOMAIN}${import.meta.env.VITE_API_GET_CONSIGNOR_BY_ID}${numberPhone}`;
      const response = await fetch(URL);
      const data = await response.json();

      if (data.success && data.data) {
        if (data.data.id_member !== localStorage.getItem('userID')) {
          toast.error('Người ký gửi không thuộc quyền sở hữu của bạn');
          setFormData((prev) => ({
            ...prev,
            nameConsignor: '',
            idConsignor: '',
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            nameConsignor: data.data.name,
          }));
        }
      } else {
        toast.error('Không tìm thấy thông tin người ký gửi');
        setFormData((prev) => ({
          ...prev,
          nameConsignor: '',
        }));
      }
    } catch {
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
      <div className='form-content'>
        <div className='input-group'>
          {renderInput({
            label: 'Số Điện Thoại Người Ký Gửi:',
            name: 'idConsignor',
            type: 'text',
            value: formData.idConsignor,
            onChange: handleChange,
            onKeyPress: handleKeyPress,
            removeSpace: true,
          })}
          <button type='button' className='search-button' onClick={handleSearch}>
            Tìm
          </button>
        </div>

        {renderInput({
          label: 'Tên Người Ký Gửi:',
          name: 'nameConsignor',
          value: formData.nameConsignor,
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
          label: 'Thể Loại:',
          name: 'category',
          value: formData.category,
          onChange: handleChange,
          options: [
            'Khoa học xã hội & Nhân văn',
            'Khoa học tự nhiên & Công nghệ',
            'Sách giáo dục & trường học',
            'Văn học Việt Nam',
            'Văn học Nước ngoài',
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

        {renderInput({
          label: 'Giá Bìa:',
          name: 'originalPrice',
          type: 'text',
          value: formatCurrency(formData.originalPrice),
          onChange: handleChange,
          disabled: formData.typePrice === 'Sách đặc biệt',
          note: formData.typePrice === 'Sách đặc biệt' ? '* Sách đặc biệt không cần nhập giá bìa' : undefined,
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
          disabled: true,
          note:
            formData.typePrice === 'Sách đặc biệt'
              ? '* Sách đặc biệt, BTC sẽ nhập giá bán sau.'
              : '* Giá được tính tự động theo %',
        })}

        {renderInput({
          label: 'Số Tiền Giải Ngân:',
          name: 'refundPrice',
          type: 'text',
          value: formatCurrency(CalculateRefund(parseCurrency(formData.salePrice), formData.originalPrice)),
          onChange: handleChange,
          disabled: true,
          note:
            formData.typePrice === 'Sách đặc biệt'
              ? '* Sách đặc biệt, BTC sẽ nhập giá hoàn tiền sau.'
              : '* Giá được tính tự động theo %',
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
