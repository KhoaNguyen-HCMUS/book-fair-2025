import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { renderInput, renderSelect, formatCurrency, parseCurrency } from '../formComponents/formComponents.jsx';

import './formDonationBook.scss';

export const FormDonationBook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    idConsignor: '',
    nameConsignor: '',
    name: '',
    publisher: '',
    author: 'N/A',
    age: '',
    category: '',
    type: 'Sách Quyên Góp',
    originalPrice: '',
    typePrice: '100',
    salePrice: '0',
    refundPrice: '0',
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
      author: 'N/A',
      age: '',
      category: '',
      type: 'Sách Quyên Góp',
      originalPrice: '',
      typePrice: '100',
      salePrice: '0',
      refundPrice: '0',
      sold: 0,
      validate: false,
      stock: 1,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const removeNonNumeric = (value) => {
    return value.replace(/[^0-9]/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.idConsignor || !formData.nameConsignor) {
      toast.error('Vui lòng nhập SĐT người quyên góp và tìm kiếm trước khi thêm sách');
      return;
    }

    setIsLoading(true);
    try {
      const bookData = {
        typeOb: 'product',
        id_member: localStorage.getItem('userID'), // Assuming you store userID in localStorage

        data: {
          id_product: removeNonNumeric(formData.id),
          id_member: localStorage.getItem('userID'), // Assuming you store userID in localStorage
          id_consignor: removeNonNumeric(formData.idConsignor),
          name: formData.name,
          age: formData.age,
          genre: formData.category,
          classify: formData.type,
          bc_cost: parseFloat(parseCurrency(formData.originalPrice)),
          discount: 0,
          price: 0,
          cash_back: 0,
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
    } finally {
      setIsLoading(false);
    }
  };

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
          toast.error('Người quyên góp không thuộc quyền sở hữu của bạn');
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
        toast.error('Không tìm thấy thông tin người Quyên Góp');
        setFormData((prev) => ({
          ...prev,
          nameConsignor: '',
        }));
      }
    } catch {
      toast.error('Lỗi khi lấy thông tin người Quyên Góp');
      setFormData((prev) => ({
        ...prev,
        nameConsignor: '',
      }));
    }
  };

  return (
    <form className='form' onSubmit={handleSubmit}>
      <h2>Thêm Sách Quyên Góp</h2>
      <div className='form-content'>
        <div className='input-group'>
          {renderInput({
            label: 'SĐT Người Quyên Góp:',
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
          label: 'Tên Người Quyên Góp:',
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
        })}

        {renderInput({
          label: 'Phân Loại Sách:',
          name: 'type',
          value: formData.type,
          disabled: true,
          onChange: handleChange,
        })}

        {renderInput({
          label: 'Giá Bán:',
          name: 'salePrice',
          type: 'text',
          value: formatCurrency(formData.salePrice),
          disabled: true,
          note: '* Đối với sách quyên góp, giá bán sẽ được BTC nhập sau',
        })}

        {renderInput({
          label: 'Số Tiền Giải Ngân:',
          name: 'refundPrice',
          type: 'text',
          value: formatCurrency(formData.refundPrice),
          disabled: true,
          note: '* Sách quyên góp nên không hoàn tiền',
        })}
      </div>

      <div className='button-group'>
        <button type='submit' disabled={isLoading} className={isLoading ? 'loading' : ''}>
          {isLoading ? 'Đang xử lý...' : 'Thêm Sách'}
        </button>
        <button type='button' onClick={handleReset} disabled={isLoading}>
          Làm mới
        </button>
      </div>
    </form>
  );
};
