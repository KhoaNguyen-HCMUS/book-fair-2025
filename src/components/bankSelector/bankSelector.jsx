import Select from 'react-select';
import './bankSelector.scss';

const BankSelector = ({ value, onChange, placeholder = 'N/A', label = 'Chọn ngân hàng:' }) => {
  const bankNames = [
    'Ngân hàng TMCP Việt Nam Thịnh Vượng - VPBank',
    'Ngân hàng TMCP Ngoại thương Việt Nam - Vietcombank',
    'Ngân hàng TMCP Kỹ Thương Việt Nam - Techcombank',
    'Ngân hàng TMCP Công Thương Việt Nam - Vietinbank',
    'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam - BIDV',
    'Ngân hàng TMCP Quân đội - MBBank',
    'Ngân hàng TMCP Á Châu - ACB',
    'Ngân hàng TMCP Sài Gòn Thương Tín - Sacombank',
    'Ngân hàng TMCP Tiên Phong - TPBank',
    'Ngân hàng TMCP Hàng Hải Việt Nam - MSB',
    'Ngân hàng TMCP Xuất Nhập khẩu Việt Nam - Eximbank',
    'Ngân hàng TMCP Bảo Việt - BaoViet Bank',
    'Ngân hàng TMCP Phương Đông - OCB',
    'Ngân hàng TMCP Sài Gòn - SCB',
    'Ngân hàng TMCP Việt Á - VietABank',
    'Ngân hàng TMCP Nam Á - Nam A Bank',
    'Ngân hàng TMCP Bắc Á - BAC A BANK',
    'Ngân hàng TMCP Kiên Long - Kienlongbank',
    'Ngân hàng TMCP Đại Chúng Việt Nam - PVcomBank',
    'Ngân hàng TMCP An Bình - ABBANK',
  ];

  const bankOptions = bankNames.map((name) => ({
    label: name,
    value: name,
  }));

  const selectedOption = value && value !== 'N/A' ? bankOptions.find((option) => option.value === value) || null : null;

  const handleChange = (option) => {
    onChange(option ? option.value : 'N/A');
  };

  return (
    <div className='bank-selector'>
      {label && <label className='bank-selector__label'>{label}</label>}
      <Select
        options={bankOptions}
        value={selectedOption}
        onChange={handleChange}
        placeholder={placeholder}
        isClearable
        isSearchable
        className='bank-selector__select'
        classNamePrefix='bank-selector'
        noOptionsMessage={() => 'Không tìm thấy ngân hàng'}
        loadingMessage={() => 'Đang tải...'}
      />
    </div>
  );
};

export default BankSelector;
