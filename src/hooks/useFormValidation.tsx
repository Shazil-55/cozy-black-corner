
import { useState } from 'react';

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  isEmail?: boolean;
}

interface FieldError {
  [key: string]: string;
}

export const useFormValidation = <T extends Record<string, any>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FieldError>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });

    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });
    validateField(name, value);
  };

  const validateField = (name: string, value: string, rules?: ValidationRules) => {
    let error = '';

    if (rules?.required && !value) {
      error = 'This field is required';
    } else if (rules?.minLength && value.length < rules.minLength) {
      error = `Minimum length is ${rules.minLength} characters`;
    } else if (rules?.maxLength && value.length > rules.maxLength) {
      error = `Maximum length is ${rules.maxLength} characters`;
    } else if (rules?.pattern && !rules.pattern.test(value)) {
      error = 'Invalid format';
    } else if (rules?.isEmail && !/\S+@\S+\.\S+/.test(value)) {
      error = 'Invalid email address';
    }

    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));

    return error === '';
  };

  const validateForm = (validationRules: Record<string, ValidationRules>) => {
    const newErrors: FieldError = {};
    let isValid = true;

    // Set all fields as touched for validation
    const newTouched: Record<string, boolean> = {};
    Object.keys(values).forEach(key => {
      newTouched[key] = true;
    });
    setTouched(newTouched);

    // Validate all fields
    Object.keys(validationRules).forEach(key => {
      const value = values[key]?.toString() || '';
      const isFieldValid = validateField(key, value, validationRules[key]);
      if (!isFieldValid) {
        isValid = false;
      }
    });

    return isValid;
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues,
    setErrors, // Expose setErrors function
  };
};
