import Select from 'react-select';
import './addressSelector.scss';

const AddressSelector = ({ value, onChange, placeholder = 'Chọn địa chỉ', label = 'Địa chỉ:' }) => {
  const addresses = ['TP.HCM', 'Bến Tre'];

  const addressOptions = addresses.map((address) => ({
    label: address,
    value: address,
  }));

  const selectedOption = value ? addressOptions.find((option) => option.value === value) || null : null;

  return (
    <div className='address-selector'>
      <label className='address-selector__label'>{label}</label>
      <Select
        options={addressOptions}
        value={selectedOption}
        onChange={(option) => {
          const newValue = option ? option.value : '';
          onChange(newValue);
        }}
        className='address-selector__select'
        classNamePrefix='address-selector'
        placeholder={placeholder}
        isClearable
        isSearchable
        noOptionsMessage={() => 'Không tìm thấy địa chỉ'}
      />
    </div>
  );
};

export default AddressSelector;
