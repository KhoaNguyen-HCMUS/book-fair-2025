export const renderInput = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  name,
  format,
  onReset,
  note,
  required = true,
}) => (
  <div className='form-group'>
    <label>{label}</label>
    {note && <small className='input-note'>{note}</small>}
    <div className='input-with-reset'>
      <input
        type={type}
        name={name}
        value={format ? format(value) : value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={disabled ? 'disabled-input' : ''}
      />
      {onReset && !disabled && (
        <button type='button' onClick={onReset} className='reset-field' title='Xóa để nhập lại'>
          ↺
        </button>
      )}
    </div>
  </div>
);

export const renderSelect = ({ label, name, value, onChange, options = [] }) => (
  <div className='form-group'>
    <label>{label}</label>
    <select name={name} value={value} onChange={onChange} required>
      <option value='' disabled>
        Chọn {label}
      </option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export const formatCurrency = (value) => {
  if (!value) return '';
  const stringValue = value.toString();
  const numberValue = parseFloat(stringValue.replace(/[^0-9]/g, ''));
  if (isNaN(numberValue)) return '';
  return new Intl.NumberFormat('vi-VN', {
    style: 'decimal', // Changed from 'currency' to 'decimal'
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numberValue);
};

export const parseCurrency = (value) => {
  if (!value) return '';
  // Convert value to string if it's a number
  const stringValue = value.toString();
  return stringValue.replace(/[^0-9]/g, '');
};
