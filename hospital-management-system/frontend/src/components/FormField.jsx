import React from 'react';

const FormField = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helpText,
  required = false,
  icon: Icon,
  iconPosition = 'left',
  showPasswordToggle = false,
  showPassword,
  onPasswordToggle,
  options,
  rows,
  disabled = false,
  readOnly = false,
  className = '',
  ...props
}) => {
  const baseInputClasses = 'input-field';
  const iconPadding = '';
  const passwordPadding = showPasswordToggle ? 'pr-10' : '';
  const combinedPadding = `${iconPadding} ${passwordPadding}`.trim();
  
  const inputClasses = `${baseInputClasses} ${combinedPadding} ${error ? 'border-red-500' : ''} ${className}`.trim();

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={inputClasses}
            {...props}
          >
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'textarea':
        return (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            rows={rows || 3}
            className={inputClasses}
            {...props}
          />
        );
      
      default:
        return (
          <input
            id={name}
            name={name}
            type={showPassword && showPasswordToggle ? 'text' : type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            className={inputClasses}
            {...props}
          />
        );
    }
  };

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {helpText && (
        <p className="text-xs text-gray-500 mb-2">{helpText}</p>
      )}
      
      <div className="flex items-center">
        {Icon && iconPosition === 'left' && (
          <div className="flex items-center pointer-events-none mr-3">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        {renderInput()}
        
        {Icon && iconPosition === 'right' && (
          <div className="flex items-center pointer-events-none ml-3">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        {showPasswordToggle && (
          <button
            type="button"
            className="flex items-center ml-3"
            onClick={onPasswordToggle}
          >
            {showPassword ? (
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>
      
      {error && (
        <p className="error-message">{error}</p>
      )}
    </div>
  );
};

export default FormField;
