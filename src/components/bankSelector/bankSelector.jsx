import Select from 'react-select';
import './bankSelector.scss';

const BankSelector = ({ value, onChange, placeholder = 'N/A', label = 'Chọn ngân hàng:' }) => {
  const bankNames = [
    'Ngân hàng TMCP Việt Nam Thịnh Vượng - VPBank',
    'Ngân hàng TMCP Ngoại thương Việt Nam - Vietcombank',
    'Ngân hàng TMCP Kỹ Thương Việt Nam - Techcombank',
    'Ngân hàng TMCP Công Thương Việt Nam - Vietinbank',
    'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam  - BIDV',
    'Ngân hàng TMCP Quân đội - MBBank',
    'Ngân hàng TMCP Á Châu - ACB',
    'Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam - Agribank',
    'Ngân hàng TMCP phát triển TP. Hồ Chí Minh - HDBank',
    'Ngân hàng TMCP Tiên Phong - TPBank',
    'Ngân hàng thương mại cổ phần Sài Gòn Thương Tín - Sacombank',
    'Ngân hàng TMCP Công Thương Việt Nam - VietinBank',
    'Ngân hàng TMCP Sài Gòn Hà Nội - SHB',
    'Ngân hàng TMCP Phương Đông - OCB',
    'Ngân hàng Thương mại Cổ phần Kiên Long - KienlongBank',
    'Ngân hàng Thương Mại Cổ Phần Sài Gòn - SCB',
    'Ngân hàng thương mại cổ phần Nam Á - Nam A Bank',
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
